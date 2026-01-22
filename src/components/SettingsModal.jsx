import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Cpu, Server, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsModal = ({ isOpen, onClose, config, onSave }) => {
    const [localConfig, setLocalConfig] = useState(config);

    useEffect(() => {
        setLocalConfig(config);
    }, [config, isOpen]);

    const handleSave = () => {
        onSave(localConfig);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 22000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                    width: '90%', maxWidth: '500px',
                    background: '#0a0a0a', border: '1px solid #222',
                    borderRadius: '16px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                }}
            >
                <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={20} /> Integration Settings
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Provider Selection */}
                    <div>
                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '12px' }}>GENERATION ENGINE</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            {[
                                { id: 'mock', label: 'Simulation', icon: <Cpu size={16} /> },
                                { id: 'ollama', label: 'Ollama (Local)', icon: <Server size={16} /> },
                                { id: 'openai', label: 'OpenAI', icon: <Key size={16} /> }
                            ].map(provider => (
                                <button
                                    key={provider.id}
                                    onClick={() => setLocalConfig({ ...localConfig, provider: provider.id })}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        padding: '12px', borderRadius: '8px',
                                        border: localConfig.provider === provider.id ? '1px solid #4ade80' : '1px solid #333',
                                        background: localConfig.provider === provider.id ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)',
                                        color: localConfig.provider === provider.id ? '#fff' : '#666',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {provider.icon}
                                    <span style={{ fontSize: '0.8rem' }}>{provider.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* OpenAI Config */}
                    <AnimatePresence>
                        {localConfig.provider === 'openai' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '8px' }}>OPENAI API KEY</label>
                                <div style={{ position: 'relative' }}>
                                    <Key size={16} color="#666" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                                    <input
                                        type="password"
                                        placeholder="sk-..."
                                        value={localConfig.openAIKey}
                                        onChange={(e) => setLocalConfig({ ...localConfig, openAIKey: e.target.value })}
                                        style={{
                                            width: '100%', padding: '10px 10px 10px 40px',
                                            background: '#000', border: '1px solid #333',
                                            borderRadius: '8px', color: '#fff', outline: 'none',
                                            fontFamily: 'monospace'
                                        }}
                                    />
                                </div>
                                <p style={{ margin: '8px 0 0 0', color: '#444', fontSize: '0.75rem' }}>
                                    Keys are stored strictly in your browser's local storage.
                                </p>
                            </motion.div>
                        )}
                        {localConfig.provider === 'ollama' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <p style={{ margin: 0, color: '#666', fontSize: '0.8rem', padding: '12px', background: 'rgba(255,191,36,0.1)', border: '1px solid rgba(255,191,36,0.2)', borderRadius: '8px' }}>
                                    Ensure Ollama is running (`ollama serve`). Defaults to Llama 3 via localhost:11434.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                <div style={{ padding: '24px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 24px', background: '#fff', color: '#000',
                            border: 'none', borderRadius: '8px', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        Save Configuration
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default SettingsModal;
