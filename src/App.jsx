import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
import { getEmail, mailtoLink } from './utils/email';

const EMAIL_DOMAIN = 'synapticore.studio';
const RobotGuide = lazy(() => import('./RobotGuide'));

import heroData from '@content/hero.json';
import capabilitiesData from '@content/capabilities.json';
import caseStudiesData from '@content/case-studies.json';
import timelineData from '@content/timeline.json';
const capabilityIcons = { Brain, Cloud, Wand2 };

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [robotVariant, setRobotVariant] = useState('dr02');
  const [robotLeaving, setRobotLeaving] = useState(false);
  const switchTimer = useRef(null);

  const selectRobot = (nextVariant) => {
    if (nextVariant === robotVariant || robotLeaving) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRobotVariant(nextVariant);
      return;
    }
    setRobotLeaving(true);
    switchTimer.current = window.setTimeout(() => {
      setRobotVariant(nextVariant);
      setRobotLeaving(false);
      switchTimer.current = null;
    }, 650);
  };

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const shell = document.querySelector('.studio-shell');
    const items = shell?.querySelectorAll('.studio-reveal');
    if (!shell || !items?.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    items.forEach((item) => observer.observe(item));
    shell.classList.add('studio-motion-ready');
    return () => { observer.disconnect(); shell.classList.remove('studio-motion-ready'); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="studio-shell min-h-screen bg-[#020202] text-white font-sans selection:bg-cyan-500/30">
      <div className="studio-atmosphere" aria-hidden="true"><div className="studio-atmosphere__grid" /></div>
        <div className="studio-spatial" aria-hidden="true">
          <div className="studio-spatial__halo" />
          <div className="studio-spatial__scene">
            <div className="studio-spatial__orbit studio-spatial__orbit--one" />
            <div className="studio-spatial__orbit studio-spatial__orbit--two" />
            <div className="studio-spatial__orbit studio-spatial__orbit--three" />
            <div className="studio-spatial__core"><i /><i /><i /></div>
            <span className="studio-spatial__point studio-spatial__point--one" />
            <span className="studio-spatial__point studio-spatial__point--two" />
            <span className="studio-spatial__point studio-spatial__point--three" />
          </div>
        </div>
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
            <a href="#lab" className="hover:text-cyan-400 transition-colors">Leistungen</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Erfahrung</a>
            <a href="#heritage" className="hover:text-cyan-400 transition-colors">Werdegang</a>
            <a href="#contact" className="px-6 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-widest text-xs">Kontakt</a>
          </div>

          <button className="md:hidden text-white" aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <a href="#lab" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">Leistungen</a>
              <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">Erfahrung</a>
              <a href="#heritage" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">Werdegang</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-widest text-xs text-center mt-2">Kontakt</a>
            </div>
          </div>
        )}
      </nav>

      <section className="studio-hero relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 0.5px, transparent 0.5px)', backgroundSize: '50px 50px' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px] bg-blue-600/5 rounded-full blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pointer-events-none">
          <div className="max-w-6xl studio-hero-content pointer-events-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              <CircuitBoard size={14} className="text-cyan-400 animate-pulse" /> {heroData.features[0]}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-black leading-[0.95] mb-10 tracking-tighter italic uppercase">
              {heroData.title.split('\n')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-800">{heroData.title.split('\n')[1]}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl text-slate-400 max-w-4xl leading-tight mb-8 md:mb-14 font-light italic" dangerouslySetInnerHTML={{ __html: heroData.description }} />
            <div className="flex flex-wrap gap-4">
              <a href="#lab" className="px-8 py-4 sm:px-12 sm:py-6 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all flex items-center gap-3 text-base sm:text-lg group shadow-2xl">
                {heroData.cta_text} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/world/" className="px-8 py-4 sm:px-12 sm:py-6 border border-white/20 text-white font-black rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center gap-3 text-base sm:text-lg group">
                ZWANZIG JAHRE DURCHFLIEGEN <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
        <div className={`studio-robot ${robotLeaving ? 'studio-robot--leaving' : ''}`}>
          <div className="studio-robot__stage">
            <Suspense fallback={null}><RobotGuide key={robotVariant} variant={robotVariant} /></Suspense>
          </div>
          <div className="studio-robot__controls" aria-label="Robotermodell auswählen">
            <button type="button" aria-pressed={robotVariant === 'dr02'} disabled={robotLeaving} onClick={() => selectRobot('dr02')}>DR02-pro</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={robotVariant === 'g1'} disabled={robotLeaving} onClick={() => selectRobot('g1')}>Unitree G1</button>
          </div>
          <p className="studio-robot__credit"><a href={robotVariant === 'dr02' ? '/models/dr02-pro/ATTRIBUTION.txt' : '/models/unitree-g1/ATTRIBUTION.txt'}>3D-Modell &amp; Lizenz</a></p>
        </div>


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
            <h2 className="text-sm font-mono text-cyan-400 mb-6 tracking-[0.5em] uppercase italic">Was ich anbiete</h2>
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-8">Von der Pipeline <br /><span className="text-cyan-400">zum Erlebnis.</span></h3>
            <p className="text-slate-400 text-xl font-light italic">
              Ich entwickle die Werkzeuge und Anwendungen, mit denen Teams 3D-Inhalte erzeugen, wissenschaftliche Daten untersuchen und KI in ihrer Arbeit einsetzen können.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {capabilitiesData.map((cap, i) => {
              const IconComponent = capabilityIcons[cap.icon];
              return (
                <div key={i} className="studio-glass studio-reveal p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] transition-all group" style={{ '--reveal-delay': `${i * 100}ms` }}>
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
              href="https://github.com/orgs/synapticore-studio/repositories?q=mirror%3Afalse+fork%3Afalse+archived%3Afalse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 transition-all italic"
            >
              Open Source Repositories <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      <section className="studio-section-glass py-16 md:py-24 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-5">Von der Idee zum Ergebnis</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-10">Was entstehen <span className="text-cyan-400">kann.</span></h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-400 leading-relaxed">
            <div><h3 className="text-xl font-bold text-white mb-3">Szenen & Varianten</h3><p>Prozedurale 3D-Szenen und Assets, deren Materialien, Beleuchtung oder Kameraperspektiven gezielt verändert werden können.</p></div>
            <div><h3 className="text-xl font-bold text-white mb-3">Synthetische Datensätze</h3><p>Gerenderte Bildvarianten für Objekterkennung und Bildsegmentierung – mit passenden Annotationen und Metadaten für Training und Tests.</p></div>
            <div><h3 className="text-xl font-bold text-white mb-3">Wissenschaftliche Visualisierungen</h3><p>Messdaten, räumliche Datensätze und Simulationsergebnisse als erkundbare 3D-Szenen für Analyse und Präsentation.</p></div>
            <div><h3 className="text-xl font-bold text-white mb-3">Interaktive Prototypen</h3><p>Echtzeit-Anwendungen, in denen Menschen 3D-Inhalte erkunden und mit KI-Funktionen interagieren können.</p></div>
          </div>
          <p className="mt-10 text-sm text-slate-400 max-w-3xl leading-relaxed">Synthetische Daten ergänzen reale Daten. Ihre Eignung hängt unter anderem davon ab, wie vielfältig die Szenen sind und wie gut sie mit realen Daten übereinstimmen.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-5">Zusammenarbeit</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-10">Von der Frage <span className="text-cyan-400">zur Anwendung.</span></h2>
          <ol className="grid md:grid-cols-4 gap-6 text-slate-400 leading-relaxed">
            <li><strong className="block text-white mb-2">01 · Verstehen</strong>Gemeinsam klären wir die Aufgabe, die vorhandenen Daten und Werkzeuge sowie die Anforderungen.</li>
            <li><strong className="block text-white mb-2">02 · Verbinden</strong>Ich entwickle den Ablauf und binde die benötigten Werkzeuge und Daten ein.</li>
            <li><strong className="block text-white mb-2">03 · Prüfen</strong>Wir prüfen die Ergebnisse anhand der vereinbarten Kriterien und halten ihre Grenzen fest.</li>
            <li><strong className="block text-white mb-2">04 · Übergeben</strong>Ich dokumentiere die Lösung und bereite sie für die Weiterarbeit in Ihrem Team vor.</li>
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-5">Open Source</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">Werkzeuge zum <span className="text-cyan-400">Ansehen.</span></h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="https://github.com/synapticore-studio/bpy-widget" target="_blank" rel="noopener noreferrer" className="studio-glass p-8 rounded-2xl transition-colors">
              <h3 className="text-2xl font-bold mb-3">bpy-widget <ExternalLink size={16} className="inline" /></h3>
              <p className="text-slate-400">Ein interaktives Blender-Viewport-Widget für Notebooks mit Echtzeit-Rendering über Eevee Next.</p>
            </a>
            <a href="https://github.com/synapticore-studio/astronomical" target="_blank" rel="noopener noreferrer" className="studio-glass p-8 rounded-2xl transition-colors">
              <h3 className="text-2xl font-bold mb-3">astronomical <ExternalLink size={16} className="inline" /></h3>
              <p className="text-slate-400">Eine Blender-Erweiterung für astronomische Visualisierung mit FITS-Import und wissenschaftlichen Daten.</p>
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-32 bg-[#050505] relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase italic">Erfahrung & Entwicklung</h2>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Arbeit, die <br />verbindet.</h3>
            </div>
            <div className="max-w-md text-slate-400 text-base leading-relaxed">
              Ich bin Björn Bethge, Founder &amp; Creative Technologist von synapticore.studio. Als technischer Berater und Entwickler habe ich IT, Forschung, Entwicklung und Design in VR/AR-Projekten und der virtuellen Absicherung zusammengebracht. Technische Details gehörten dabei zum Alltag – etwa Latenz und Performance, die für den Komfort in VR entscheidend sind. Heute verbinde ich diese Erfahrung mit Digital Twins, KI und interaktiven 3D-Anwendungen.
            </div>
          </div>

          <div className="studio-experience-list">
            {caseStudiesData.map((caseStudy, idx) => (
              <article key={caseStudy.case_id} className="studio-experience studio-reveal">
                <div className="studio-experience__heading">
                  <span className="studio-experience__number" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase italic">{caseStudy.brand}</p>
                    <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic leading-none">{caseStudy.title}</h4>
                  </div>
                </div>
                <div className="studio-experience__body">
                  <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light italic">{caseStudy.description}</p>
                  <div className="flex flex-wrap gap-2 mt-7">
                    {caseStudy.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                  <p className="studio-experience__meta">{caseStudy.stats.join(' · ')}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-40 relative">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[clamp(2rem,6vw,5.5rem)] font-black uppercase tracking-tighter italic mb-8 md:mb-12 leading-[0.95]">
              <span className="whitespace-nowrap">Ihr Projekt.</span><br /><span className="whitespace-nowrap text-cyan-400 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-black">Ihr Workflow.</span>
            </h2>
            <p className="text-slate-400 text-2xl md:text-3xl mb-16 font-light italic">
              Sie arbeiten an einem Digital Twin, einer VR-Anwendung oder synthetischen Daten für KI und Robotik? Schreiben Sie mir, welche Aufgabe Sie lösen möchten und welche Systeme Ihr Team nutzt.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <a href={mailtoLink(EMAIL_DOMAIN)} className="group px-8 py-4 sm:px-16 sm:py-8 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all text-lg sm:text-2xl shadow-2xl active:scale-95 flex items-center gap-4">
                PROJEKT BESPRECHEN <Mail size={24} className="group-hover:rotate-12 transition-transform" />
              </a>
              <div className="flex flex-col items-center gap-4 mt-4">
                <span className="text-sm font-mono text-slate-500">{getEmail(EMAIL_DOMAIN)}</span>
                <a href="https://www.linkedin.com/in/bj%C3%B6rn-bethge-a0754a329" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-cyan-400 transition-colors">
                  LinkedIn
                </a>
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
              <span>3D & VISUALISIERUNG</span>
              <span>INDUSTRIEERFAHRUNG</span>
              <span>PRODUKTVISUALISIERUNG</span>
              <span>VIRTUAL PRODUCTION</span>
              <span>AGENTIC DCC</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            <a href={mailtoLink(EMAIL_DOMAIN)} className="hover:text-cyan-400 transition-colors">Kontakt</a>
            <a href="https://www.linkedin.com/in/bj%C3%B6rn-bethge-a0754a329" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
            <a href="/impressum.html" className="hover:text-cyan-400 transition-colors">Impressum</a>
            <a href="/impressum.html#datenschutz" className="hover:text-cyan-400 transition-colors">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
