import React, { useState } from 'react';

interface BookDemoModalProps {
    onClose: () => void;
}

const BookDemoModal: React.FC<BookDemoModalProps> = ({ onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', contactPhone: '',
        company: '', website: '', companyPhone: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 6,
        border: '1px solid transparent',
        background: '#232135',
        fontSize: '0.9rem',
        color: '#fff',
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.2s ease',
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(10px, 3vw, 16px)',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="animate-modal-in"
                style={{
                    background: '#6b5898', // Muted purple border effect
                    borderRadius: 32,
                    padding: '16px 16px 20px 16px',
                    maxWidth: 580,
                    width: '100%',
                    maxHeight: 'min(92dvh, 760px)',
                    overflowY: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {submitted ? (
                    <div style={{ background: '#110f18', borderRadius: 24, padding: 'clamp(24px, 6vw, 48px)', width: '100%', textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
                            You're on the list!
                        </h2>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>
                            Our team will reach out within 24 hours to schedule your personalized demo.
                        </p>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 32px',
                                borderRadius: 999,
                                background: '#fff',
                                color: '#000',
                                fontSize: 14,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ background: '#110f18', borderRadius: 24, padding: 'clamp(18px, 5vw, 40px)', width: '100%', textAlign: 'left' }}>
                            <h2 style={{ fontSize: 'clamp(1.3rem, 4.6vw, 1.75rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 24 }}>
                                Book a Live Demo
                            </h2>

                            <form id="demo-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Contact Info Section */}
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                                    CONTACT INFORMATION
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 12, marginBottom: 24 }}>
                                    <input
                                        required
                                        placeholder="Full Name*"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'transparent'; }}
                                    />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Work Email*"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'transparent'; }}
                                    />
                                    <input
                                        required
                                        placeholder="Phone Number*"
                                        value={form.contactPhone}
                                        onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'transparent'; }}
                                    />
                                </div>

                                {/* Company Info Section */}
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                                    COMPANY INFORMATION
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 12, paddingBottom: 8 }}>
                                    <input
                                        required
                                        placeholder="Company Name*"
                                        value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'transparent'; }}
                                    />
                                    <input
                                        required
                                        placeholder="Company Website*"
                                        value={form.website}
                                        onChange={e => setForm({ ...form, website: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'transparent'; }}
                                    />
                                    <input
                                        required
                                        placeholder="Phone Number*"
                                        value={form.companyPhone}
                                        onChange={e => setForm({ ...form, companyPhone: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#7C3AED'; }}
                                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </form>
                        </div>

                        <div style={{ marginTop: 12, zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                form="demo-form"
                                style={{
                                    padding: '12px clamp(24px, 8vw, 32px)',
                                    borderRadius: 999,
                                    background: '#efebfc',
                                    border: 'none',
                                    color: '#0f0f12',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    letterSpacing: '-0.01em',
                                    transition: 'background 0.2s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#efebfc'; }}
                            >
                                Schedule My Demo
                            </button>
                        </div>

                        <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#e0dcf8', opacity: 0.9 }}>
                            Our team will confirm your slot within 24 hours.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookDemoModal;
