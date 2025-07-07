import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotifyService } from '../../services/spotifyService';
import { Music, CheckCircle, XCircle, Loader } from 'lucide-react';

const SpotifyCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing authentication...');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            if (error) {
                setStatus('error');
                setMessage('Authentication was cancelled or failed');
                setTimeout(() => navigate('/music'), 3000);
                return;
            }

            if (!code || !state) {
                setStatus('error');
                setMessage('Invalid authentication response');
                setTimeout(() => navigate('/music'), 3000);
                return;
            }

            try {
                const spotifyService = SpotifyService.getInstance();
                const success = await spotifyService.handleCallback(code, state);

                if (success) {
                    setStatus('success');
                    setMessage('Successfully connected to Spotify!');
                    setTimeout(() => navigate('/music'), 2000);
                } else {
                    setStatus('error');
                    setMessage('Failed to connect to Spotify');
                    setTimeout(() => navigate('/music'), 3000);
                }
            } catch (error) {
                console.error('Callback error:', error);
                setStatus('error');
                setMessage('An error occurred during authentication');
                setTimeout(() => navigate('/music'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader className="h-8 w-8 text-blue-400 animate-spin" />;
            case 'success':
                return <CheckCircle className="h-8 w-8 text-green-400" />;
            case 'error':
                return <XCircle className="h-8 w-8 text-red-400" />;
        }
    };

    const getColor = () => {
        switch (status) {
            case 'loading':
                return 'from-blue-500 to-purple-500';
            case 'success':
                return 'from-green-500 to-emerald-500';
            case 'error':
                return 'from-red-500 to-pink-500';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                className="max-w-md w-full text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${getColor()} rounded-full flex items-center justify-center`}
                    animate={status === 'loading' ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Music className="h-10 w-10 text-white" />
                </motion.div>

                <motion.div
                    className="glass rounded-2xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-6">
                        {getIcon()}
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-4">
                        Spotify Authentication
                    </h1>

                    <p className="text-white/70 mb-6">
                        {message}
                    </p>

                    {status === 'loading' && (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                    )}

                    {status !== 'loading' && (
                        <motion.button
                            onClick={() => navigate('/music')}
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Continue to Music
                        </motion.button>
                    )}
                </motion.div>

                <p className="text-white/40 text-sm mt-4">
                    {status === 'loading' && 'Please wait while we connect your account...'}
                    {status === 'success' && 'Redirecting you back to the music page...'}
                    {status === 'error' && 'You will be redirected back to the music page...'}
                </p>
            </motion.div>
        </div>
    );
};

export default SpotifyCallbackPage;
