import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ type: '', capacity: '', location: '' });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = storedUser?.roles?.includes('ROLE_ADMIN');

    const normalizeFilters = (source) => ({
        type: source?.type || '',
        capacity: source?.capacity || '',
        location: (source?.location || '').trim(),
    });

    const buildQueryParams = (activeFilters) => {
        const queryParams = new URLSearchParams();

        if (activeFilters.type) queryParams.append('type', activeFilters.type);

        const parsedCapacity = Number(activeFilters.capacity);
        if (activeFilters.capacity !== '' && Number.isFinite(parsedCapacity) && parsedCapacity >= 0) {
            queryParams.append('capacity', String(parsedCapacity));
        }

        if (activeFilters.location) queryParams.append('location', activeFilters.location);

        return queryParams;
    };

    const applyClientSideFilters = (data, activeFilters) => {
        const parsedCapacity = Number(activeFilters.capacity);
        const hasValidCapacity = activeFilters.capacity !== '' && Number.isFinite(parsedCapacity) && parsedCapacity >= 0;
        const normalizedLocation = activeFilters.location.toLowerCase();

        return data.filter((resource) => {
            const matchesType = !activeFilters.type || resource.type === activeFilters.type;
            const matchesCapacity = !hasValidCapacity || (Number(resource.capacity) || 0) >= parsedCapacity;
            const matchesLocation = !normalizedLocation || String(resource.location || '').toLowerCase().includes(normalizedLocation);

            return matchesType && matchesCapacity && matchesLocation;
        });
    };

    const fetchResources = async (sourceFilters = filters) => {
        try {
            setLoading(true);
            const activeFilters = normalizeFilters(sourceFilters);
            const queryParams = buildQueryParams(activeFilters);
            const queryString = queryParams.toString();

            const response = await api.get(queryString ? `/resources?${queryString}` : '/resources');
            const list = Array.isArray(response.data) ? response.data : [];

            // Keep filtering stable even if backend filtering is inconsistent for some combinations.
            setResources(applyClientSideFilters(list, activeFilters));
        } catch (error) {
            toast.error("Failed to load resources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const submittedFilters = {
            type: formData.get('type') || '',
            capacity: formData.get('capacity') || '',
            location: formData.get('location') || '',
        };

        setFilters(submittedFilters);
        fetchResources(submittedFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = { type: '', capacity: '', location: '' };
        setFilters(clearedFilters);
        fetchResources(clearedFilters);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await api.delete(`/resources/${id}`);
                setResources(resources.filter(r => r.id !== id));
                toast.success("Resource deleted successfully");
            } catch (error) {
                toast.error("Failed to delete resource");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Resources Catalogue</h1>
                {isAdmin && (
                    <Link to="/resources/new" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-emerald-700 transition duration-300 shadow-md">
                        + Add Resource
                    </Link>
                )}
            </div>

            {/* Filters */}
            <form onSubmit={handleFilterSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        <option value="">All Types</option>
                        <option value="ROOM">Lecture Hall</option>
                        <option value="LAB">Lab</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g. Building A" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Min Capacity</label>
                    <input type="number" name="capacity" value={filters.capacity} onChange={handleFilterChange} placeholder="e.g. 50" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                    <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition duration-300">
                        Filter
                    </button>
                    <button type="button" onClick={handleClearFilters} className="ml-3 bg-slate-200 text-slate-800 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 transition duration-300">
                        Clear
                    </button>
                </div>
            </form>

            {/* Resource Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <th className="p-4 font-bold text-sm uppercase">Name</th>
                            <th className="p-4 font-bold text-sm uppercase">Type</th>
                            <th className="p-4 font-bold text-sm uppercase">Capacity</th>
                            <th className="p-4 font-bold text-sm uppercase">Location</th>
                            <th className="p-4 font-bold text-sm uppercase">Status</th>
                            <th className="p-4 font-bold text-sm uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500">Loading resources...</td>
                            </tr>
                        ) : resources.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500">No resources found matching the criteria.</td>
                            </tr>
                        ) : (
                            resources.map((res) => (
                                <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-semibold text-slate-800">{res.name}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.type === 'LAB' ? 'bg-purple-100 text-purple-700' : res.type === 'ROOM' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {res.type === 'ROOM' ? 'LECTURE HALL' : res.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600">{res.capacity || 'N/A'}</td>
                                    <td className="p-4 text-slate-600">{res.location}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${res.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {res.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-3">
                                        <Link to={`/resources/${res.id}`} className="text-emerald-600 hover:text-emerald-800 font-semibold transition text-sm">View</Link>
                                        {isAdmin && (
                                            <>
                                                <Link to={`/resources/edit/${res.id}`} className="text-blue-600 hover:text-blue-800 font-semibold transition text-sm">Edit</Link>
                                                <button onClick={() => handleDelete(res.id)} className="text-red-500 hover:text-red-700 font-semibold transition text-sm">Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResourceList;
