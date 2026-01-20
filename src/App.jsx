import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, Sliders, Monitor, Smartphone,
  Terminal, Globe, Zap, History, Menu, X, Trash2,
  ChevronLeft, LayoutGrid, LogOut, User as UserIcon,
  ToggleRight, ToggleLeft, ArrowRight, RotateCcw, Copy, Download, GitFork, Plus, FileText, Layers, HelpCircle
} from 'lucide-react'
import StarField from './components/StarField'
import { MockAIService } from './services/MockAIService'
import { OllamaService } from './services/OllamaService'
import { AuthService } from './services/AuthService'
import { AuthModal } from './components/AuthModal'
import TemplateManager from './components/TemplateManager'
import BuildLogs from './components/BuildLogs'
import UserGuide from './components/UserGuide'
import DiffView from './components/DiffView'
import './App.css'

// ... (StreamingText and StructuredOutput components remain same)

// Hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Call right away so state gets updated with initial window size
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

// Modified to handle structured object rendering if needed,
// but we will stream the formatted string for the visual effect
const StreamingText = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return <>{displayedText}</>
}

// Component to render the structured Idea Map
const StructuredOutput = ({ draft, previousDraft, showDiff }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: 'Inter, sans-serif',
      color: '#e2e2e2',
    }}>

      {/* COMPACT BLUEPRINT SUMMARY */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px 32px',
        paddingBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Core Idea (Full Width) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.1em', marginBottom: '6px' }}>01. CONCEPT</div>
          <div style={{ fontSize: '1rem', fontWeight: 500, color: '#fff' }}><StreamingText text={draft.core_idea} /></div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', marginBottom: '4px' }}>02. GOAL</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc' }}><StreamingText text={draft.intent_goals} /></div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', marginBottom: '4px' }}>03. AUDIENCE</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc' }}><StreamingText text={draft.target_audience} /></div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', marginBottom: '4px' }}>04. TONE</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc' }}><StreamingText text={draft.tone_personality} /></div>
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', marginBottom: '4px' }}>05. VISUALS</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc' }}><StreamingText text={draft.visual_theme} /></div>
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', marginBottom: '4px' }}>07. FEATURES</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
            {draft.functional_components.map((f, i) => (
              <span key={i} style={{ display: 'inline-block', marginRight: '12px', opacity: 0.8 }}>• {f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* MASTER PROMPT (HERO) */}
      <section>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', letterSpacing: '0.1em', fontWeight: 'bold' }}>
            08. MASTER PROMPT (READY TO DEPLOY)
          </div>
          <span style={{ fontSize: '0.6rem', color: '#444' }}>
            {showDiff ? "DIFF MODE ACTIVE" : ""}
          </span>
        </div>

        <div style={{
          background: '#050505',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #333',
          fontSize: '0.9rem',
          color: '#e2e2e2',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap', // Preserve markdown lines
          lineHeight: '1.5',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {showDiff && previousDraft ? (
            <DiffView oldText={previousDraft.expansion_prompt} newText={draft.expansion_prompt} />
          ) : (
            <StreamingText text={draft.expansion_prompt} speed={2} />
          )}
        </div>
      </section>
    </div>
  )
}

// Sidebar Component for History
const Sidebar = ({ sessions, currentSessionId, onSwitchSession, onNewSession, onDeleteSession, isOpen, onClose, isMobile, currentUser, onLogin, onLogout }) => {
  const [hoveredSession, setHoveredSession] = useState(null)

  return (
    <>
      {/* Mobile Backdrop Overlay - Click to close */}
      {isOpen && isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 90 // Below sidebar (100) but above everything else
          }}
        />
      )}

      <div style={{
        width: '260px',
        height: '100vh',
        background: 'rgba(5, 5, 5, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: isOpen ? '5px 0 15px rgba(0,0,0,0.5)' : 'none'
      }}>
        {/* Header */}
        <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              onNewSession();
              if (isMobile) onClose();
            }}
            style={{
              flex: 1,
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = 0.9}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> New Search
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            aria-label="Close sidebar"
          >
            {isMobile ? <X size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* History List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.1em', marginBottom: '8px', paddingLeft: '4px' }}>
            HISTORY
          </div>

          {sessions.length === 0 && (
            <div style={{ fontSize: '0.8rem', color: '#444', fontStyle: 'italic', padding: '0 4px' }}>
              {currentUser ? 'No saved searches' : 'Guest history (unsaved)'}
            </div>
          )}

          {sessions
            .filter(s => s.history.length > 0 || s.id === currentSessionId)
            .map(session => (
              <div
                key={session.id}
                onMouseEnter={() => setHoveredSession(session.id)}
                onMouseLeave={() => setHoveredSession(null)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <button
                  onClick={() => {
                    onSwitchSession(session.id);
                    if (isMobile) onClose();
                  }}
                  style={{
                    flex: 1,
                    background: session.id === currentSessionId ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    paddingRight: '30px', // Space for delete button
                    textAlign: 'left',
                    color: session.id === currentSessionId ? '#fff' : '#888',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => session.id !== currentSessionId && (e.target.style.color = '#ccc')}
                  onMouseOut={(e) => session.id !== currentSessionId && (e.target.style.color = '#888')}
                >
                  {session.title || 'Untitled Search'}
                </button>

                {(hoveredSession === session.id || session.id === currentSessionId) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    title="Delete"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#ef4444'}
                    onMouseOut={(e) => e.target.style.color = '#666'}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* User / Auth Section */}
        <div style={{
          marginTop: 'auto', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{currentUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = '#666'}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Using Guest Mode (Unsaved)</div>
              <button
                onClick={onLogin}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
                onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                <UserIcon size={14} /> Sign In to Save
              </button>
            </div>
          )}
          <div style={{ fontSize: '0.7rem', color: '#333', textAlign: 'center' }}>
            v1.3.0 • {currentUser ? 'Synced' : 'Local Only'}
          </div>
        </div>
      </div>
    </>
  )
}

// Custom hook for typewriter effect on placeholders
const useTypewriter = (words, speed = 35, pause = 3000) => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)
  const [blink, setBlink] = useState(true)
  const [text, setText] = useState('')

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink(!blink)
    }, 500)
    return () => clearTimeout(timeout2)
  }, [blink])

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => {
        setReverse(true)
      }, pause)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(() => {
      setText(words[index].substring(0, subIndex))
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, Math.max(reverse ? 20 : speed, parseInt(Math.random() * 30)))

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, words, speed, pause])

  return `${text}${blink ? "|" : ""}`
}

