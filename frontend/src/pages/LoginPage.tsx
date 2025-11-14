import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { loginUser } from '../services/authService';
import AuthInput from '../components/shared/AuthInput';
import Button from '../components/shared/Button';
import Alert from '../components/shared/Alert';
import { motion } from 'framer-motion';
import Modal from '../components/shared/Modal';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const navigate = useNavigate();
    const { login, userInfo } = useAuthStore();

    useEffect(() => {
        if (userInfo) {
            navigate('/app', { replace: true });
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError('');
        setIsLoading(true);
        try {
            const userData = await loginUser(email, password);
            login(userData);
            navigate('/app', { replace: true });
        } catch (err: any) {
            setModalError(err.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                className="min-h-screen w-full flex justify-center items-center p-4 bg-cover bg-center bg-no-repeat"
                // style={{ backgroundImage: "url('https://images.pexels.com/photos/7233131/pexels-photo-7233131.jpeg')" }}
                style={{ backgroundImage: "url('https://images.pexels.com/photos/7233131/pexels-photo-7233131.jpeg?w=1920&h=1080')" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white bg-opacity-90 border border-border rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-md">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">IFQE Portal</h1>
                            <p className="mt-2 text-gray-600">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-9">
                            <AuthInput
                                id="email"
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <AuthInput
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <div>
                                <Button type="submit" isLoading={isLoading} fullWidth={true} variant="primary" size="lg">
                                    Sign In
                                </Button>
                            </div>
                        </form>
                          <div className='text-center  rounded-xl text-slate-500 '>
                        <button onClick={()=>  navigate('/')}>Back to Homepage</button>
                    </div>
                    </div>
                  
                </motion.div>
            </div>

            <Modal isOpen={!!modalError} onClose={() => setModalError('')} title="Login Failed">
                <Alert message={modalError} type="error" />
                <div className="text-right mt-4">
                    <Button onClick={() => setModalError('')}>Close</Button>
                </div>
            </Modal>
        </>
    );
};

export default LoginPage;
