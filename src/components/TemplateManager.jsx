import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Trash2, Search, Sparkles } from 'lucide-react';
import { TemplateService } from '../services/TemplateService';
import { motion, AnimatePresence } from 'framer-motion';

const TemplateManager = ({ isOpen, onClose, onLoadTemplate, currentDraft }) => {
    const [templates, setTemplates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('list'); // 'list' or 'save'
    const [newTemplateName, setNewTemplateName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTemplates(TemplateService.getTemplates());
            setSearchTerm('');
            setView('list');
        }
    }, [isOpen]);

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!newTemplateName.trim() || !currentDraft) return;

        // Extract MCP from draft
        const mcp = currentDraft.prompt_mcp || currentDraft._mcp;

        TemplateService.saveTemplate({
            name: newTemplateName,
            description: mcp.intent.primary_goal,
            mcp: mcp
        });

        setTemplates(TemplateService.getTemplates());
        setView('list');
        setNewTemplateName('');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            const updated = TemplateService.deleteTemplate(id);
            setTemplates(updated);
        }
    }

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                style={{
                    width: '90%', maxWidth: '550px',
                    background: '#0a0a0a', border: '1px solid #333',
                    borderRadius: '16px', padding: '28px',
                    color: '#eee', boxShadow: '0 25px 70px rgba(0,0,0,0.8)',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
                            <FileText size={20} color="#4ade80" /> Prompt Library
                        </h2>
                        <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.8rem' }}>Stored locally for instant workflow across sessions.</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#888', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                {view === 'list' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Search & Actions Bar */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={16} color="#444" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Search library..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 10px 10px 38px',
                                        background: '#111', border: '1px solid #222',
                                        borderRadius: '10px', color: '#fff', fontSize: '0.9rem',
                                        outline: 'none', transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#444'}
                                    onBlur={(e) => e.target.style.borderColor = '#222'}
                                />
                            </div>
                            <button
                                onClick={() => setView('save')}
                                disabled={!currentDraft}
                                style={{
                                    padding: '0 16px', background: '#fff', border: 'none',
                                    borderRadius: '10px', color: '#000', fontWeight: 600,
                                    fontSize: '0.9rem', cursor: currentDraft ? 'pointer' : 'not-allowed',
                                    opacity: currentDraft ? 1 : 0.4,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <Save size={16} /> Save New
                            </button>
                        </div>

                        {/* List Area */}
                        <div style={{
                            maxHeight: '380px', overflowY: 'auto', paddingRight: '4px',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                            scrollbarWidth: 'thin', scrollbarColor: '#333 transparent'
                        }}>
                            {filteredTemplates.length > 0 ? filteredTemplates.map(t => (
                                <motion.div
                                    layout
                                    key={t.id}
                                    style={{
                                        padding: '16px', background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '12px', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    whileHover={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                                    onClick={() => onLoadTemplate(t)}
                                >
                                    <div style={{ flex: 1, overflow: 'hidden', paddingRight: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 600, color: '#fff' }}>{t.name}</span>
                                            {t.id.startsWith('default') && (
                                                <span style={{ fontSize: '0.65rem', background: 'rgba(74,222,128,0.1)', color: '#4ade80', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Native</span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
                                            {t.description}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            style={{
                                                padding: '10px', background: 'transparent', border: 'none',
                                                color: '#444', transition: 'color 0.2s', cursor: 'pointer'
                                            }}
                                            onMouseOver={(e) => e.target.style.color = '#ef4444'}
                                            onMouseOut={(e) => e.target.style.color = '#444'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#444' }}>
                                    <Search size={32} style={{ marginBottom: '12px', opacity: 0.2 }} />
                                    <p>No templates matches your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template Identity</label>
                            <input
                                autoFocus
                                type="text"
                                value={newTemplateName}
                                onChange={e => setNewTemplateName(e.target.value)}
                                placeholder="e.g. Creative Brand Storytelling"
                                style={{
                                    width: '100%', padding: '14px', background: '#000', border: '1px solid #222',
                                    borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '0.8rem' }}>
                                <Sparkles size={14} color="#4ade80" />
                                <span>Capturing current model configuration...</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setView('list')}
                                style={{
                                    padding: '12px 20px', background: 'transparent', border: '1px solid #222', borderRadius: '10px',
                                    color: '#888', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem'
                                }}
                                onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.color = '#fff'; }}
                                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#888'; }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!newTemplateName.trim()}
                                style={{
                                    padding: '12px 24px', background: '#4ade80', border: 'none', borderRadius: '10px',
                                    color: '#000', fontWeight: 700, cursor: newTemplateName.trim() ? 'pointer' : 'not-allowed',
                                    opacity: newTemplateName.trim() ? 1 : 0.5, fontSize: '0.9rem'
                                }}
                            >
                                Confirm & Save
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TemplateManager;
