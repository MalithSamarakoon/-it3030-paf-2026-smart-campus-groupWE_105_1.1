import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveUser } from '../utils/auth';
import { toast } from 'react-toastify';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            saveUser({ token });
            toast.success("Successfully logged in with Google!");
            navigate('/');
        } else {
            toast.error("Google login failed.");
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );
};

export default OAuth2RedirectHandler;