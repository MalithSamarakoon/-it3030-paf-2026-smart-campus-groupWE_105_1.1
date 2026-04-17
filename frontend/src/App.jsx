import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCards from './components/ServiceCards';
import Footer from './components/Footer';
import AccountPage from './pages/AccountPage';
import ProfileEditPage from './pages/ProfileEditPage';
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler.jsx";
import './App.css'


const HomePage = () => (
    <>

        <Hero />
        <ServiceCards />

    </>
)

function App() {

    const location = useLocation();
    const hideLayout = location.pathname === '/registration' || location.pathname === '/login';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {!hideLayout && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/registration" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />

                </Routes>
            </main>
            {!hideLayout && <Footer />}
            <ToastContainer />
        </div>
    );
}

export default App

