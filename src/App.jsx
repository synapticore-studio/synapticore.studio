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

import heroDe from '@content/hero.json';
import capabilitiesDe from '@content/capabilities.json';
import caseStudiesDe from '@content/case-studies.json';
import timelineDe from '@content/timeline.json';
import { heroEn, capabilitiesEn, casesEn, timelineEn } from './content.en';
const capabilityIcons = { Brain, Cloud, Wand2 };

const App = () => {
  const isEnglish = /^\/en(?:\/|$)/.test(window.location.pathname);
  const t = (de, en) => isEnglish ? en : de;
  const heroData = isEnglish ? { ...heroDe, ...heroEn } : heroDe;
  const capabilitiesData = isEnglish ? capabilitiesDe.map(item => ({ ...item, ...capabilitiesEn[item.block_id] })) : capabilitiesDe;
  const caseStudiesData = isEnglish ? caseStudiesDe.map(item => ({ ...item, ...casesEn[item.case_id] })) : caseStudiesDe;
  const timelineData = isEnglish ? timelineDe.map(item => ({ ...item, ...timelineEn[item.event_id] })) : timelineDe;
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
          <div className="studio-brand flex items-center gap-4 group cursor-pointer">
            <div className="studio-brand-mark w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 text-white rounded-lg flex items-center justify-center group-hover:rotate-180 transition-transform duration-700 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Dna size={22} />
            </div>
            <div className="flex flex-col">
              <span className="studio-brand-title text-xl font-black tracking-tighter leading-none uppercase italic">Synapti<span className="text-cyan-400">core</span>.studio</span>
              <span className="studio-brand-subtitle text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase italic">{heroData.subtitle}</span>
            </div>
          </div>

          <div className="studio-desktop-menu hidden md:flex items-center gap-10 text-[10px] font-black tracking-[0.2em] uppercase">
            <a href="#lab" className="hover:text-cyan-400 transition-colors">{t('Leistungen', 'Services')}</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">{t('Erfahrung', 'Experience')}</a>
            <a href="#heritage" className="hover:text-cyan-400 transition-colors">{t('Werdegang', 'Journey')}</a>
            <a href="#contact" className="px-6 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-widest text-xs">{t('Kontakt', 'Contact')}</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <a className="studio-language-switch" href={(isEnglish ? '/' : '/en/') + window.location.hash} onClick={(event) => { event.currentTarget.hash = window.location.hash; }} hrefLang={isEnglish ? 'de' : 'en'} lang={isEnglish ? 'de' : 'en'} aria-label={isEnglish ? 'Zur deutschen Seite wechseln' : 'Switch to English'}>{isEnglish ? 'DE' : 'EN'}</a>
            <button className="md:hidden text-white" aria-label={isMenuOpen ? t('Menü schließen', 'Close menu') : t('Menü öffnen', 'Open menu')} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <a href="#lab" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">{t('Leistungen', 'Services')}</a>
              <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">{t('Erfahrung', 'Experience')}</a>
              <a href="#heritage" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400 transition-colors py-2">{t('Werdegang', 'Journey')}</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-widest text-xs text-center mt-2">{t('Kontakt', 'Contact')}</a>
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
            </div>
          </div>
        </div>
      </section>
        <div className={`studio-robot ${robotLeaving ? 'studio-robot--leaving' : ''}`}>
          <div className="studio-robot__stage">
            <Suspense fallback={null}><RobotGuide key={robotVariant} variant={robotVariant} isEnglish={isEnglish} /></Suspense>
          </div>
          <div className="studio-robot__controls" aria-label={t('Robotermodell auswählen', 'Choose robot model')}>
            <button type="button" aria-pressed={robotVariant === 'dr02'} disabled={robotLeaving} onClick={() => selectRobot('dr02')}>DR02-pro</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={robotVariant === 'g1'} disabled={robotLeaving} onClick={() => selectRobot('g1')}>Unitree G1</button>
          </div>
          <p className="studio-robot__credit"><a href={robotVariant === 'dr02' ? '/models/dr02-pro/ATTRIBUTION.txt' : '/models/unitree-g1/ATTRIBUTION.txt'}>{t('3D-Modell & Lizenz', '3D model & licence')}</a></p>
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
            <h2 className="text-sm font-mono text-cyan-400 mb-6 tracking-[0.5em] uppercase italic">{t('Was ich anbiete', 'What I offer')}</h2>
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-8">{t('Von der Pipeline', 'From pipeline')} <br /><span className="text-cyan-400">{t('zum Erlebnis.', 'to experience.')}</span></h3>
            <p className="text-slate-400 text-xl font-light italic">
              {t('Ich entwickle die Werkzeuge und Anwendungen, mit denen Teams 3D-Inhalte erzeugen, wissenschaftliche Daten untersuchen und KI in ihrer Arbeit einsetzen können.', 'I develop tools and applications that help teams create 3D content, investigate scientific data and apply AI in their work.')}
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
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-5">{t('Von der Idee zum Ergebnis', 'From idea to outcome')}</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-10">{t('Was entstehen', 'What we can')} <span className="text-cyan-400">{t('kann.', 'create.')}</span></h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-400 leading-relaxed">
            <div><h3 className="text-xl font-bold text-white mb-3">{t('Szenen & Varianten', 'Scenes & variants')}</h3><p>{t('Prozedurale 3D-Szenen und Assets, deren Materialien, Beleuchtung oder Kameraperspektiven gezielt verändert werden können.', 'Procedural 3D scenes and assets with controllable materials, lighting and camera perspectives.')}</p></div>
            <div><h3 className="text-xl font-bold text-white mb-3">{t('Synthetische Datensätze', 'Synthetic datasets')}</h3><p>{t('Gerenderte Bildvarianten für Objekterkennung und Bildsegmentierung – mit passenden Annotationen und Metadaten für Training und Tests.', 'Rendered image variations for object detection and image segmentation, with annotations and metadata for training and testing.')}</p></div>
            <div><h3 className="text-xl font-bold text-white mb-3">{t('Wissenschaftliche Visualisierungen', 'Scientific visualisations')}</h3><p>{t('Messdaten, räumliche Datensätze und Simulationsergebnisse als erkundbare 3D-Szenen für Analyse und Präsentation.', 'Measurements, spatial datasets and simulation results as explorable 3D scenes for analysis and presentation.')}</p></div>
            <div><h3 className="text-xl font-bold text-white mb-3">{t('Interaktive Prototypen', 'Interactive prototypes')}</h3><p>{t('Echtzeit-Anwendungen, in denen Menschen 3D-Inhalte erkunden und mit KI-Funktionen interagieren können.', 'Real-time applications for exploring 3D content and interacting with AI features.')}</p></div>
          </div>
          <p className="mt-10 text-sm text-slate-400 max-w-3xl leading-relaxed">{t('Synthetische Daten ergänzen reale Daten. Ihre Eignung hängt unter anderem davon ab, wie vielfältig die Szenen sind und wie gut sie mit realen Daten übereinstimmen.', 'Synthetic data complements real data. Its suitability depends, among other things, on scene diversity and how well it corresponds to real-world data.')}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-5">{t('Zusammenarbeit', 'Working together')}</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-10">{t('Von der Frage', 'From question')} <span className="text-cyan-400">{t('zur Anwendung.', 'to application.')}</span></h2>
          <ol className="grid md:grid-cols-4 gap-6 text-slate-400 leading-relaxed">
            <li><strong className="block text-white mb-2">{t('01 · Verstehen', '01 · Understand')}</strong>{t('Gemeinsam klären wir die Aufgabe, die vorhandenen Daten und Werkzeuge sowie die Anforderungen.', 'Together we define the task, existing data and tools, and the requirements.')}</li>
            <li><strong className="block text-white mb-2">{t('02 · Verbinden', '02 · Connect')}</strong>{t('Ich entwickle den Ablauf und binde die benötigten Werkzeuge und Daten ein.', 'I develop the workflow and connect the required tools and data.')}</li>
            <li><strong className="block text-white mb-2">{t('03 · Prüfen', '03 · Evaluate')}</strong>{t('Wir prüfen die Ergebnisse anhand der vereinbarten Kriterien und halten ihre Grenzen fest.', 'We evaluate the results against agreed criteria and document their limitations.')}</li>
            <li><strong className="block text-white mb-2">{t('04 · Übergeben', '04 · Hand over')}</strong>{t('Ich dokumentiere die Lösung und bereite sie für die Weiterarbeit in Ihrem Team vor.', 'I document the solution and prepare it for your team to continue working with.')}</li>
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-5">Open Source</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">{t('Werkzeuge zum', 'Tools to')} <span className="text-cyan-400">{t('Ansehen.', 'explore.')}</span></h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="https://github.com/synapticore-studio/bpy-widget" target="_blank" rel="noopener noreferrer" className="studio-glass p-8 rounded-2xl transition-colors">
              <h3 className="text-2xl font-bold mb-3">bpy-widget <ExternalLink size={16} className="inline" /></h3>
              <p className="text-slate-400">{t('Ein interaktives Blender-Viewport-Widget für Notebooks mit Echtzeit-Rendering über Eevee Next.', 'An interactive Blender viewport widget for notebooks with real-time rendering through Eevee Next.')}</p>
            </a>
            <a href="https://github.com/synapticore-studio/astronomical" target="_blank" rel="noopener noreferrer" className="studio-glass p-8 rounded-2xl transition-colors">
              <h3 className="text-2xl font-bold mb-3">astronomical <ExternalLink size={16} className="inline" /></h3>
              <p className="text-slate-400">{t('Eine Blender-Erweiterung für astronomische Visualisierung mit FITS-Import und wissenschaftlichen Daten.', 'A Blender extension for astronomical visualisation with FITS import and scientific data.')}</p>
            </a>
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-32 bg-[#050505] relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase italic">{t('Erfahrung & Entwicklung', 'Experience & development')}</h2>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">{t('Arbeit, die', 'Work that')} <br />{t('verbindet.', 'connects.')}</h3>
            </div>
            <div className="max-w-md space-y-4 text-slate-400 text-base leading-relaxed">
              <p>{t('Ich bin Björn Bethge, Founder & Creative Technologist von synapticore.studio. Ich arbeite mich in technische Aufgaben ein und verbinde die Perspektiven von Forschung, Entwicklung und Design zu Werkzeugen und Anwendungen, die in bestehende Abläufe passen.', 'I am Björn Bethge, Founder & Creative Technologist at synapticore.studio. I work through technical challenges and bring perspectives from research, development and design together to create tools and applications that fit existing workflows.')}</p>
              <p>{t('Mein Hintergrund liegt in virtueller Absicherung, VR/AR und interaktiver 3D-Technologie. Dabei gehörten technische Details wie Latenz und Performance zum Alltag. Heute nutze ich diese Erfahrung für DCC-Pipelines, synthetische Daten und interaktive Anwendungen rund um Digital Twins und KI.', 'My background is in virtual validation, VR/AR and interactive 3D technology, where technical details such as latency and performance were part of everyday work. Today I apply this experience to DCC pipelines, synthetic data and interactive applications involving digital twins and AI.')}</p>
              <a href={isEnglish ? 'https://synapticore.io/en/#about' : 'https://synapticore.io/#about'} className="inline-flex text-cyan-400 hover:text-cyan-300 transition-colors">{t('Mehr über meinen Hintergrund', 'More about my background')} <span aria-hidden="true" className="ml-2">↗</span></a>
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
              <span className="whitespace-nowrap">{t('Ihr Projekt.', 'Your project.')}</span><br /><span className="whitespace-nowrap text-cyan-400 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-black">{t('Ihr Workflow.', 'Your workflow.')}</span>
            </h2>
            <p className="text-slate-400 text-2xl md:text-3xl mb-16 font-light italic">
              {t('Sie arbeiten an einem Digital Twin, einer VR-Anwendung oder synthetischen Daten für KI und Robotik? Schreiben Sie mir, welche Aufgabe Sie lösen möchten und welche Systeme Ihr Team nutzt.', 'Working on a digital twin, VR application or synthetic data for AI and robotics? Tell me what you want to solve and which systems your team uses.')}
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <a href={mailtoLink(EMAIL_DOMAIN)} className="group px-8 py-4 sm:px-16 sm:py-8 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all text-lg sm:text-2xl shadow-2xl active:scale-95 flex items-center gap-4">
                {t('PROJEKT BESPRECHEN', 'DISCUSS YOUR PROJECT')} <Mail size={24} className="group-hover:rotate-12 transition-transform" />
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
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-700 italic font-bold">{t('Synapticore Studio // Björn Bethge – 20+ Jahre DCC', 'Synapticore Studio // Björn Bethge – 20+ years in DCC')}</span>
            <div className="flex flex-wrap gap-4 sm:gap-8 opacity-20 grayscale items-center text-sm font-black italic tracking-tighter text-slate-400">
              <span>{t('3D & VISUALISIERUNG', '3D & VISUALISATION')}</span>
              <span>{t('INDUSTRIEERFAHRUNG', 'INDUSTRY EXPERIENCE')}</span>
              <span>{t('PRODUKTVISUALISIERUNG', 'PRODUCT VISUALISATION')}</span>
              <span>VIRTUAL PRODUCTION</span>
              <span>AGENTIC DCC</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            <a href={mailtoLink(EMAIL_DOMAIN)} className="hover:text-cyan-400 transition-colors">{t('Kontakt', 'Contact')}</a>
            <a href="https://www.linkedin.com/in/bj%C3%B6rn-bethge-a0754a329" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
            <a href={isEnglish ? '/en/impressum.html' : '/impressum.html'} className="hover:text-cyan-400 transition-colors">{t('Impressum', 'Legal notice')}</a>
            <a href={isEnglish ? '/en/impressum.html#datenschutz' : '/impressum.html#datenschutz'} className="hover:text-cyan-400 transition-colors">{t('Datenschutz', 'Privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
