import React, { useState } from 'react';

interface FAQsModalProps {
    onClose: () => void;
}

const FAQS = [
    {
        q: 'How is Aivana different from a regular IVR?',
        a: 'Traditional IVR forces users through a rigid menu tree. Aivana understands natural conversational speech, handles complex queries, and feels like talking to a real person — with no numeric keys.',
    },
    {
        q: 'Which languages does Aivana support?',
        a: 'Aivana supports 10 Indian languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, and English — with mid-conversation language switching.',
    },
    {
        q: 'How quickly can I go live?',
        a: 'Typically 1–3 business days. We configure your persona, integrate with your existing systems, and do a test run before going live. No engineering effort needed on your end.',
    },
    {
        q: 'Can Aivana integrate with my CRM or EHR?',
        a: 'Yes. We offer native integrations with Salesforce, HubSpot, Zoho, and major EHR platforms. Custom integrations via REST API are available for any system.',
    },
    {
        q: 'Is my customer data secure?',
        a: 'All calls are encrypted in transit and at rest. We are SOC 2 Type II compliant and DPDP-ready for Indian data residency requirements.',
    },
];

const FAQsModal: React.FC<FAQsModalProps> = ({ onClose }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                    maxWidth: 520,
                    width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                }}
            >
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em', marginBottom: 20 }}>
                    Frequently asked questions
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            style={{
                                borderRadius: 14,
                                background: 'rgba(0,0,0,0.025)',
                                overflow: 'hidden',
                                border: `1px solid ${openIndex === i ? 'rgba(0,0,0,0.08)' : 'transparent'}`,
                                transition: 'border 0.2s ease',
                            }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    gap: 12,
                                }}
                            >
                                <span style={{ fontSize: 14, fontWeight: 500, color: '#0f0f0f', lineHeight: 1.4 }}>
                                    {faq.q}
                                </span>
                                <span
                                    style={{
                                        fontSize: 20,
                                        color: '#bbb',
                                        flexShrink: 0,
                                        transition: 'transform 0.25s ease',
                                        transform: openIndex === i ? 'rotate(45deg)' : 'none',
                                    }}
                                >
                                    +
                                </span>
                            </button>
                            {openIndex === i && (
                                <p style={{ padding: '0 20px 16px', fontSize: 13, color: '#666', lineHeight: 1.65 }}>
                                    {faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
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
            </div>
        </div>
    );
};

export default FAQsModal;
