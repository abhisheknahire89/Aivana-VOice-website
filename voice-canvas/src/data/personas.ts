export interface Persona {
    id: string;
    name: string;
    role: string;
    color: string;
    deepColor: string;
    glowColor: string;
    position: { x: string; y: string };
    mobilePosition: { x: string; y: string };
    whisperAudio: string;
    fullIntroAudio: string;
    fullIntroText: string;
    prompts: string[];
    description: string; // New field for guidance layer
}

export const PERSONAS: Persona[] = [
    {
        id: 'priya',
        name: 'Priya',
        role: 'Customer Support',
        description: 'Handles complaints, returns & order tracking in 10 Indian languages with empathy.',
        color: '#9333EA',
        deepColor: '#1a0a2e',
        glowColor: 'rgba(147, 51, 234, 0.4)',
        position: { x: '35%', y: '25%' },
        mobilePosition: { x: '50%', y: '20%' },
        whisperAudio: '/audio/priya-whisper.mp3',
        fullIntroAudio: '/audio/priya-intro.mp3',
        fullIntroText: 'Hi, I\'m Priya — your customer support specialist. I can help you track orders, process refunds, and resolve any issues you\'re facing.',
        prompts: ['Track my order', 'I want a refund', 'Speak in Tamil'],
    },
    {
        id: 'rohan',
        name: 'Rohan',
        role: 'Sales',
        description: 'Qualifies leads, pitches products & books demos. Works 24/7, never misses a follow-up.',
        color: '#F59E0B',
        deepColor: '#2a1a00',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        position: { x: '65%', y: '25%' },
        mobilePosition: { x: '50%', y: '80%' },
        whisperAudio: '/audio/rohan-whisper.mp3',
        fullIntroAudio: '/audio/rohan-intro.mp3',
        fullIntroText: 'Hey there, I\'m Rohan — your sales consultant. Let me walk you through our pricing, book a demo, or help you understand the ROI.',
        prompts: ['Tell me pricing', 'Book a demo', 'What\'s the ROI?'],
    },
    {
        id: 'neha',
        name: 'Neha',
        role: 'Appointments',
        description: 'Schedules appointments, sends reminders & handles reschedules. Zero no-shows.',
        color: '#10B981',
        deepColor: '#0a2a1a',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        position: { x: '50%', y: '75%' },
        mobilePosition: { x: '50%', y: '50%' },
        whisperAudio: '/audio/neha-whisper.mp3',
        fullIntroAudio: '/audio/neha-intro.mp3',
        fullIntroText: 'Hello, I\'m Neha — your scheduling assistant. I can book, cancel, or reschedule appointments for you in seconds.',
        prompts: ['Book tomorrow 3 PM', 'Cancel appointment', 'Reschedule to Friday'],
    },
    {
        id: 'veda',
        name: 'Veda',
        role: 'Healthcare Triage',
        description: 'Patient triage, symptom collection & department routing. Clinically accurate.',
        color: '#EF4444',
        deepColor: '#2a0a0a',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        position: { x: '20%', y: '55%' },
        mobilePosition: { x: '20%', y: '50%' },
        whisperAudio: '/audio/veda-whisper.mp3',
        fullIntroAudio: '/audio/veda-intro.mp3',
        fullIntroText: 'Hi, I\'m Veda — your healthcare triage assistant. Describe your symptoms and I\'ll guide you to the right care.',
        prompts: ['I have a headache', 'Book OPD appointment', 'Speak in Hindi'],
    },
    {
        id: 'arjun',
        name: 'Arjun',
        role: 'General Queries',
        description: 'Answers FAQs, routes calls & handles overflow. Nothing slips through.',
        color: '#06B6D4',
        deepColor: '#0a1a2a',
        glowColor: 'rgba(6, 182, 212, 0.4)',
        position: { x: '80%', y: '55%' },
        mobilePosition: { x: '80%', y: '50%' },
        whisperAudio: '/audio/arjun-whisper.mp3',
        fullIntroAudio: '/audio/arjun-intro.mp3',
        fullIntroText: 'Hey, I\'m Arjun — your go-to for general queries. Ask me about hours, locations, or get connected to the right team.',
        prompts: ['What are your hours?', 'Connect to support', 'Where are you located?'],
    },
];

export function getPersonaById(id: string): Persona | undefined {
    return PERSONAS.find((persona) => persona.id === id);
}
