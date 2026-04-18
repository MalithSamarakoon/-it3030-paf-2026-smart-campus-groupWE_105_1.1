import {Routes, Route, useLocation} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ResourceList from './pages/resources/ResourceList';
import ResourceForm from './pages/resources/ResourceForm';
import ResourceDetails from './pages/resources/ResourceDetails';
import BookingList from './pages/bookings/BookingList';
import BookingForm from './pages/bookings/BookingForm';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCards from './components/ServiceCards';
import Footer from './components/Footer';
import AccountPage from './pages/AccountPage';
import ProfileEditPage from './pages/ProfileEditPage';
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler.jsx";
import UserManagementPage from "./pages/admin/UserManagementPage.jsx";
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
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/registration" element={<RegistrationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                    <Route path="/profile" element={<AccountPage/>}/>
                    <Route path="/profile/edit" element={<ProfileEditPage/>}/>
                    <Route path="/admin/users" element={<UserManagementPage/>}/>
                    <Route path="/resources" element={<ResourceList/>}/>
                    <Route path="/resources/new" element={<ResourceForm/>}/>
                    <Route path="/resources/edit/:id" element={<ResourceForm/>}/>
                    <Route path="/resources/:id" element={<ResourceDetails/>}/>
                    <Route path="/bookings" element={<BookingList/>}/>
                    <Route path="/bookings/new" element={<BookingForm/>}/>
                    <Route path="/bookings/edit/:id" element={<BookingForm/>}/>

                </Routes>
            </main>
            {!hideLayout && <Footer />}
            <ToastContainer/>
        </div>
    );
}

export default App
