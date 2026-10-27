import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';
import '../index.css';


const Login = () => {
    // Shared Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Registration Specific State
    const [fullName, setFullName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // Feedback State
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                await authService.register({
                    email,
                    password,
                    fullName,
                    role: 'ROLE_CUSTOMER'
                });

                setSuccessMsg('Account created successfully! Please sign in.');
                setIsRegistering(false);
                setPassword('');
            } else {
                const data = await authService.login(email, password);
                dispatch(setCredentials(data));

                if (data.role === 'ROLE_CUSTOMER') {
                    navigate('/dashboard/customer');
                } else {
                    navigate('/dashboard/agent');
                }
            }
        } catch (err) {
            setError(
                isRegistering
                    ? 'Registration failed. Email might already be in use.'
                    : 'Invalid credentials or account deactivated.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setSuccessMsg('');
        setPassword('');
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen p-4 lg:p-8"
            style={{
                // Page background - kept dark so the box stands out
                background: `linear-gradient(135deg, #050712, #180d30, #050712)`
            }}
        >
            {/* Main Wide Card Wrapper */}
            <div className="
                flex flex-col md:flex-row 
                w-full max-w-5xl 
                bg-[#160b2b]/80 backdrop-blur-xl 
                border border-pink-500/20 
                rounded-[2rem] 
                shadow-[0_0_50px_rgba(255,0,127,0.15)] 
                overflow-hidden
            ">
                
                {/* Left Side: Form Container */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                        <h2 className="
                                mb-8
                                text-3xl
                                font-extrabold
                                text-center
                                text-transparent
                                bg-clip-text
                                bg-gradient-to-r
                                from-violet-400
                                via-pink-400
                                to-fuchsia-400
                                drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]
                            "
                        >
                            {isRegistering ? 'Create an Account' : 'ZenDesk Login'}
                        </h2>

                        {error && (
                            <p className="mb-6 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl shadow-[0_0_10px_rgba(244,63,94,0.2)] text-center">
                                {error}
                            </p>
                        )}

                        {successMsg && (
                            <p className="mb-6 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)] text-center">
                                {successMsg}
                            </p>
                        )}

                        {isRegistering && (
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-semibold text-violet-300 tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-[#0b071b]/80 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 shadow-inner"
                                    required={isRegistering}
                                />
                            </div>
                        )}

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-semibold text-violet-300 tracking-wide">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0b071b]/80 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 shadow-inner"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block mb-2 text-sm font-semibold text-violet-300 tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0b071b]/80 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 shadow-inner"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-3 mt-2 text-white font-bold tracking-wider uppercase text-sm rounded-xl transition-all duration-300 border
                                ${
                                    isLoading
                                        ? 'bg-slate-800/80 text-purple-300/50 border-purple-500/20 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 border-pink-400/50 shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] hover:scale-[1.02]'
                                }
                            `}
                        >
                            {isLoading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-sm text-violet-300 hover:text-pink-400 transition-colors duration-300 mt-2 text-center block bg-transparent border-none shadow-none focus:outline-none w-full"
                            >
                                {isRegistering
                                    ? 'Already have an account? Sign in'
                                    : "Don't have an account? Register"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Image Container */}
                <div 
                    className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat relative"
                    style={{
                        backgroundImage: `url('/uibackground.png')`,
                    }}
                >
                    {/* Optional: Add a subtle overlay to the image so it matches the dark theme better */}
                    <div className="absolute inset-0 bg-purple-900/10 mix-blend-multiply"></div>
                </div>

            </div>
        </div>
    );
};

export default Login;