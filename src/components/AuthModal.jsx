import React, { useState } from 'react';
import { X, Lock, User, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/AuthService';

export const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));

        try {
            let user;
            if (isRegistering) {
                user = AuthService.register(username, password);
            } else {
                user = AuthService.login(username, password);
            }
            onLogin(user);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: '100%', maxWidth: '380px',
                background: '#1a1a1a', border: '1px solid #333',
                borderRadius: '16px', padding: '32px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'transparent', border: 'none', color: '#666',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '24px' }}>
                    {isRegistering ? 'Save your sessions permanently.' : 'Sign in to access your history.'}
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                        padding: '12px', borderRadius: '8px', marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '14px 14px 14px 48px',
                                background: '#111', border: '1px solid #333',
                                borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
                                outline: 'none', height: '52px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '14px 14px 14px 48px',
                                background: '#111', border: '1px solid #333',
                                borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
                                outline: 'none', height: '52px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '12px', padding: '14px',
                            background: '#fff', color: '#000',
                            border: 'none', borderRadius: '12px',
                            fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            height: '52px'
                        }}
                    >
                        {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        type="button"
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        style={{
                            background: 'transparent', border: 'none', color: '#fff',
                            fontWeight: 500, marginLeft: '8px', cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {isRegistering ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};
