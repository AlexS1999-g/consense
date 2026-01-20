import React from 'react';
import { X, CheckCircle2, Zap, Rocket, Layers, Scissors, GitFork, Search, BookOpen, UserCheck, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BuildLogs = ({ isOpen, onClose }) => {
    const logs = [
        {
            version: 'v1.4',
            title: 'The Great Library Expansion',
            date: 'Jan 20, 2026',
            description: 'Massive upgrade to the template system and discovery tools.',
            icon: <BookOpen size={20} color="#4ade80" />,
            tasks: [
                'Expanded native library to 30 high-impact templates.',
                'Implemented real-time search-as-you-type in Library.',
                'Added template categorization (Engineering, Business, Creative).',
                'Optimized library scroll performance for large datasets.'
            ]
        },
        {
            version: 'v1.3',
            title: 'Forking & Versioning',
            date: 'Jan 19, 2026',
            description: 'Advanced session control and non-linear prompt exploration.',
            icon: <GitFork size={20} color="#60a5fa" />,
            tasks: [
                'Implemented "Session Branching" (Forking) to explore divergent paths.',
                'Added visual feedback for branched sessions in the sidebar.',
                'Integrated Library navigation into the top global header.',
                'Fixed z-index layers for navigation accessibility.'
            ]
        },
        {
            version: 'v1.2',
            title: 'LLM Multi-Dialect Support',
            date: 'Jan 19, 2026',
            description: 'Optimizing output specifically for different model families.',
            icon: <Zap size={20} color="#fbbf24" />,
            tasks: [
                'Added "Model Dialect" selection (Claude vs GPT).',
                'Implemented Claude-specific hierarchical XML instruction format.',
                'Standardized GPT Markdown logic headers.',
                'Created "No Hype" mode for zero-fluff factual responses.'
            ]
        },
        {
            version: 'v1.1',
            title: 'Refinement intelligence',
            date: 'Jan 18, 2026',
            description: 'Transforming static prompts into dynamic conversations.',
            icon: <Search size={20} color="#a78bfa" />,
            tasks: [
                'Built the Suggestion Engine for 1-click prompt improvements.',
                'Added terminal-style manual refinement input.',
                'Implemented prompt history tracking for session continuity.',
                'Added "Export to Markdown" for professional delivery.'
            ]
        },
        {
            version: 'v1.0',
            title: 'Platform Foundation',
            date: 'Jan 18, 2026',
            description: 'Establishing the core MCP architecture and obsidian aesthetic.',
            icon: <Rocket size={20} color="#f472b6" />,
            tasks: [
                'Designed the obsidian-dark StarField UI.',
                'Engineered the Prompt MCP (Model Context Protocol) builder.',
                'Implemented Auth system (Login/Register UX).',
                'Created sidebar session management and persistent storage.',
                'Developed responsive mobile-first sidebar architecture.'
            ]
        }
    ];

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 20000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(15px)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                style={{
                    width: '95%', maxWidth: '700px', maxHeight: '85vh',
                    background: '#0a0a0a', border: '1px solid #222',
                    borderRadius: '20px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,1)'
                }}
            >
                {/* Header */}
                <div style={{ padding: '32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Layers size={24} color="#666" /> Build Dashboard
                        </h2>
                        <p style={{ margin: '6px 0 0 0', color: '#555', fontSize: '0.9rem' }}>Comprehensive task history and platform evolution.</p>
                    </div>
                    <button onClick={onClose} style={{ background: '#1a1a1a', border: 'none', color: '#666', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {logs.map((log, idx) => (
                        <div key={log.version} style={{ position: 'relative' }}>
                            {/* Vertical Line Connector */}
                            {idx !== logs.length - 1 && (
                                <div style={{ position: 'absolute', left: '10px', top: '30px', bottom: '-40px', width: '1px', background: 'linear-gradient(to bottom, #222, transparent)' }} />
                            )}

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: '#000', border: '1px solid #333',
                                    zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#444' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{log.version} &bull; {log.date}</span>
                                            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#eee', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {log.icon} {log.title}
                                            </h3>
                                        </div>
                                        <div style={{ padding: '4px 12px', background: 'rgba(74,222,128,0.05)', borderRadius: '20px', border: '1px solid rgba(74,222,128,0.1)' }}>
                                            <span style={{ color: '#4ade80', fontSize: '0.7rem', fontWeight: 700 }}>VERIFIED</span>
                                        </div>
                                    </div>
                                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>{log.description}</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        {log.tasks.map((task, tidx) => (
                                            <div key={tidx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#ccc' }}>
                                                <CheckCircle2 size={14} color="#4ade80" style={{ flexShrink: 0 }} />
                                                <span>{task}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#444' }}>Current Build: Stable {logs[0].version} | Total Tasks Completed: {logs.reduce((acc, current) => acc + current.tasks.length, 0)}</p>
                </div>
            </motion.div>
        </div>
    );
};

export default BuildLogs;
