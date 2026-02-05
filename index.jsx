import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity,
  Award,
  ChevronRight, 
  Mail, 
  Zap,
  Car,
  Settings,
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
  CpuChip,
  Scan,
  Network,
  Shield,
  FastForward,
  Blocks,
  Dna
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const studioCapabilities = [
    {
      title: "Autonomous Agent Systems",
      description: "Entwicklung von kognitiven Layern und autonomen Agenten-Frameworks in Unreal Engine 5. Wir nutzen Rust und C++, um Logik-Infrastrukturen zu schaffen, die über klassisches Scripting hinausgehen.",
      icon: <Brain className="text-cyan-400" />
    },
    {
      title: "Enterprise Cloud Streaming",
      description: "Architektur und Deployment globaler Pixel-Streaming-Lösungen. Wir orchestrieren GPU-Cluster für fotorealistische Konfiguratoren auf Enterprise-Level (VAG Group Standard).",
      icon: <Cloud className="text-cyan-400" />
    },
    {
      title: "Generative Production Tools",
      description: "Bau von proprietären Plugins und intelligenten Generatoren. Wir automatisieren komplexe DCC-Pipelines durch 20 Jahre Erfahrung in der prozeduralen Asset-Erzeugung.",
      icon: <Wand2 className="text-cyan-400" />
    }
  ];

  const caseStudies = [
    {
      id: "ai-rust",
      brand: "R&D / Cognitive Logic",
      title: "Neural Agent Frameworks 2024",
      description: "Unsere neueste Evolution: Hochperformante KI-Agenten basierend auf Rust-Backends. Memory-safe, ultra-schnell und nahtlos in UE5 integriert für autonome Simulations-Szenarien.",
      tags: ["Rust", "AI Agents", "C++ Plugin"],
      stats: ["Est. 2024", "Rust Performance", "Agentic Logic"],
      color: "from-orange-600 to-red-600"
    },
    {
      id: "vw-streaming",
      brand: "Volkswagen / Audi / Skoda",
      title: "Global Pixel Streaming Lead",
      description: "Die technologische Basis für globale Automotive-Konfiguratoren. Seit 2008 entwerfen und implementieren wir die Cloud-Infrastruktur für die VAG-Gruppe weltweit.",
      tags: ["Cloud Infra", "Pixel Streaming", "Direct Supplier"],
      stats: ["Since 2008", "Global Rollout", "Tier-1 Partner"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: "adidas-vr",
      brand: "Adidas x NVIDIA",
      title: "Virtual Photography Studio",
      description: "Ein VR-integriertes Ökosystem zur virtuellen Asset-Produktion. Validiert durch NVIDIA als globaler Benchmark für High-Fidelity Performance und RTX-Optimierung.",
      tags: ["VR Studio", "NVIDIA Global", "Automation"],
      stats: ["RTX Validated", "Asset-Gen", "DCC Mastery"],
      color: "from-emerald-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 text-white rounded-lg flex items-center justify-center group-hover:rotate-180 transition-transform duration-700 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Dna size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none uppercase italic">Synapti<span className="text-cyan-400">core</span>.studio</span>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase italic">Ghost Architecture // Hands-On Forge</span>
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
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 0.5px, transparent 0.5px)', backgroundSize: '50px 50px' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px] bg-blue-600/5 rounded-full blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              <CircuitBoard size={14} className="text-cyan-400 animate-pulse" /> Engineering the Invisible Core since 2004
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-black leading-[0.8] mb-10 tracking-tighter italic uppercase">
              Invisible <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-800">Architects.</span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-400 max-w-4xl leading-tight mb-14 font-light italic">
              Synapticore ist ein spezialisiertes Studio für <span className="text-white font-bold">Deep-Tech Architecture</span>. Wir entwerfen und implementieren die unsichtbare Logik hinter globalen Systemen – von <span className="text-white">VW Pixel Streaming</span> bis zu autonomen <span className="text-orange-500 font-bold italic uppercase tracking-tighter">Rust AI Agenten</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="px-12 py-6 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all flex items-center gap-3 text-lg group shadow-2xl">
                STUDIO ARCHIVES <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Heritage Status */}
      <section id="heritage" className="py-24 border-y border-white/5 bg-[#030303]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block italic">DCC Legacy</span>
              <div className="text-3xl font-black italic text-white">2004</div>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Blender Origin</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block italic">Enterprise</span>
              <div className="text-3xl font-black italic text-white">2008</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">VAG Partner ID</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block italic">Intelligence</span>
              <div className="text-3xl font-black italic text-white">2014</div>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Neural Research</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block italic">Performance</span>
              <div className="text-3xl font-black italic text-orange-500">2024</div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Rust & Agents</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Lab / Capabilities */}
      <section id="lab" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h2 className="text-sm font-mono text-cyan-400 mb-6 tracking-[0.5em] uppercase italic">The Studio Philosophy</h2>
            <h3 className="text-4xl md:text-7xl font-black italic uppercase italic tracking-tighter leading-none mb-8">Thinking in Logic. <br /><span className="text-cyan-400">Building in Code.</span></h3>
            <p className="text-slate-400 text-xl font-light italic">
              Wir sind ein Team von „Ghost Architects“. Wir konzipieren nicht nur Blueprints – wir besitzen die Supplier-ID und implementieren die Lösungen selbst. Hands-on. Engine-level.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {studioCapabilities.map((cap, i) => (
              <div key={i} className="p-10 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[3rem] hover:border-cyan-500/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-8 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                  {cap.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{cap.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="projects" className="py-32 bg-[#050505] relative">
        <div className="container mx-auto px-6">
          <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase italic">The Archives</h2>
              <h3 className="text-4xl md:text-[6rem] font-black uppercase tracking-tighter italic leading-none">Global <br />Showcases.</h3>
            </div>
            <div className="max-w-xs text-slate-500 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Validierte Systeme für Weltmarken // Unabhängige technische Führung // Direct Supplier Trust.
            </div>
          </div>

          <div className="space-y-48">
            {caseStudies.map((caseStudy, idx) => (
              <div key={caseStudy.id} className={`grid lg:grid-cols-12 gap-16 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:col-span-7">
                  <div className="group relative overflow-hidden rounded-[4rem] border border-white/10 bg-slate-900 shadow-2xl aspect-video">
                    {/* Placeholder for project image */}
                    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
                       <div className="text-center opacity-10 group-hover:opacity-20 transition-opacity">
                          <Box size={160} className="mx-auto mb-4" />
                          <p className="text-[10px] font-mono tracking-[0.5em] uppercase">Visual_Data_Locked</p>
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Feature Badges */}
                    <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
                       <div className="flex items-center gap-2 px-5 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-xl">
                          {caseStudy.id === 'ai-rust' ? <Bot size={12} /> : caseStudy.id === 'vw-streaming' ? <UserCheck size={12} /> : <Award size={12} />}
                          {caseStudy.id === 'ai-rust' ? '2024 Implementation' : caseStudy.id === 'vw-streaming' ? 'VAG Partner ID' : 'NVIDIA Benchmark'}
                       </div>
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-12 left-12 right-12 flex flex-wrap gap-12">
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
                    "{caseStudy.description}"
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

      {/* The Tech Forge / Code Snippet */}
      <section className="py-32 border-y border-white/5 bg-[#010101] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-7xl font-black mb-10 uppercase italic italic tracking-tighter leading-none text-white">The Neural <br /><span className="text-orange-500">Forge.</span></h2>
              <p className="text-slate-400 text-xl mb-12 font-light italic">
                Wir schmieden Logik in Rust und C++. Unsere Plugins erweitern die Unreal Engine um intelligente Generatoren und autonome Agenten, die industrielle Workflows revolutionieren.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-cyan-400 italic">// 2024 Core</div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Rust-Based Neural Backends</p>
                 </div>
                 <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-cyan-400 italic">// Enterprise Stack</div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Global Pixel Streaming Clusters</p>
                 </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 font-mono text-xs overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                   <Settings size={200} className="animate-spin-slow" />
                </div>
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest italic">Synapticore_Kernel_2024.rs</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
                  </div>
                </div>
                <div className="space-y-3 text-slate-300">
                  <p className="text-orange-500 italic">// Rust Implementation for Autonomous Reasoning</p>
                  <p><span className="text-purple-400">pub struct</span> <span className="text-blue-400">AgentCore</span> {"{"}</p>
                  <p className="pl-6">logic: <span className="text-purple-400">Arc</span>&lt;<span className="text-purple-400">Mutex</span>&lt;NeuralState&gt;&gt;,</p>
                  <p className="pl-6">performance: f32,</p>
                  <p className="pl-4">{"}"}</p>
                  <p><span className="text-purple-400">impl</span> <span className="text-blue-400">AgentCore</span> {"{"}</p>
                  <p className="pl-6 text-slate-500">// Blueprint-to-Code transition logic</p>
                  <p className="pl-6"><span className="text-purple-400">pub fn</span> <span className="text-blue-400">execute_sync</span>(&amp;<span className="text-purple-400">self</span>) {"{ ... }"}</p>
                  <p className="pl-4">{"}"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-40 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter italic mb-14 leading-[0.85]">
              Forge <br /><span className="text-cyan-400 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-black">The Future.</span>
            </h2>
            <p className="text-slate-400 text-2xl md:text-3xl mb-16 font-light italic">
              Bereit für die Architektur der nächsten Generation? Kontaktieren Sie das Lead-Studio hinter 20 Jahren DCC-, Cloud- & AI-Exzellenz.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <a href="mailto:core@synapticore.studio" className="group px-16 py-8 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all text-2xl shadow-2xl active:scale-95 flex items-center gap-4">
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

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black relative">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-700 italic font-bold">Synapticore Studio // High-End Systems Architecture // Est. 2004</span>
            <div className="flex flex-wrap gap-8 opacity-20 grayscale items-center text-sm font-black italic tracking-tighter text-slate-400">
               <span>BLENDER 2.4 ORIGIN</span>
               <span>VW GROUP PARTNER ID</span>
               <span>AUDI</span>
               <span>SKODA</span>
               <span>ADIDAS VR</span>
               <span>NVIDIA SPOTLIGHT</span>
               <span>RUST 2024 CORE</span>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            <a href="#" className="hover:text-cyan-400">Imprint</a>
            <a href="#" className="hover:text-cyan-400">Privacy</a>
            <a href="#" className="hover:text-cyan-400">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;