import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/api.js';
import googleIcon from '../assets/google-icon.png';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/signin", {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                window.dispatchEvent(new Event("authChange"));
                toast.success(`Welcome back, ${response.data.username}!`);
                navigate("/");
            }
        } catch (error) {
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                "Invalid username or password. Please try again.";
            toast.error(resMessage);
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleLogin = () => {
        const backendOrigin = new URL(api.defaults.baseURL).origin;
        window.location.href = `${backendOrigin}/oauth2/authorization/google`;
    };

    return (
        <div className="w-full max-w-sm p-8 border-2 border-green-400 rounded-[2.5rem] shadow-lg bg-white mx-4">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-8">
                Smart Campus Sign In
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-green-700 font-semibold mb-2 ml-1 text-sm">
                        Username or Email
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-green-700 font-semibold mb-2 ml-1 text-sm">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all active:scale-95 mt-2 ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                    {loading ? "Verifying..." : "Login"}
                </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 font-medium">OR</span>
                </div>
            </div>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-green-400 py-3 rounded-2xl shadow-sm transition-all active:scale-95 text-gray-700 font-bold"
            >
                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>

            <div className="mt-8 text-center">
                <div className="text-gray-600 text-sm">
                    Don't have a student account?{' '}
                    <Link to="/registration" className="text-green-700 font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;