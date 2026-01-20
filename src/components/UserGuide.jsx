import React, { useState } from 'react';
import { X, HelpCircle, Sparkles, Zap, GitFork, BookOpen, MessageSquare, Sliders, ArrowRight, Lightbulb, Target, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserGuide = ({ isOpen, onClose }) => {
    const sections = [
        {
            id: 'basics',
            title: 'Prompting Fundamentals',
            icon: <Lightbulb size={22} color="#fbbf24" />,
            description: 'Master the art of high-signal instructions.',
            steps: [
                {
                    title: 'Start with an Intent',
                    text: 'Don\'t try to write the perfect prompt first. Just type your core idea like "Write a technical blog about AI." Let Consense do the heavy lifting of expansion.'
                },
                {
                    title: 'The MCP Architecture',
                    text: 'Consense automatically wraps your idea in Domain, Intent, Constraints, and Composition layers. This "scaffolding" is what makes LLMs respond with precision.'
                },
                {
                    title: 'The Refinement Loop',
                    text: 'Prompting is iterative. Use the "Suggested Refiners" after your first generation to automatically fix common issues like verbosity or missing edge cases.'
                }
            ]
        },
        {
            id: 'tools',
            title: 'Interface Navigation',
            icon: <Target size={22} color="#60a5fa" />,
            description: 'Hidden powers and how to use them.',
            steps: [
                {
                    title: 'Model Dialects',
                    text: 'Switch between GPT and Claude dialects in the settings. Claude loves XML structures, while GPT responds best to Markdown logic. Consense handles the translation.'
                },
                {
                    title: 'Session Branching',
                    text: 'Click the "Fork" (GitFork) icon to branch your current refinement. It\'s like a "save game" – explore a new direction without losing your original progress.'
                },
                {
                    title: 'No-Hype Toggle',
                    text: 'Turn this on to remove marketing "fluff." It forces the AI to output zero-filler, factual, and strictly logical content. Ideal for technical and legal prompts.'
                }
            ]
        },
        {
            id: 'library',
            title: 'Using the Library',
            icon: <BookOpen size={22} color="#4ade80" />,
            description: 'Leveraging pre-built expert frameworks.',
            steps: [
                {
                    title: 'Search & Discover',
                    text: 'Use the Library search to find specialized frameworks like "ASO," "Regex," or "Persona Builder." These are pre-optimized expert patterns.'
                },
                {
                    title: 'Save your own',
                    text: 'When you build a prompt that works perfectly, save it as a custom template. It goes into your private library for instant use in any future session.'
                }
            ]
        }
    ];

    const [activeSection, setActiveSection] = useState('basics');

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 21000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                    width: '95%', maxWidth: '850px', height: '80vh',
                    background: '#0a0a0a', border: '1px solid #222',
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,1)'
                }}
            >
                {/* Header */}
                <div style={{ padding: '32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <HelpCircle size={28} color="#4ade80" /> Mastery Guide
                        </h2>
                        <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '0.95rem' }}>Learn how to architect 10x better prompts with Consense.</p>
                    </div>
                    <button onClick={onClose} style={{ background: '#1a1a1a', border: 'none', color: '#666', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* Sidebar Nav */}
                    <div style={{ width: '260px', borderRight: '1px solid #1a1a1a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.2)' }}>
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', borderRadius: '12px',
                                    background: activeSection === section.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    border: activeSection === section.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                                    color: activeSection === section.id ? '#fff' : '#666',
                                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {section.icon}
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{section.title}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{section.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    {sections.find(s => s.id === activeSection).steps.map((step, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '24px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'rgba(74,222,128,0.1)', color: '#4ade80',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.9rem', fontWeight: 800, flexShrink: 0
                                            }}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#eee', fontWeight: 600 }}>{step.title}</h4>
                                                <p style={{ margin: 0, color: '#888', fontSize: '0.95rem', lineHeight: '1.7' }}>{step.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    marginTop: '48px', padding: '24px',
                                    background: 'linear-gradient(135deg, rgba(74,222,128,0.05) 0%, rgba(96,165,250,0.05) 100%)',
                                    border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <Sparkles size={18} color="#4ade80" />
                                        <span style={{ fontWeight: 600, color: '#fff' }}>Pro Tip</span>
                                    </div>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        The best users never stop at the first generation. Use the **Terminal Input** at the bottom to give human feedback like "Be more aggressive" or "Simplify the technical bits."
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid #1a1a1a', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} /> Systems active. All logic locally processed.
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 24px', background: '#fff', color: '#000',
                            border: 'none', borderRadius: '10px', fontWeight: 700,
                            fontSize: '0.85rem', cursor: 'pointer'
                        }}
                    >
                        Got it, thanks!
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserGuide;
