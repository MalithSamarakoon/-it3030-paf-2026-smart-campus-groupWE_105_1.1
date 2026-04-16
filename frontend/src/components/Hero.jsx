import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import resImage from '../assets/lectureHall.jpeg';
import bookImage from '../assets/resourceBooking.webp';
import mainImage from '../assets/incidentRprt.webp';
import notifyImage from '../assets/notifications.png';


const Hero = () => {
    const slides = [
        {
            id: 1,
            image: resImage,
            title: "Explore Campus Resources",
            description: "Access a complete catalogue of lecture halls, specialized labs, and high-end equipment at your fingertips."
        },
        {
            id: 2,
            image: bookImage,
            title: "Smart Booking Management",
            description: "Effortlessly schedule facilities with automated conflict checking and a transparent approval workflow."
        },
        {
            id: 3,
            image: mainImage,
            title: "Rapid Incident Reporting",
            description: "Report equipment faults or facility issues instantly and track the maintenance lifecycle in real-time."
        },
        {
            id: 4,
            image: notifyImage,
            title: "Real-Time Status Updates",
            description: "Stay informed with instant notifications on booking approvals, ticket updates, and staff comments."
        }
    ];

    return (
        <section className="w-full h-[500px] md:h-[600px] overflow-hidden bg-slate-50">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="h-full mySwiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full flex flex-col md:flex-row items-center px-8 md:px-24 bg-white">

                            {/* Left Content: Text Section */}
                            <div className="w-full md:w-1/2 z-10 space-y-6 text-left">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
                                    {slide.title.split(' ').map((word, i) =>
                                        i === 1 ? <span key={i} className="text-emerald-600"> {word} </span> : word + ' '
                                    )}
                                </h1>
                                <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                                    {slide.description}
                                </p>
                                <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                    Get Started
                                </button>
                            </div>

                            {/* Right Content: Image Section */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto flex justify-center items-center p-4">
                                <div className="relative w-full h-full max-h-[400px] overflow-hidden rounded-2xl shadow-2xl border-4 border-emerald-50">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom CSS to handle the Green Navigation buttons */}
            <style>{`
                .swiper-button-next, .swiper-button-prev {
                    color: #059669 !important; /* emerald-600 */
                }
                .swiper-pagination-bullet-active {
                    background: #059669 !important;
                }
            `}</style>
        </section>
    );
};

export default Hero;