// Example prompts for the typewriter
const examplePrompts = [
  "A minimal portfolio for a freelance photographer...",
  "A dark-themed SaaS dashboard for data analytics...",
  "An interactive educational site about space exploration...",
  "A luxury e-commerce store for handmade watches...",
  "A brutalist blog for a tech startup..."
]

// MCP Settings Panel Component
const SettingsPanel = ({ state, onChange, isMobile, currentUser }) => {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setTemplates(AuthService.getTemplates(currentUser));
    } else {
      setTemplates([]);
    }
  }, [currentUser, showSave]); // Reload when toggling save UI to refresh list

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !currentUser) return;
    AuthService.saveTemplate(currentUser, {
      name: templateName,
      settings: state
    });
    setTemplateName('');
    setShowSave(false);
    setTemplates(AuthService.getTemplates(currentUser));
  };

  const handleLoadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onChange(template.settings);
    }
  };

  const handleDeleteTemplate = (e, id) => {
    e.stopPropagation();
    AuthService.deleteTemplate(currentUser, id);
    setTemplates(AuthService.getTemplates(currentUser));
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0, marginTop: 0 }}
      animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
      exit={{ height: 0, opacity: 0, marginTop: 0 }}
      style={{ overflow: 'hidden', width: '100%' }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Main Settings Row */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: isMobile ? '24px' : '40px'
        }}>
          {/* Depth */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '260px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }}>DEPTH</label>
            <div style={{ display: 'flex', background: '#000', borderRadius: '6px', padding: '2px' }}>
              {['beginner', 'intermediate', 'expert'].map(d => (
                <button
                  key={d}
                  onClick={() => onChange({ ...state, depth: d })}
                  style={{
                    flex: 1,
                    background: state.depth === d ? '#333' : 'transparent',
                    color: state.depth === d ? '#fff' : '#666',
                    border: 'none', borderRadius: '4px', padding: '4px', fontSize: '0.75rem', cursor: 'pointer'
                  }}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '140px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }}>TONE</label>
            <select
              value={state.tone}
              onChange={(e) => onChange({ ...state, tone: e.target.value })}
              style={{
                width: '100%',
                background: '#000',
                color: '#ccc',
                border: '1px solid #333',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="neutral">Neutral</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="authoritative">Authoritative</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>

          {/* Abstraction */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '170px', paddingRight: isMobile ? 0 : '16px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }}>ABSTRACTION</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#888' }}>
              Low
              <input
                type="range" min="0" max="2" step="1"
                value={state.abstraction_level === 'low' ? 0 : state.abstraction_level === 'medium' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onChange({ ...state, abstraction_level: val === 0 ? 'low' : val === 1 ? 'medium' : 'high' })
                }}
                style={{ flex: 1, accentColor: '#fff' }}
              />
              <span style={{ paddingRight: '4px' }}>High</span>
            </div>
          </div>

          {/* Output */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '160px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }}>OUTPUT</label>
            <select
              value={state.model_family}
              onChange={(e) => onChange({ ...state, model_family: e.target.value })}
              style={{
                width: '100%',
                background: '#000',
                color: '#ccc',
                border: '1px solid #333',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="llm">LLM (Text)</option>
              <option value="diffusion">Diffusion (Image)</option>
            </select>
          </div>

          {/* Dialect */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '140px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }}>DIALECT</label>
            <select
              value={state.dialect || "gpt"}
              onChange={(e) => onChange({ ...state, dialect: e.target.value })}
              style={{
                width: '100%',
                background: '#000',
                color: '#ccc',
                border: '1px solid #333',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="gpt">GPT-4o (Markdown)</option>
              <option value="claude">Claude 3.5 (XML)</option>
            </select>
          </div>

          {/* No Hype */}
          <div style={{
            minWidth: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '4px'
          }}>
            <div
              onClick={() => onChange({ ...state, exclude_hype: !state.exclude_hype })}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              {state.exclude_hype ? <ToggleRight size={24} color="#4ade80" /> : <ToggleLeft size={24} color="#444" />}
              <label style={{ fontSize: '0.75rem', color: state.exclude_hype ? '#fff' : '#666', letterSpacing: '0.05em', cursor: 'pointer' }}>NO HYPE</label>
            </div>
          </div>

          {/* Provider Toggle */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '140px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '8px', letterSpacing: '0.05em' }}>PROVIDER</label>
            <select
              value={state.use_ollama ? "ollama" : "mock"}
              onChange={(e) => onChange({ ...state, use_ollama: e.target.value === "ollama" })}
              style={{
                width: '100%',
                background: '#000',
                color: state.use_ollama ? '#4ade80' : '#ccc',
                border: '1px solid #333',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="mock">Consense Simulated</option>
              <option value="ollama">Local (Ollama)</option>
            </select>
          </div>
        </div>

        {/* Templates Section (Only for Logged In Users) */}
        {currentUser && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.05em' }}>TEMPLATES:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {templates.map(t => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#111', border: '1px solid #333', borderRadius: '4px',
                    padding: '2px 8px'
                  }}>
                    <button
                      onClick={() => handleLoadTemplate(t.id)}
                      style={{
                        background: 'transparent', border: 'none', color: '#ccc',
                        fontSize: '0.75rem', cursor: 'pointer'
                      }}
                      title="Load Template"
                    >
                      {t.name}
                    </button>
                    <button
                      onClick={(e) => handleDeleteTemplate(e, t.id)}
                      style={{
                        background: 'transparent', border: 'none', color: '#555',
                        cursor: 'pointer', display: 'flex', alignItems: 'center'
                      }}
                      title="Delete Template"
                      onMouseOver={e => e.target.style.color = '#ef4444'}
                      onMouseOut={e => e.target.style.color = '#555'}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                {templates.length === 0 && <span style={{ fontSize: '0.75rem', color: '#444' }}>No saved templates</span>}
              </div>
            </div>

            {showSave ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  style={{
                    background: '#000', border: '1px solid #333', borderRadius: '4px',
                    color: '#fff', fontSize: '0.75rem', padding: '4px 8px', outline: 'none'
                  }}
                />
                <button
                  onClick={handleSaveTemplate}
                  disabled={!templateName.trim()}
                  style={{
                    background: '#fff', color: '#000', border: 'none', borderRadius: '4px',
                    padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    opacity: templateName.trim() ? 1 : 0.5
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSave(false)}
                  style={{
                    background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '4px',
                    padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSave(true)}
                style={{
                  background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '4px',
                  padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
                onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                <span>+ Save Current Settings</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}


function App() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Responsiveness
  const size = useWindowSize()
  const isMobile = size.width < 768
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Auto-close on mobile, open on desktop (initial or resize)
  useEffect(() => {
    setIsSidebarOpen(!isMobile)
  }, [isMobile])

  // MCP UI State
  const [showSettings, setShowSettings] = useState(false)
  const [uiState, setUiState] = useState({
    depth: 'intermediate',
    tone: 'neutral',
    abstraction_level: 'medium',
    model_family: 'llm',
    exclude_hype: false,
    use_ollama: false
  })

  const placeholderText = useTypewriter(examplePrompts, 35, 3000)

  // Session State
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Current session derived state
  const currentSession = sessions.find(s => s.id === currentSessionId)
  const history = currentSession ? currentSession.history : []
  const currentItem = history.length > 0 ? history[history.length - 1] : null
  const [recommendations, setRecommendations] = useState([])
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false)
  const [isBuildLogsOpen, setIsBuildLogsOpen] = useState(false)
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false)

  // Auth State
  const [currentUser, setCurrentUser] = useState(null)
  // UI State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showDiff, setShowDiff] = useState(false)

  // Create a new session (Moved up for hosting)
  const handleNewSession = () => {
    // If current session is empty/new, don't create another one
    const current = sessions.find(s => s.id === currentSessionId)
    if (current && current.history.length === 0) {
      return
    }

    const newSession = {
      id: Date.now().toString(),
      title: 'New Search',
      history: [],
      timestamp: Date.now()
    }
    setSessions(prev => [...prev, newSession]) // Add to end
    setCurrentSessionId(newSession.id)
    setRecommendations([])
    setQuery('')
    setIsFocused(false)
  }

  // Load User & Data on Mount
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setCurrentUser(user)

    if (user) {
      // Load USER data
      const key = AuthService.getUserDataKey(user)
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSessions(parsed)
          if (parsed.length > 0) {
            setCurrentSessionId(parsed[parsed.length - 1].id)
          } else {
            handleNewSession()
          }
        } catch (e) {
          console.error("Failed to load user sessions", e)
          handleNewSession()
        }
      } else {
        handleNewSession() // New user, start fresh
      }
    } else {
      // Guest Mode - Start Fresh, Do NOT load legacy global data
      // This respects "guests don't get saved" behavior strictly
      setSessions([])
      handleNewSession()
    }
  }, [])

  // Save to local storage whenever sessions change (ONLY IF LOGGED IN)
  useEffect(() => {
    if (currentUser && sessions.length > 0) {
      const key = AuthService.getUserDataKey(currentUser)
      localStorage.setItem(key, JSON.stringify(sessions))
    }
    // Note: We intentionally do NOT save if currentUser is null (Guest)
  }, [sessions, currentUser])

  // Auth Handlers
  const handleLogin = (user) => {
    setCurrentUser(user)

    // On login, attempt to load their data
    const key = AuthService.getUserDataKey(user)
    const saved = localStorage.getItem(key)

    // If we have current guest sessions that aren't empty, maybe we should save them to the new user?
    // For now, let's adopt the "Fresh Switch" approach to be safe and predictable.
    // If the user is new, they start fresh.
    // If the user has data, it loads.

    let userSessions = []
    if (saved) {
      userSessions = JSON.parse(saved)
    }

    // Merge logic: If guest had meaningful data, maybe append?
    // Let's keep it simple: Just load user profile.
    if (userSessions.length > 0) {
      setSessions(userSessions)
      setCurrentSessionId(userSessions[userSessions.length - 1].id)
    } else {
      // New user or empty profile
      // If guest has data, SAVE IT to this user?
      // "Save all the data in" implies converting guest -> user.
      if (sessions.length > 0 && sessions[0].history.length > 0) {
        // User just registered/logged in, save current guest work to their profile
        // This is a nice UX touch.
        // We keep 'sessions' state as is, and the useEffect will save it to the new key!
        // So we don't need to do anything here, just let useEffect trigger.
      } else {
        setSessions([])
        handleNewSession()
      }
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    setCurrentUser(null)
    // Clear view for guest
    setSessions([])
    handleNewSession()
  }



  const handleSwitchSession = (id) => {
    setCurrentSessionId(id)
    const sess = sessions.find(s => s.id === id)
    if (sess && sess.history.length > 0) {
      setRecommendations(MockAIService.getRecommendations(sess.history[sess.history.length - 1].draft))
    } else {
      setRecommendations([])
    }
    setQuery('')
  }

  const handleDeleteSession = (id) => {
    const newSessions = sessions.filter(s => s.id !== id)
    setSessions(newSessions)

    // If we deleted the current session
    if (id === currentSessionId) {
      if (newSessions.length > 0) {
        // Switch to the last one (most recent usually)
        handleSwitchSession(newSessions[newSessions.length - 1].id)
      } else {
        // Create new if everything deleted
        const newSession = {
          id: Date.now().toString(),
          title: 'New Search',
          history: [],
          timestamp: Date.now()
        }
        setSessions([newSession])
        setCurrentSessionId(newSession.id)
        setRecommendations([])
        setQuery('')
        setIsFocused(false)
      }
    }
  }

  const handleBranchSession = () => {
    if (!currentSession || !currentItem) return;

    // Create a deep copy of the history up to the current item
    // We need to find the index of the current item in the history stack
    // BUT currently 'currentItem' is just the last item.
    // For branching to be truly useful, we'd need navigation backwards in history.
    // For now, let's implement "Fork Session" which clones the entire session state 
    // into a NEW session. This is the safest V1 implementation.

    const newSession = {
      id: crypto.randomUUID(),
      title: `${currentSession.title} (Branch)`,
      history: [...currentSession.history], // Clone history
      timestamp: Date.now()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }

  // Update the Current Session with a new history item
  const updateCurrentSession = (newHistoryItem) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const updatedHistory = [...s.history, newHistoryItem]
        // Update title if it's the first item
        let title = s.title
        if (s.history.length === 0 && newHistoryItem.type === 'initial') {
          // Use smart title generation
          title = MockAIService.generateSessionTitle(newHistoryItem.draft, newHistoryItem.input)
        }
        return { ...s, history: updatedHistory, title, timestamp: Date.now() }
      }
      return s
    }))
  }

  // Initial Generation
  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsGenerating(true)

    // Call Service
    let draft;
    try {
      if (uiState.use_ollama) {
        draft = await OllamaService.generateDraft(query, uiState);
      } else {
        draft = await MockAIService.generateInitialDraft(query, uiState);
      }
    } catch (err) {
      console.error("Generation failed:", err);
      // Fallback to Mock if Ollama fails? Or just alert. Let's fallback for robustness but warn.
      if (uiState.use_ollama) {
        alert("Ollama connection failed. Falling back to simulation. Ensure Ollama is running on port 11434.");
        draft = await MockAIService.generateInitialDraft(query, uiState);
      } else {
        return; // Should not happen for mock
      }
    }

    const newHistoryItem = {
      type: 'initial',
      input: query,
      draft: draft,
      timestamp: Date.now()
    }

    updateCurrentSession(newHistoryItem)

    setRecommendations(MockAIService.getRecommendations(draft))
    setIsGenerating(false)
    setQuery('')
  }

  // Refinement Action
  const handleRefine = async (refinementType) => {
    if (!currentItem) return

    setIsGenerating(true)

    // Call Service to refine existing draft
    let refinedDraft;
    try {
      if (uiState.use_ollama) {
        refinedDraft = await OllamaService.refineDraft(currentItem.draft, refinementType, uiState);
      } else {
        refinedDraft = await MockAIService.refineDraft(currentItem.draft, refinementType, uiState);
      }
    } catch (err) {
      console.error("Refinement failed:", err);
      if (uiState.use_ollama) {
        alert("Ollama refinement failed. Falling back to simulation.");
        refinedDraft = await MockAIService.refineDraft(currentItem.draft, refinementType, uiState);
      } else {
        return;
      }
    }

    const newHistoryItem = {
      type: 'refinement',
      input: `Refine: ${refinementType}`, // Label for the history/UI
      draft: refinedDraft,
      timestamp: Date.now()
    }

    updateCurrentSession(newHistoryItem)

    setRecommendations(MockAIService.getRecommendations(refinedDraft))
    setIsGenerating(false)
  }
  const handleLoadTemplate = async (template) => {
    setIsGenerating(true)
    setIsTemplateManagerOpen(false)
    await new Promise(r => setTimeout(r, 600)); // Simulate load

    const draft = MockAIService.hydrateFromTemplate(template.mcp);

    const newHistoryItem = {
      type: 'initial',
      input: `Loaded Template: ${template.name}`,
      draft: draft,
      timestamp: Date.now()
    }

    if (!currentSession || currentSession.history.length === 0) {
      // Create it in a new session or current if empty
      if (currentSessionId && currentSession) {
        updateCurrentSession(newHistoryItem)
      } else {
        const newSessionId = crypto.randomUUID();
        setSessions([{
          id: newSessionId,
          title: template.name,
          history: [newHistoryItem],
          timestamp: Date.now()
        }, ...sessions]);
        setCurrentSessionId(newSessionId);
      }
    } else {
      // Create new session for the template
      const newSession = {
        id: crypto.randomUUID(),
        title: template.name,
        history: [newHistoryItem],
        timestamp: Date.now()
      }
      setSessions(prev => [newSession, ...prev])
      setCurrentSessionId(newSession.id)
    }

    setRecommendations(MockAIService.getRecommendations(draft))
    setIsGenerating(false)
  }

  const handleManualRefineSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    await handleRefine(query);
    setQuery('');
  }

  const copyToClipboard = (draft) => {
    const text = MockAIService.formatForClipboard(draft)
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0a',
      display: 'flex',
      overflowX: 'hidden' // Prevent horizonatl scroll during transitions
    }}>
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSwitchSession={handleSwitchSession}
        onDeleteSession={handleDeleteSession}
        onNewSession={handleNewSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
        currentUser={currentUser}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Top Navigation - Global */}
      <nav style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        display: 'flex', gap: '12px', pointerEvents: 'auto'
      }}>
        <button
          onClick={() => setIsUserGuideOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px',
            color: '#666',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#666';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          title="Mastery Guide"
        >
          <HelpCircle size={20} />
        </button>

        <button
          onClick={() => setIsBuildLogsOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px',
            color: '#666',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#666';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          title="Build Dashboard"
        >
          <Layers size={20} />
        </button>

        <button
          onClick={() => {
            console.log("Opening Templates UI");
            setIsTemplateManagerOpen(true);
          }}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FileText size={16} color="#4ade80" /> <span style={{ textShadow: '0 0 10px rgba(74,222,128,0.5)' }}>Library</span>
        </button>
      </nav>

      {/* Mobile/Closed Sidebar Toggle Trigger */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 60,
            background: 'rgba(20, 20, 23, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Content Area - Shifted Right */}
      <div style={{
        marginLeft: isSidebarOpen && !isMobile ? '260px' : '0',
        flex: 1,
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'margin-left 0.3s ease-in-out',
        width: '100%' // Ensure full width
      }}>
        <StarField />

        <StarField />

        {/* Main Content */}
        <main style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '900px',
          flex: 1, // Allow filling space
          padding: '60px 20px', // More vertical breathing room
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>

          {/* Branding - Fades out when content exists to reduce noise */}
          <AnimatePresence>
            {(!history || history.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '24px' }}
              >
                <h1 style={{
                  fontSize: '4rem', fontWeight: '700', letterSpacing: '-0.02em',
                  background: 'linear-gradient(to bottom, #fff, #a5a5a5)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>
                  Consense
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '12px' }}>
                  Navigate global intelligence with precision.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. INPUT AREA (Context sensitive) */}
          {/* If we have output, this becomes the REFINEMENT input. If not, it's the MAIN input. */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            layout // Animate layout changes
            onSubmit={currentItem ? handleManualRefineSubmit : handleGenerate}
            style={{ width: '100%', maxWidth: '700px', position: 'relative' }}
          >
            <div style={{
              position: 'absolute',
              top: -10, left: -10, right: -10, bottom: -10,
              background: 'linear-gradient(45deg, #FF3BFF, #5C24FF, #00D4FF)',
              borderRadius: '16px',
              filter: 'blur(10px)',
              opacity: isFocused || isGenerating ? 0.3 : 0,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none',
              zIndex: -1
            }} />

            <div style={{
              position: 'relative',
              background: 'rgba(20, 20, 23, 0.9)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  color: isFocused ? '#fff' : '#666',
                  marginTop: '4px',
                  transition: 'color 0.3s'
                }}>
                  <div style={{
                    width: '20px', height: '20px',
                    borderRadius: '4px',
                    border: '2px solid currentColor',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 'bold'
                  }}>
                    {'>'}
                  </div>
                </div>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (!isGenerating) {
                        if (currentItem) handleManualRefineSubmit(e);
                        else handleGenerate(e);
                      }
                    }
                  }}
                  placeholder={currentItem ? "Refine this prompt (e.g. 'Make it shorter')..." : (isFocused ? "" : placeholderText)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '1.25rem', // Slightly larger for better readability
                    lineHeight: '1.5',
                    fontFamily: 'inherit', // Match the page vibe (Inter)
                    resize: 'none',
                    minHeight: '28px',
                    maxHeight: '200px',
                    fontWeight: 400
                  }}
                  rows={query.split('\n').length > 1 ? Math.min(query.split('\n').length, 8) : 1}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                      background: showSettings ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: showSettings ? '#fff' : '#666',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    title="Tune Parameters"
                  >
                    <Sliders size={14} />
                    <span style={{ fontSize: '0.75rem' }}>Tune</span>
                  </button>
                  <span style={{ fontSize: '0.75rem', color: '#444' }}>
                    {isGenerating ? 'Processing...' : 'CMD + Enter to send'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isGenerating}
                  style={{
                    background: query.trim() ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: query.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: query.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                >
                  {isGenerating ? <RotateCcw className="animate-spin" size={14} /> : <ArrowRight size={14} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && <SettingsPanel state={uiState} onChange={setUiState} isMobile={isMobile} currentUser={currentUser} />}
            </AnimatePresence>
          </motion.form>

          {/* OUTPUT DISPLAY */}
          <AnimatePresence mode='wait'>
            {currentItem && !isGenerating && (
              <motion.div
                key={currentItem.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {/* Unified "Nice Box" for the Interaction */}
                <div style={{
                  background: 'rgba(10, 10, 12, 0.5)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
                }}>

                  {/* User Input / Refinement Label */}
                  <div style={{ alignSelf: 'flex-start', maxWidth: '80%', textAlign: 'left' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#666',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      {currentItem.type === 'initial' ? 'Intent' : 'Refinement'}
                    </span>
                    <div style={{
                      fontSize: '1.25rem',
                      color: '#fff',
                      lineHeight: '1.4',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {currentItem.input}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    width: '100%',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                  }} />

                  {/* AI Output Section - Structured and Refined */}
                  <div style={{ alignSelf: 'stretch' }}> {/* Full width for better structure */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      {history.length > 1 && (
                        <div style={{ display: 'flex', background: '#111', borderRadius: '4px', padding: '2px', border: '1px solid #333' }}>
                          <button
                            onClick={() => setShowDiff(false)}
                            style={{
                              background: !showDiff ? '#333' : 'transparent',
                              color: !showDiff ? '#fff' : '#666',
                              border: 'none', borderRadius: '2px', padding: '2px 8px', fontSize: '0.65rem', cursor: 'pointer'
                            }}
                          >
                            RAW
                          </button>
                          <button
                            onClick={() => setShowDiff(true)}
                            style={{
                              background: showDiff ? '#333' : 'transparent',
                              color: showDiff ? '#4ade80' : '#666',
                              border: 'none', borderRadius: '2px', padding: '2px 8px', fontSize: '0.65rem', cursor: 'pointer'
                            }}
                          >
                            DIFF
                          </button>
                        </div>
                      )}

                      <span style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#666',
                      }}>
                        Optimized Prompt
                      </span>
                    </div>

                    {/* RENDER STRUCTURED OUTPUT */}
                    <div style={{
                      background: 'rgba(0,0,0,0.2)',
                      padding: '24px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <StructuredOutput
                        draft={currentItem.draft}
                        previousDraft={history.length > 1 ? history[history.length - 2]?.draft : null}
                        showDiff={showDiff}
                      />
                    </div>
                  </div>

                  {/* Footer / Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleBranchSession}
                        title="Fork this session to a new history item"
                        style={{
                          background: 'transparent', border: 'none',
                          color: '#444', fontSize: '0.8rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#fff'}
                        onMouseOut={(e) => e.target.style.color = '#444'}
                      >
                        <GitFork size={14} /> Branch
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          const blob = new Blob([currentItem.draft.expansion_prompt], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${currentItem.draft.core_idea.replace(/\s+/g, '_').toLowerCase()}_prompt.md`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        style={{
                          background: 'transparent', border: 'none',
                          color: '#555', fontSize: '0.8rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#fff'}
                        onMouseOut={(e) => e.target.style.color = '#555'}
                      >
                        <Download size={14} /> Export MD
                      </button>
                      <button
                        onClick={() => copyToClipboard(currentItem.draft)}
                        style={{
                          background: 'transparent', border: 'none',
                          color: '#555', fontSize: '0.8rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#fff'}
                        onMouseOut={(e) => e.target.style.color = '#555'}
                      >
                        <Copy size={14} /> Copy to clipboard
                      </button>
                    </div>
                  </div>

                  {/* 2. RECOMMENDATIONS ENGINE */}
                  {/* These now act as 1-click refinements that TRIGGER the loop */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', opacity: 0.9 }}>
                    <span style={{ fontSize: '0.75rem', color: '#555', width: '100%', marginBottom: '4px' }}>
                      Suggested Refinements
                    </span>
                    {recommendations.map(rec => (
                      <button
                        key={rec.id}
                        onClick={() => handleRefine(rec.action)}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#a1a1aa',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.color = '#fff'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                          e.currentTarget.style.color = '#a1a1aa'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        }}
                      >
                        <Sparkles size={12} /> {rec.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Footer handles z-index to stay below inputs if needed */}
        <footer style={{ position: 'absolute', bottom: '20px', fontSize: '0.8rem', color: '#333', zIndex: 0 }}>
          Consense &copy; 2026. High-Signal Interface.
        </footer>
      </div>
      <TemplateManager
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
        onLoadTemplate={handleLoadTemplate}
        currentDraft={currentItem?.draft}
      />
      <BuildLogs
        isOpen={isBuildLogsOpen}
        onClose={() => setIsBuildLogsOpen(false)}
      />
      <UserGuide
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />
    </div>
  )
}
export default App
