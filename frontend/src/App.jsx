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
import UserManagementPage from "./pages/admin/UserManagementPage.jsx";
import ResourceList from './pages/resources/ResourceList';
import ResourceDetails from './pages/resources/ResourceDetails';
import ResourceForm from './pages/resources/ResourceForm';
import BookingList from './pages/bookings/BookingList';
import BookingForm from './pages/bookings/BookingForm';
import MaintenancePage from './pages/MaintenancePage';
import TicketDetailPage from './pages/TicketDetailPage';
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
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    <Route path="/profile" element={<AccountPage />} />
                    <Route path="/profile/edit" element={<ProfileEditPage />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />

                    <Route path="/resources" element={<ResourceList />} />
                    <Route path="/resources/new" element={<ResourceForm />} />
                    <Route path="/resources/:id" element={<ResourceDetails />} />
                    <Route path="/resources/edit/:id" element={<ResourceForm />} />

                    <Route path="/bookings" element={<BookingList />} />
                    <Route path="/bookings/new" element={<BookingForm />} />
                    <Route path="/bookings/edit/:id" element={<BookingForm />} />

                    <Route path="/maintenance" element={<MaintenancePage />} />
                    <Route path="/maintenance/:id" element={<TicketDetailPage />} />

                </Routes>
            </main>
            {!hideLayout && <Footer />}
            <ToastContainer />
        </div>
    );
}

export default App

