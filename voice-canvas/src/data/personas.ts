export interface Persona {
    id: string;
    name: string;
    role: string;
    color: string;         // main orb colour
    orbGradient: string;   // CSS radial gradient for the CSS orb shell
    glowColor: string;     // rgba glow
    description: string;
    tagline: string;
    prompts: string[];
    features: { title: string; body: string }[];
}

export const PERSONAS: Persona[] = [
    {
        id: 'priya',
        name: 'Priya',
        role: 'Customer Support',
        tagline: 'Empathetic. Fast. Multilingual.',
        description: 'Resolves complaints, tracks orders & processes refunds across 10 Indian languages — 24 × 7 with zero wait time.',
        color: '#7C3AED',
        orbGradient: 'radial-gradient(circle at 35% 30%, #c4b5fd 0%, #7C3AED 40%, #4c1d95 75%, #1e1b4b 100%)',
        glowColor: 'rgba(124,58,237,0.35)',
        prompts: ['Track my order', 'I want a refund', 'Speak in Tamil'],
        features: [
            { title: 'Multilingual', body: 'Speaks 10 Indian languages fluently, switching mid-conversation if needed.' },
            { title: 'Smart Resolution', body: 'Resolves 85% of issues without human escalation using context-aware reasoning.' },
            { title: 'Empathy Engine', body: 'Detects frustration in voice tone and adapts responses to de-escalate.' },
        ],
    },
    {
        id: 'rohan',
        name: 'Rohan',
        role: 'Sales & Lead Qualification',
        tagline: 'Never misses a follow-up.',
        description: 'Qualifies leads, delivers tailored pitches & books demos. Works around the clock so your team wakes up to warm leads.',
        color: '#D97706',
        orbGradient: 'radial-gradient(circle at 35% 30%, #fde68a 0%, #D97706 40%, #92400e 75%, #1c1917 100%)',
        glowColor: 'rgba(217,119,6,0.35)',
        prompts: ['Tell me pricing', 'Book a demo', 'What\'s the ROI?'],
        features: [
            { title: 'Lead Scoring', body: 'Scores inbound leads in real-time and prioritises high-intent prospects.' },
            { title: 'Dynamic Pitch', body: 'Adapts the sales narrative based on industry, role and pain points detected.' },
            { title: 'Calendar Sync', body: 'Books demos directly into your CRM calendar — no back-and-forth emails.' },
        ],
    },
    {
        id: 'neha',
        name: 'Neha',
        role: 'Appointments & Scheduling',
        tagline: 'Zero no-shows. Zero friction.',
        description: 'Books, reschedules & sends reminders for appointments via voice — syncing instantly with your existing calendar stack.',
        color: '#059669',
        orbGradient: 'radial-gradient(circle at 35% 30%, #6ee7b7 0%, #059669 40%, #064e3b 75%, #022c22 100%)',
        glowColor: 'rgba(5,150,105,0.35)',
        prompts: ['Book tomorrow 3 PM', 'Cancel appointment', 'Reschedule to Friday'],
        features: [
            { title: 'Smart Reminders', body: 'Sends voice + SMS reminders 24 h and 1 h before appointments.' },
            { title: 'Conflict Detection', body: 'Automatically detects calendar conflicts and proposes alternatives.' },
            { title: 'Multi-platform Sync', body: 'Integrates with Google Calendar, Outlook and 20+ booking platforms.' },
        ],
    },
    {
        id: 'veda',
        name: 'Veda',
        role: 'Healthcare Triage',
        tagline: 'Clinically accurate. Always available.',
        description: 'Collects symptoms, triages patients and routes them to the right department — reducing ER load with clinical-grade accuracy.',
        color: '#DC2626',
        orbGradient: 'radial-gradient(circle at 35% 30%, #fca5a5 0%, #DC2626 40%, #7f1d1d 75%, #1c0a0a 100%)',
        glowColor: 'rgba(220,38,38,0.35)',
        prompts: ['I have a headache', 'Book OPD', 'Speak in Hindi'],
        features: [
            { title: 'Symptom Intake', body: 'Structured symptom collection following clinically validated triage protocols.' },
            { title: 'Smart Routing', body: 'Routes patients to the right specialist based on urgency and symptoms.' },
            { title: 'EHR Integration', body: 'Writes structured notes directly into your EHR system — no re-entry.' },
        ],
    },
];

export function getPersonaById(id: string): Persona | undefined {
    return PERSONAS.find((p) => p.id === id);
}
