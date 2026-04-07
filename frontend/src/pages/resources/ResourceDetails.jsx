import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

const ResourceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = storedUser?.roles?.includes('ROLE_ADMIN');

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await api.get(`/resources/${id}`);
                setResource(response.data);
            } catch (error) {
                toast.error("Resource not found");
                navigate('/resources');
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await api.delete(`/resources/${id}`);
                toast.success("Resource deleted successfully");
                navigate('/resources');
            } catch (error) {
                toast.error("Failed to delete resource");
            }
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-500 text-lg font-semibold">Loading resource details...</div>;
    }

    if (!resource) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 w-full overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
                
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">{resource.name}</h1>
                        <p className="text-slate-500 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            {resource.location}
                        </p>
                    </div>
                    <span className={`px-4 py-1.5 text-sm font-black rounded-full ${resource.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {resource.status.replace('_', ' ')}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 font-bold">TYPE</div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Resource Type</p>
                            <p className="text-lg font-semibold text-slate-800">{resource.type === 'ROOM' ? 'LECTURE HALL' : resource.type}</p>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 font-bold">CAP</div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Capacity</p>
                            <p className="text-lg font-semibold text-slate-800">{resource.capacity || 'Not Specified'}</p>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 font-bold">TIME</div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Availability Window</p>
                            <p className="text-lg font-semibold text-slate-800">
                                {resource.availabilityStart ? resource.availabilityStart.substring(0, 5) : 'Any'} - 
                                {resource.availabilityEnd ? resource.availabilityEnd.substring(0, 5) : 'Any'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 font-bold">BY</div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Added By</p>
                            <p className="text-lg font-semibold text-slate-800">{resource.createdByUsername || 'System'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <Link to="/resources" className="text-slate-600 font-semibold hover:text-emerald-600 transition-colors">
                        ← Back to List
                    </Link>
                    
                    {isAdmin && (
                        <div className="space-x-4">
                            <Link to={`/resources/edit/${resource.id}`} className="px-6 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                                Edit
                            </Link>
                            <button onClick={handleDelete} className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceDetails;
