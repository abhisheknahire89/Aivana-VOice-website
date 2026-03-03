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
    bestFor: string[];
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
        bestFor: ['Customer queries • 24/7 resolution', 'Refund tracking • 100% automated', 'Multilingual support • 10 languages', 'Billing support • Zero wait time'],
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
        bestFor: ['Lead qualification • 30% more conversions', 'Product explanation • Clear & concise', 'Follow-ups • 100% automated', 'Outbound campaigns • Higher conversion'],
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
        bestFor: ['Appointment booking • Zero no-shows', 'Reminders & follow-ups • 98% delivery', 'Rescheduling • Frictionless', 'Calendar sync • 20+ platforms'],
        features: [
            { title: 'Smart Reminders', body: 'Sends voice + SMS reminders 24 h and 1 h before appointments.' },
            { title: 'Conflict Detection', body: 'Automatically detects calendar conflicts and proposes alternatives.' },
            { title: 'Multi-platform Sync', body: 'Integrates with Google Calendar, Outlook and 20+ booking platforms.' },
        ],
    },
    {
        id: 'veda',
        name: 'Veda',
        role: 'IT & Technical Support',
        tagline: 'Instantly resolves L1/L2 queries.',
        description: 'Troubleshoots software issues, resets passwords, and files internal IT tickets without any human intervention.',
        color: '#DC2626',
        orbGradient: 'radial-gradient(circle at 35% 30%, #fca5a5 0%, #DC2626 40%, #7f1d1d 75%, #1c0a0a 100%)',
        glowColor: 'rgba(220,38,38,0.35)',
        prompts: ['Reset my password', 'WiFi is down', 'Submit a ticket'],
        bestFor: ['L1 Support • 95% deflection', 'Password resets • Instant execution', 'ServiceNow integration • Deep sync', 'Troubleshooting • 5 min avg resolution'],
        features: [
            { title: 'Automated Playbooks', body: 'Executes standard operating procedures for common IT issues automatically.' },
            { title: 'Smart Ticketing', body: 'Escalates complex issues to human agents with a fully summarized ticket profile.' },
            { title: 'System Integrations', body: 'Natively talks to Jira, Slack, ServiceNow, and internal tech stacks.' },
        ],
    },
];

export function getPersonaById(id: string): Persona | undefined {
    return PERSONAS.find((p) => p.id === id);
}
