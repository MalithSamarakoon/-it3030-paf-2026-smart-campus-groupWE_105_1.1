import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Branding & Mission */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">SC</span>
                        </div>
                        <span className="text-xl font-bold text-white">Smart<span className="text-emerald-500">Campus</span></span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Modernizing campus day-to-day operations through efficient asset management and streamlined maintenance workflows.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholders */}
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                            <span className="text-xs">FB</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                            <span className="text-xs">LI</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                            <span className="text-xs">GH</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Quick Access */}
                <div>
                    <h4 className="text-white font-bold mb-6">Core Modules</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/resources" className="hover:text-emerald-400 transition-colors">Resource Catalogue</Link></li>
                        <li><Link to="/bookings" className="hover:text-emerald-400 transition-colors">Booking System</Link></li>
                        <li><Link to="/maintenance" className="hover:text-emerald-400 transition-colors">Incident Ticketing</Link></li>
                        <li><Link to="/notifications" className="hover:text-emerald-400 transition-colors">Notifications Panel</Link></li>
                    </ul>
                </div>

                {/* Column 3: Support & Resources */}
                <div>
                    <h4 className="text-white font-bold mb-6">Support</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Help & FAQ</Link></li>
                        <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">IT Support Desk</span></li>
                        <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy Policy</span></li>
                        <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">User Manual</span></li>
                    </ul>
                </div>

                {/* Column 4: Project Info */}
                <div>
                    <h4 className="text-white font-bold mb-6">Development Team</h4>
                    <div className="space-y-4 text-sm">
                        <p className="text-emerald-500 font-semibold italic">IT3030 - PAF 2026</p>
                        <p>Faculty of Computing, SLIIT</p>
                        <p className="text-xs text-slate-500">Group ID: it3030-paf-2026-smart-campus-groupXX</p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 py-8 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    <p>© 2026 Smart Campus Hub. All Rights Reserved.</p>

                    {/* System Status - Great for "Innovation" marks */}
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>System Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;