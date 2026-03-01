import React from 'react';
import { ArrowRight, Code, Layout, User } from 'lucide-react';

const JobCard: React.FC<{ title: string; type: string; level: string; icon: React.ReactNode; points: string[] }> = ({ title, type, level, icon, points }) => (
    <div className="glass-card p-10 group hover:border-white/30 transition-all duration-500 hover:translate-y-[-8px]">
        <div className="flex justify-between items-start mb-10">
            <div className="p-4 bg-white/5 rounded-2xl text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all duration-500">
                {icon}
            </div>
            <span className="text-[10px] border border-white/10 px-4 py-1.5 rounded-full text-white/30 uppercase tracking-[0.2em] font-medium">
                {type} // {level}
            </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-6 leading-tight tracking-tighter">{title}</h3>
        <ul className="space-y-4 mb-10">
            {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                    <div className="w-1 h-1 rounded-full bg-white/20 mt-2 shrink-0" />
                    {point}
                </li>
            ))}
        </ul>
        <button className="w-full py-4 rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-[0.3em] text-white/40 group-hover:bg-white group-hover:text-black transition-all duration-500">
            Explore Role
        </button>
    </div>
);

const Recruitment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen w-full bg-[#050505] text-white pt-40 pb-32 px-8 overflow-y-auto premium-gradient">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-12 mb-32">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.4em]"
                    >
                        <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={14} />
                        Exit to Interface
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-6xl md:text-[100px] font-bold tracking-tighter leading-[0.85] mb-10 text-premium-gradient">
                                WE ARE <br />
                                SEEKING MINDS.
                            </h1>
                            <p className="text-xl md:text-2xl text-white/30 font-light max-w-2xl leading-relaxed tracking-tight">
                                Join the architects of the next dimension. We don't just build voice bots;
                                we engineer digital presence.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex lg:justify-end">
                            <div className="glass-card px-10 py-8 flex flex-col gap-2 border-white/5">
                                <span className="text-4xl font-bold tracking-tighter">100%</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
                                    Autonomous & Remote
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-40">
                    <JobCard
                        title="Principal Backend architect"
                        type="Engineering"
                        level="Staff+"
                        icon={<Code size={24} />}
                        points={[
                            "Scale real-time neural voice pipelines",
                            "Architect ultra-low latency inference engines",
                            "Lead distributed memory system development"
                        ]}
                    />
                    <JobCard
                        title="Lead Design Technologist"
                        type="Design"
                        level="Senior"
                        icon={<Layout size={24} />}
                        points={[
                            "Define the visual soul of Aivana's interface",
                            "Engineer complex 3D web-GL interactions",
                            "Bridge high-fidelity design and performant code"
                        ]}
                    />
                    <JobCard
                        title="Founder's Office Lead"
                        type="Operations"
                        level="Core"
                        icon={<User size={24} />}
                        points={[
                            "Direct-to-CEO strategy and market execution",
                            "Scale global developer ecosystems",
                            "Drive hyper-growth brand initiatives"
                        ]}
                    />
                </div>

                {/* Culture Section - High Contrast Minimalist Grid */}
                <div className="mb-40">
                    <h2 className="text-xs uppercase tracking-[0.5em] text-white/20 font-bold mb-16 text-center">Core Principles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-3xl">
                        {[
                            { t: "Technical Purity", d: "Elegance in code is not a preference, it's our requirement." },
                            { t: "Zero Latency", d: "We hunt for milliseconds. Speed is the primary user experience." },
                            { t: "Radical Autonomy", d: "We hire founders, not employees. Total ownership from day zero." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#050505] p-16 hover:bg-white/[0.02] transition-colors group">
                                <span className="text-white/10 group-hover:text-white/20 transition-colors text-5xl font-bold mb-8 block">0{i + 1}</span>
                                <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{item.t}</h4>
                                <p className="text-white/30 text-sm leading-relaxed">{item.d}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="py-32 border-t border-white/5 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter text-premium-gradient">UNFILTERED ENERGY?</h2>
                        <p className="text-white/30 mb-12 text-lg">
                            If you're obsessed with the future of voice, we want to hear from you.
                            Skip the form. Speak your mind.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => window.location.href = 'mailto:hr@aivana.com'}
                                className="px-10 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-transform"
                            >
                                Send Manifest
                            </button>
                            <button
                                onClick={() => alert('WeChat: Aivana-HR')}
                                className="px-10 py-5 border border-white/10 text-white text-xs font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/5 transition-all"
                            >
                                Contact Lab
                            </button>
                        </div>
                    </div>
                </div>

                {/* Micro Footer */}
                <div className="text-center text-white/10 text-[9px] uppercase tracking-[0.5em] font-medium">
                    AIVANA LABS // DIMENSION 2026
                </div>
            </div>
        </div>
    );
};

export default Recruitment;
