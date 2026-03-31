import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCards = () => {
    const services = [
        {
            title: "Resource Catalogue",
            description: "Browse and search through a complete list of lecture halls, labs, and equipment with real-time availability status.",
            link: "/resources",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>

            )
        },
        {
            title: "Booking Management",
            description: "Request facility reservations, view your schedule, and track the approval status of your campus requests.",
            link: "/bookings",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>

            )
        },
        {
            title: "Maintenance Hub",
            description: "Report equipment faults or facility issues instantly and follow the resolution progress from technicians.",
            link: "/maintenance",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                </svg>

            )
        }
    ];

    return (
        <section className="bg-slate-50 py-20 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                        Campus <span className="text-emerald-600">Operations</span> At Your Service
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Streamlining university life through digital asset management and efficient facility workflows.
                    </p>
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 group flex flex-col items-center text-center"
                        >
                            {/* Icon Container */}
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                                {service.icon}
                            </div>

                            {/* Text Content */}
                            <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                                {service.description}
                            </p>

                            {/* Action Button */}
                            <Link
                                to={service.link}
                                className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-800 transition-colors group/btn"
                            >
                                Get Started
                                <span className="transform group-hover/btn:translate-x-1 transition-transform duration-200">
                                    →
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceCards;