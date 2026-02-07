import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Award,
  ChevronRight,
  Mail,
  Zap,
  Car,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Binary,
  Cloud,
  Globe,
  Server,
  Terminal,
  Layers,
  Code,
  Box,
  Camera,
  Database,
  Brain,
  Sparkles,
  Bot,
  Wand2,
  Workflow,
  History,
  Trophy,
  Briefcase,
  UserCheck,
  EyeOff,
  Hammer,
  FileCode,
  CircuitBoard,
  Scan,
  Network,
  Shield,
  FastForward,
  Blocks,
  Dna
} from 'lucide-react';

import heroData from '@content/hero.json';
import capabilitiesData from '@content/capabilities.json';
import caseStudiesData from '@content/case-studies.json';
import timelineData from '@content/timeline.json';
const capabilityIcons = { Brain, Cloud, Wand2 };

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-cyan-500/30">
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 text-white rounded-lg flex items-center justify-center group-hover:rotate-180 transition-transform duration-700 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Dna size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none uppercase italic">Synapti<span className="text-cyan-400">core</span>.studio</span>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase italic">{heroData.subtitle}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[10px] font-black tracking-[0.2em] uppercase">
            <a href="#lab" className="hover:text-cyan-400 transition-colors">The Lab</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Cases</a>
            <a href="#heritage" className="hover:text-cyan-400 transition-colors">Timeline</a>
            <a href="#contact" className="px-6 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-widest text-xs">Collaborate</a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <a href="#lab" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">The Lab</a>
              <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">Cases</a>
              <a href="#heritage" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">Timeline</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-widest text-xs text-center mt-2">Collaborate</a>
            </div>
          </div>
        )}
      </nav>

      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 0.5px, transparent 0.5px)', backgroundSize: '50px 50px' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px] bg-blue-600/5 rounded-full blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              <CircuitBoard size={14} className="text-cyan-400 animate-pulse" /> {heroData.features[0]}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] font-black leading-[0.8] mb-10 tracking-tighter italic uppercase">
              {heroData.title.split('\n')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-800">{heroData.title.split('\n')[1]}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl text-slate-400 max-w-4xl leading-tight mb-8 md:mb-14 font-light italic" dangerouslySetInnerHTML={{ __html: heroData.description }} />
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="px-8 py-4 sm:px-12 sm:py-6 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all flex items-center gap-3 text-base sm:text-lg group shadow-2xl">
                {heroData.cta_text} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="heritage" className="py-12 md:py-24 border-y border-white/5 bg-[#030303]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            {timelineData.map((event, i) => (
              <div key={i} className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block italic">{event.category}</span>
                <div className={`text-3xl font-black italic ${i === timelineData.length - 1 ? 'text-orange-500' : 'text-white'}`}>{event.year}</div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 || i === 2 ? 'text-cyan-400' : i === timelineData.length - 1 ? 'text-white' : 'text-slate-400'}`}>{event.title}</p>
                {event.description && <p className="text-xs text-slate-500 font-light normal-case tracking-normal">{event.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lab" className="py-16 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12 md:mb-24">
            <h2 className="text-sm font-mono text-cyan-400 mb-6 tracking-[0.5em] uppercase italic">The Studio Philosophy</h2>
            <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-8">Thinking in Logic. <br /><span className="text-cyan-400">Building in Code.</span></h3>
            <p className="text-slate-400 text-xl font-light italic">
              20+ Jahre DCC-Erfahrung, verdichtet in einem Studio. Von prozeduraler Asset-Erzeugung über Virtual Production bis Agentic DCC Pipelines – wir produzieren, was andere planen.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {capabilitiesData.map((cap, i) => {
              const IconComponent = capabilityIcons[cap.icon];
              return (
                <div key={i} className="p-6 sm:p-10 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl sm:rounded-[3rem] hover:border-cyan-500/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-8 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                    {IconComponent && <IconComponent className="text-cyan-400" />}
                  </div>
                  <h4 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{cap.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-sm">{cap.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 md:mt-16 text-center">
            <a
              href="https://github.com/orgs/synapticore-studio/repositories?type=source"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 transition-all italic"
            >
              Open Source Repositories <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-32 bg-[#050505] relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase italic">The Archives</h2>
              <h3 className="text-4xl md:text-[6rem] font-black uppercase tracking-tighter italic leading-none">Global <br />Showcases.</h3>
            </div>
            <div className="max-w-xs text-slate-500 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Validierte Systeme für Weltmarken // Unabhängige technische Führung // Direct Supplier Trust.
            </div>
          </div>

          <div className="space-y-16 md:space-y-48">
            {caseStudiesData.map((caseStudy, idx) => (
              <div key={caseStudy.case_id} className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:col-span-7">
                  <div className="group relative overflow-hidden rounded-2xl md:rounded-[4rem] border border-white/10 bg-slate-900 shadow-2xl aspect-video">
                    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
                      <div className="text-center opacity-10 group-hover:opacity-20 transition-opacity">
                        <Box size={160} className="mx-auto mb-4" />
                        <p className="text-[10px] font-mono tracking-[0.5em] uppercase">Visual_Data_Locked</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent"></div>

                    <div className="absolute top-4 right-4 sm:top-10 sm:right-10 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 px-5 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-xl">
                        {caseStudy.case_id === 'ai-rust' ? <Bot size={12} /> : caseStudy.case_id === 'vw-streaming' ? <UserCheck size={12} /> : <Award size={12} />}
                        {caseStudy.case_id === 'ai-rust' ? 'Studio R&D' : caseStudy.case_id === 'vw-streaming' ? 'Enterprise Track Record' : 'NVIDIA Featured'}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-12 sm:left-12 sm:right-12 flex flex-wrap gap-4 sm:gap-12">
                      {caseStudy.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col border-l border-white/20 pl-4">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Studio_Metric</span>
                          <span className="text-xl font-black italic uppercase tracking-tighter">{stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <h4 className="text-sm font-mono text-cyan-400 mb-4 tracking-widest uppercase italic">{caseStudy.brand}</h4>
                  <h5 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight italic leading-none">{caseStudy.title}</h5>
                  <p className="text-slate-400 text-xl leading-relaxed mb-10 font-light border-l-4 border-cyan-500/20 pl-8 italic">
                    &quot;{caseStudy.description}&quot;
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10">
                    {caseStudy.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>

                  <button className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-cyan-400 transition-all">
                    View System Blueprint <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 border-y border-white/5 bg-[#010101] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-7xl font-black mb-10 uppercase italic tracking-tighter leading-none text-white">Production <br /><span className="text-orange-500">Pipeline.</span></h2>
              <p className="text-slate-400 text-xl mb-12 font-light italic">
                20+ Jahre DCC-Erfahrung in einer Pipeline. Von Blender und Unreal Engine über Motion Capture bis Pixel Streaming – alles, was Enterprise Content Production braucht.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest text-cyan-400 italic">// DCC Stack</div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Blender · Unreal Engine · Houdini</p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest text-cyan-400 italic">// Production</div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Virtual Photography · Pixel Streaming</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 overflow-hidden shadow-2xl relative">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest italic">Production_Pipeline</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Asset Creation', tools: 'Blender · Houdini · Substance', color: 'text-cyan-400' },
                    { label: 'Real-Time Engine', tools: 'Unreal Engine 5 · Virtual Production', color: 'text-blue-400' },
                    { label: 'Delivery', tools: 'Pixel Streaming · Cloud Deploy', color: 'text-purple-400' },
                    { label: 'Automation', tools: 'Agentic DCC · AI Workflows', color: 'text-orange-400' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black ${step.color}`}>{String(i + 1).padStart(2, '0')}</div>
                      <div>
                        <div className={`text-xs font-black uppercase tracking-widest ${step.color}`}>{step.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider">{step.tools}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-40 relative">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl md:text-[10rem] font-black uppercase tracking-tighter italic mb-8 md:mb-14 leading-[0.85]">
              Forge <br /><span className="text-cyan-400 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-black">The Future.</span>
            </h2>
            <p className="text-slate-400 text-2xl md:text-3xl mb-16 font-light italic">
              Bereit für die Architektur der nächsten Generation? Kontaktieren Sie das Lead-Studio hinter 20 Jahren DCC-, Cloud- & AI-Exzellenz.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <a href="mailto:core@synapticore.studio" className="group px-8 py-4 sm:px-16 sm:py-8 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all text-lg sm:text-2xl shadow-2xl active:scale-95 flex items-center gap-4">
                CONSULT STUDIO <Mail size={24} className="group-hover:rotate-12 transition-transform" />
              </a>
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Systems Online
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 md:py-20 border-t border-white/5 bg-black relative">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-700 italic font-bold">Synapticore Studio // Björn Bethge – 20+ Jahre DCC</span>
            <div className="flex flex-wrap gap-4 sm:gap-8 opacity-20 grayscale items-center text-sm font-black italic tracking-tighter text-slate-400">
              <span>BLENDER 2.4 ORIGIN</span>
              <span>VW GROUP PARTNER ID</span>
              <span>ADIDAS / NVIDIA</span>
              <span>VIRTUAL PRODUCTION</span>
              <span>AGENTIC DCC</span>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            <a href="/impressum.html" className="hover:text-cyan-400">Imprint</a>
            <a href="/impressum.html#datenschutz" className="hover:text-cyan-400">Privacy</a>
            <a href="https://www.linkedin.com/in/bj%C3%B6rn-bethge-a0754a329" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
