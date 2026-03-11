import React from 'react';
import { Shield, Zap, Heart, Globe, Cpu, Users, ArrowRight } from 'lucide-react';

const BenefitCard: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; delay: number }> = ({ title, subtitle, icon, delay }) => (
    <div
        className="glass-card p-8 group hover:border-white/20 transition-all duration-700 hover:translate-y-[-12px]"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4 tracking-tighter">{title}</h3>
        <p className="text-white/30 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
            {subtitle}
        </p>
    </div>
);

const Benefits: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <section className="min-h-[100dvh] py-20 md:py-40 px-4 sm:px-6 md:px-8 bg-[#050505] relative overflow-x-clip">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-16 md:mb-32">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 text-white/30 hover:text-white transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.4em] mb-12"
                    >
                        <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={14} />
                        Exit to Interface
                    </button>

                    <div className="text-center">
                        <h2 className="text-xs uppercase tracking-[0.6em] text-white/20 font-bold mb-8">Protocol Benefits</h2>
                        <h3 className="text-4xl md:text-7xl font-bold tracking-tighter text-premium-gradient max-w-4xl mx-auto leading-[0.9]">
                            ENGINEERED FOR <br />
                            ULTIMATE PERFORMANCE.
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <BenefitCard
                        title="Sub-100ms Latency"
                        subtitle="Optimized neural pathways ensure real-time interaction without the awkward pauses of legacy systems."
                        icon={<Zap size={24} />}
                        delay={100}
                    />
                    <BenefitCard
                        title="Hyper-Realistic Nuance"
                        subtitle="Our agents master regional accents and emotional intent, creating a connection that feels human, not robotic."
                        icon={<Heart size={24} />}
                        delay={200}
                    />
                    <BenefitCard
                        title="Enterprise Security"
                        subtitle="Military-grade encryption and data isolation. Your conversation protocols remain strictly confidential."
                        icon={<Shield size={24} />}
                        delay={300}
                    />
                    <BenefitCard
                        title="Global Resonance"
                        subtitle="Deploy across 50+ languages and 100+ dialects with consistent personality and brand voice."
                        icon={<Globe size={24} />}
                        delay={400}
                    />
                    <BenefitCard
                        title="Neural Learning"
                        subtitle="Agents evolve with every interaction, adapting to your specific business logic and customer patterns."
                        icon={<Cpu size={24} />}
                        delay={500}
                    />
                    <BenefitCard
                        title="Infinite Scale"
                        subtitle="From one conversation to ten thousand simultaneous nodes. Built on a serverless, liquid infrastructure."
                        icon={<Users size={24} />}
                        delay={600}
                    />
                </div>
            </div>
        </section>
    );
};

export default Benefits;
