import React, { useState } from 'react';

interface BookDemoModalProps {
    onClose: () => void;
}

const BookDemoModal: React.FC<BookDemoModalProps> = ({ onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1.5px solid rgba(0,0,0,0.1)',
        background: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        color: '#0f0f0f',
        outline: 'none',
        fontFamily: 'Inter, sans-serif',
        transition: 'border-color 0.2s ease',
    };

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="animate-modal-in"
                style={{
                    background: 'rgba(255,255,255,0.82)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: 24,
                    backdropFilter: 'blur(32px)',
                    padding: '36px 36px 28px',
                    maxWidth: 440,
                    width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)',
                }}
            >
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em', marginBottom: 8 }}>
                            You're on the list!
                        </h2>
                        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
                            Our team will reach out within 24 hours to schedule your personalized demo.
                        </p>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 28px',
                                borderRadius: 999,
                                background: '#0f0f0f',
                                border: 'none',
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em', marginBottom: 6 }}>
                            Book a demo
                        </h2>
                        <p style={{ fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
                            See Aivana live — customized for your industry and use case.
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input
                                required
                                placeholder="Your name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                style={inputStyle}
                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                            />
                            <input
                                required
                                placeholder="Company name"
                                value={form.company}
                                onChange={e => setForm({ ...form, company: e.target.value })}
                                style={inputStyle}
                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                            />
                            <input
                                required
                                type="email"
                                placeholder="Work email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                style={inputStyle}
                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                            />
                            <input
                                placeholder="Phone (optional)"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                style={inputStyle}
                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                            />

                            <button
                                type="submit"
                                style={{
                                    marginTop: 4,
                                    padding: '14px',
                                    borderRadius: 12,
                                    background: '#0f0f0f',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    letterSpacing: '-0.01em',
                                    transition: 'background 0.2s ease',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#333'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0f0f0f'; }}
                            >
                                Request demo →
                            </button>
                        </form>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '8px 28px',
                                    borderRadius: 999,
                                    background: 'transparent',
                                    border: '1.5px solid rgba(220,38,38,0.35)',
                                    color: '#DC2626',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.06)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookDemoModal;
