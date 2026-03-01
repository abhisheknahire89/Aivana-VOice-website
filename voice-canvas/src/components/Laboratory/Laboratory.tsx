import React from 'react';
import { Beaker, FlaskConical, Microscope, ArrowRight, Sparkles } from 'lucide-react';

const LabProject: React.FC<{ title: string; status: string; progress: number; icon: React.ReactNode }> = ({ title, status, progress, icon }) => (
    <div className="glass-card p-10 group hover:border-white/20 transition-all duration-700">
        <div className="flex justify-between items-start mb-12">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                {icon}
            </div>
            <div className="text-right">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-2">Project Status</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">{status}</span>
            </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 tracking-tighter">{title}</h3>

        {/* Progress Bar */}
        <div className="mt-8 mb-10">
            <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3 font-bold">
                <span>Core Stability</span>
                <span>{progress}%</span>
            </div>
            <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        <button className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 group-hover:text-white transition-colors flex items-center gap-4">
            Request Access <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
        </button>
    </div>
);

const Laboratory: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <section className="min-h-screen py-40 px-8 bg-[#050505] relative overflow-hidden">
            {/* Lab Grid Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={onBack}
                                className="group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.4em]"
                            >
                                <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={14} />
                                Exit
                            </button>
                            <div className="h-px w-12 bg-white/10" />
                            <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">Research Division</span>
                        </div>
                        <h1 className="text-6xl md:text-[100px] font-bold tracking-tighter leading-[0.8] text-premium-gradient">
                            AIVANA <br />
                            LABORATORY.
                        </h1>
                    </div>

                    <div className="glass-card p-8 border-cyan-500/20 bg-cyan-500/5">
                        <div className="flex items-center gap-4 text-cyan-400 mb-2">
                            <Sparkles size={16} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Active Experiment</span>
                        </div>
                        <p className="text-white/60 text-sm font-medium tracking-tight">Neural Resonance v4.02 // Beta</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-40">
                    <LabProject
                        title="Neural Emotion Engine"
                        status="In Beta"
                        progress={88}
                        icon={<Beaker size={28} />}
                    />
                    <LabProject
                        title="Predictive Intent Mapping"
                        status="Alpha"
                        progress={62}
                        icon={<FlaskConical size={28} />}
                    />
                    <LabProject
                        title="Global Dialect Synthesis"
                        status="Research"
                        progress={45}
                        icon={<Microscope size={28} />}
                    />
                </div>

                <div className="text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.8em] font-bold">
                        Observation End // Dimension Zero // 2026
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Laboratory;
