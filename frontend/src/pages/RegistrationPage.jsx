import RegistrationForm from '../components/RegistrationForm';

const RegistrationPage = () => {
    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl border-2 border-green-400 p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-8">
                    Smart Campus Hub
                </h2>
                <RegistrationForm />
            </div>
        </div>
    );
};

export default RegistrationPage;