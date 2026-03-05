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
        role: 'Customer Support Specialist',
        tagline: 'Empathetic, calm, and solution-focused.',
        description: 'Handles complaints, order tracking, refunds, and general support across many Indian languages, 24/7.',
        color: '#7C3AED',
        orbGradient: 'radial-gradient(circle at 35% 30%, #c4b5fd 0%, #7C3AED 40%, #4c1d95 75%, #1e1b4b 100%)',
        glowColor: 'rgba(124,58,237,0.35)',
        prompts: ['Track my order', 'I need a refund', 'I want help in Hindi'],
        bestFor: [
            'Complaints and escalations with empathy',
            'Order tracking and refund handling',
            'Multilingual support across Indian languages',
            'Clear next steps with concise responses',
        ],
        features: [
            { title: 'Empathy First', body: 'Acknowledges user frustration first, then quickly moves into practical resolution steps.' },
            { title: 'End-to-End Support', body: 'Handles order status, refund workflows, and general support without back-and-forth.' },
            { title: 'Human-like Conversations', body: 'Sounds natural and calm while keeping every answer concise and actionable.' },
        ],
    },
    {
        id: 'rohan',
        name: 'Rohan',
        role: 'Sales/SDR Agent',
        tagline: 'Confident, proactive, and value-driven.',
        description: 'Qualifies inbound leads, explains pricing and ROI, delivers short pitches, and books demos or follow-ups.',
        color: '#D97706',
        orbGradient: 'radial-gradient(circle at 35% 30%, #fde68a 0%, #D97706 40%, #92400e 75%, #1c1917 100%)',
        glowColor: 'rgba(217,119,6,0.35)',
        prompts: ['Tell me your pricing', 'Is there a good ROI?', 'Book me a demo'],
        bestFor: [
            'Inbound lead qualification',
            'Pricing and ROI conversations',
            'Concise product pitches tailored to user intent',
            'Demo booking and follow-up discipline',
        ],
        features: [
            { title: 'Lead Qualification', body: 'Asks focused discovery questions to identify fit, urgency, and next best step.' },
            { title: 'Adaptive Pitching', body: 'Adjusts tone and value messaging based on what the user asks in real time.' },
            { title: 'Follow-up Reliability', body: 'Captures intent, secures next actions, and never lets warm leads go stale.' },
        ],
    },
    {
        id: 'neha',
        name: 'Neha',
        role: 'Scheduling/Coordination Assistant',
        tagline: 'Friendly, organized, and frictionless.',
        description: 'Books, reschedules, and confirms appointments, sends reminders, and keeps calendars in sync.',
        color: '#059669',
        orbGradient: 'radial-gradient(circle at 35% 30%, #6ee7b7 0%, #059669 40%, #064e3b 75%, #022c22 100%)',
        glowColor: 'rgba(5,150,105,0.35)',
        prompts: ['Book an appointment for tomorrow', 'Reschedule my meeting', 'Send me a reminder'],
        bestFor: [
            'Booking and rescheduling appointments',
            'Simple confirmation of name, date, and time',
            'Automated reminders and confirmations',
            'Calendar coordination with minimal back-and-forth',
        ],
        features: [
            { title: 'Fast Scheduling', body: 'Books and updates appointments quickly with minimal user effort.' },
            { title: 'Clear Confirmations', body: 'Confirms key details in plain language so users avoid confusion.' },
            { title: 'Calendar Sync', body: 'Keeps scheduling data aligned across systems for reliable coordination.' },
        ],
    },
    {
        id: 'veda',
        name: 'Veda',
        role: 'L1/L2 IT Helpdesk Agent',
        tagline: 'Direct, technical, and reassuring.',
        description: 'Troubleshoots software issues, performs tasks like password resets, updates IT tickets, and routes complex issues to humans.',
        color: '#DC2626',
        orbGradient: 'radial-gradient(circle at 35% 30%, #fca5a5 0%, #DC2626 40%, #7f1d1d 75%, #1c0a0a 100%)',
        glowColor: 'rgba(220,38,38,0.35)',
        prompts: ['Reset my password', 'My app is crashing', 'Raise an IT ticket'],
        bestFor: [
            'L1 and L2 troubleshooting flows',
            'Password resets and common IT tasks',
            'Ticket creation, updates, and escalation routing',
            'Clear summaries of actions taken and next steps',
        ],
        features: [
            { title: 'Structured Troubleshooting', body: 'Narrows down root causes quickly through clear, step-by-step checks.' },
            { title: 'Actionable IT Support', body: 'Performs common support tasks and keeps users informed through each step.' },
            { title: 'Escalation Ready', body: 'Routes complex issues to human teams with concise technical summaries.' },
        ],
    },
];

export function getPersonaById(id: string): Persona | undefined {
    return PERSONAS.find((p) => p.id === id);
}
