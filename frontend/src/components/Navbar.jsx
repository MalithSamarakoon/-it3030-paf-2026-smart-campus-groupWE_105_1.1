import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileImage from '../assets/profileImg.png';

const Navbar = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();


    const checkAuth = () => {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
    };


    useEffect(() => {
        window.addEventListener("authChange", checkAuth);
        return () => {
            window.removeEventListener("authChange", checkAuth);
        };
    }, []);


    const handleSignOut = () => {
        localStorage.removeItem('user'); // Clear JWT and User data
        window.dispatchEvent(new Event("authChange")); // Notify app to update state
        setShowDropdown(false);
        navigate('/login');
    };

    return (
        <header className="w-full shadow-sm sticky top-0 z-50">
            {/* Top Bar: Logo, Notifications, and Profile/Auth */}
            <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-emerald-50">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg transform transition-transform group-hover:rotate-12 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">SC</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-800">
                        Smart<span className="text-emerald-600">Campus</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {/* Notification Icon (Visible only when logged in) */}
                    {user && (
                        <button className="relative p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                    )}

                    <div className="relative">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-800 leading-tight">{user.username}</p>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                                        {/* Display first role (e.g., ROLE_STUDENT) */}
                                        {user.roles && user.roles[0]?.replace('ROLE_', '')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="focus:outline-none ring-2 ring-transparent hover:ring-emerald-400 rounded-full transition-all"
                                >
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover"
                                    />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-600 font-semibold hover:text-emerald-700 transition-colors">
                                    Login
                                </Link>
                                <Link to="/registration" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all active:scale-95">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Profile Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Account Menu</p>
                                </div>
                                <ul className="py-1">
                                    <li>
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowDropdown(false)}
                                            className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 transition-colors"
                                        >
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Bar: Links */}
            <nav className="bg-emerald-600">
                <ul className="flex justify-center items-center gap-10 py-3.5 text-xs font-bold text-emerald-50 tracking-wide uppercase">
                    <li className="hover:text-white cursor-pointer transition-colors relative group">
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </li>
                    <li className="hover:text-white cursor-pointer transition-colors relative group">
                        <Link to="/resources">Resources</Link>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </li>
                    <li className="hover:text-white cursor-pointer transition-colors relative group">
                        <Link to="/bookings">Bookings</Link>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </li>
                    <li className="hover:text-white cursor-pointer transition-colors relative group">
                        <Link to="/maintenance">Maintenance</Link>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </li>
                    <li className="hover:text-white cursor-pointer transition-colors relative group">
                        FAQ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;