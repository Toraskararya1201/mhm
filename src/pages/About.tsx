import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Users, Target, Eye, FlaskConical, Monitor, Dumbbell, Quote, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ─── scroll-reveal hook ─── */
function useReveal(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.1, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const FacultyCard = ({ teacher }: { teacher: { name: string; subject: string; qualification: string } }) => (
  <div className="group relative border border-gray-200 rounded-xl p-5 text-center bg-white transition duration-300 hover:shadow-lg hover:border-pink-300 h-[220px] w-full flex flex-col justify-between overflow-hidden">
    {/* Corner accents — rose */}
    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-pink-400 rounded-tl-xl"></div>
    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-pink-400 rounded-br-xl"></div>
    {/* Hover color bleed */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
         style={{ background: 'linear-gradient(135deg,rgba(255,240,245,.7) 0%,rgba(255,251,235,.7) 100%)' }}></div>
    <div className="relative z-10 w-14 h-14 mx-auto rounded-full flex items-center justify-center text-lg font-bold text-gray-700 group-hover:text-white transition-all duration-300"
         style={{ background: '#fce7f0', '--tw-shadow': 'none' } as React.CSSProperties}
         onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#e05a8a'; }}
         onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#fce7f0'; }}>
      {teacher.name.charAt(0)}
    </div>
    <h3 className="relative z-10 text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">{teacher.name}</h3>
    <p className="relative z-10 text-[10px] text-gray-500 uppercase tracking-wide">{teacher.subject}</p>
    <p className="relative z-10 text-xs text-gray-600 leading-tight">{teacher.qualification}</p>
  </div>
);

const About = () => {
  const { t } = useTranslation();

  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [hostelRoutineExpanded, setHostelRoutineExpanded] = useState(false);

  const facilities = [
    { icon: BookOpen,     title: t('about_page.facility1_title'), description: t('about_page.facility1_desc'), accent: '#e05a8a', accentBg: '#fce7f0' },
    { icon: Monitor,      title: t('about_page.facility2_title'), description: t('about_page.facility2_desc'), accent: '#f59e0b', accentBg: '#fef3c7' },
    { icon: Target,       title: t('about_page.facility3_title'), description: t('about_page.facility3_desc'), accent: '#0d9488', accentBg: '#ccfbf1' },
    { icon: FlaskConical, title: t('about_page.facility4_title'), description: t('about_page.facility4_desc'), accent: '#8b5cf6', accentBg: '#ede9fe' },
    { icon: Eye,          title: t('about_page.facility5_title'), description: t('about_page.facility5_desc'), accent: '#0891b2', accentBg: '#e0f2fe' },
    { icon: Dumbbell,     title: t('about_page.facility6_title'), description: t('about_page.facility6_desc'), accent: '#e05a8a', accentBg: '#fce7f0' },
    { icon: Users,        title: t('about_page.facility7_title'), description: t('about_page.facility7_desc'), accent: '#f59e0b', accentBg: '#fef3c7' },
    { icon: BookOpen,     title: t('about_page.facility8_title'), description: t('about_page.facility8_desc'), accent: '#0d9488', accentBg: '#ccfbf1' },
  ];

  const faculty = [
    { name: t('about_page.faculty1_name'), subject: t('about_page.faculty1_subject'), qualification: t('about_page.faculty1_qual') },
    { name: t('about_page.faculty2_name'), subject: t('about_page.faculty2_subject'), qualification: t('about_page.faculty2_qual') },
    { name: t('about_page.faculty3_name'), subject: t('about_page.faculty3_subject'), qualification: t('about_page.faculty3_qual') },
    { name: t('about_page.faculty4_name'), subject: t('about_page.faculty4_subject'), qualification: t('about_page.faculty4_qual') },
    { name: t('about_page.faculty5_name'), subject: t('about_page.faculty5_subject'), qualification: t('about_page.faculty5_qual') },
  ];

  const heroRef       = useReveal();
  const storyImgRef   = useReveal();
  const storyTxtRef   = useReveal();
  const visionRef     = useReveal();
  const facilitiesRef = useReveal();
  const facilGridRef  = useReveal();
  const principalRef  = useReveal();
  const facultyHdRef  = useReveal();
  const facultyGrdRef = useReveal();
  const hostelRef     = useReveal();

  return (
    <>
      <style>{`
        /* ── Reveal system ── */
        .reveal           { opacity:0; transform:translateY(36px); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal.revealed  { opacity:1; transform:none }
        .reveal-left          { opacity:0; transform:translateX(-52px); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal-left.revealed { opacity:1; transform:none }
        .reveal-right          { opacity:0; transform:translateX(52px); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal-right.revealed { opacity:1; transform:none }
        .reveal-scale          { opacity:0; transform:scale(.92); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal-scale.revealed { opacity:1; transform:scale(1) }

        .stagger-grid > * { opacity:0; transform:translateY(28px); transition:opacity .55s cubic-bezier(.4,0,.2,1),transform .55s cubic-bezier(.4,0,.2,1) }
        .stagger-grid.revealed > *:nth-child(1)  { opacity:1;transform:none;transition-delay:.04s }
        .stagger-grid.revealed > *:nth-child(2)  { opacity:1;transform:none;transition-delay:.10s }
        .stagger-grid.revealed > *:nth-child(3)  { opacity:1;transform:none;transition-delay:.16s }
        .stagger-grid.revealed > *:nth-child(4)  { opacity:1;transform:none;transition-delay:.22s }
        .stagger-grid.revealed > *:nth-child(5)  { opacity:1;transform:none;transition-delay:.28s }
        .stagger-grid.revealed > *:nth-child(6)  { opacity:1;transform:none;transition-delay:.34s }
        .stagger-grid.revealed > *:nth-child(7)  { opacity:1;transform:none;transition-delay:.40s }
        .stagger-grid.revealed > *:nth-child(8)  { opacity:1;transform:none;transition-delay:.46s }

        /* ── Hero animations ── */
        @keyframes heroFade  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes heroSub   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes heroBadge { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
        .hero-badge { animation:heroBadge .6s cubic-bezier(.4,0,.2,1) .1s both }
        .hero-h1    { animation:heroFade  .8s cubic-bezier(.4,0,.2,1) .3s both }
        .hero-sub   { animation:heroSub   .8s cubic-bezier(.4,0,.2,1) .55s both }

        /* ── Float blobs ── */
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        .float-a { animation:floatA 6s ease-in-out infinite }
        .float-b { animation:floatB 8s ease-in-out infinite }

        /* ── Grow line ── */
        @keyframes growLine { from{width:0} to{width:3rem} }
        .grow-line { animation:growLine .6s cubic-bezier(.4,0,.2,1) .5s both }

        /* ── Card lift ── */
        .card-lift { transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease }
        .card-lift:hover { transform:translateY(-5px) scale(1.01) }

        /* ── Num pop ── */
        @keyframes numPop { 0%{opacity:0;transform:scale(.5) translateY(10px)} 80%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        .num-pop { animation:numPop .7s cubic-bezier(.4,0,.2,1) .6s both }

        /* ── Hero bottom clip ── */
        .hero-clip { clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%) }

        /* ── Principal panel ── */
        .principal-left          { opacity:0; transform:translateX(-60px); transition:opacity .8s cubic-bezier(.4,0,.2,1) .1s,transform .8s cubic-bezier(.4,0,.2,1) .1s }
        .principal-left.revealed { opacity:1; transform:none }
        .principal-right          { opacity:0; transform:translateX(60px); transition:opacity .8s cubic-bezier(.4,0,.2,1) .25s,transform .8s cubic-bezier(.4,0,.2,1) .25s }
        .principal-right.revealed { opacity:1; transform:none }

        .message-bg-text-desktop { display: block; }
        .message-bg-text-mobile  { display: none;  }
        @media (max-width: 1023px) {
          .message-bg-text-desktop { display: none !important; }
          .message-bg-text-mobile  { display: block !important; }
          .principal-message-panel { padding: 1.75rem 1.25rem !important; }
        }

        /* ── Mobile expand ── */
        .mobile-expand { max-height:0; overflow:hidden; transition:max-height .45s cubic-bezier(.4,0,.2,1) }
        .mobile-expand.open { max-height:2000px }
        .chevron-icon { transition:transform .3s cubic-bezier(.4,0,.2,1) }
        .chevron-icon.rotated { transform:rotate(180deg) }

        /* ── Show/hide breakpoints ── */
        .mobile-only  { display: block; }
        .desktop-only { display: none;  }
        @media (min-width: 768px) {
          .mobile-only  { display: none !important; }
          .desktop-only { display: grid !important; }
        }

        /* ── List stagger ── */
        .list-item { opacity:0; transform:translateX(-16px); transition:opacity .4s ease,transform .4s ease }
        .revealed .list-item { opacity:1; transform:none }
        .revealed .list-item:nth-child(1){transition-delay:.05s}
        .revealed .list-item:nth-child(2){transition-delay:.13s}
        .revealed .list-item:nth-child(3){transition-delay:.21s}
        .revealed .list-item:nth-child(4){transition-delay:.29s}
        .revealed .list-item:nth-child(5){transition-delay:.37s}
        .revealed .list-item:nth-child(6){transition-delay:.45s}
        .revealed .list-item:nth-child(7){transition-delay:.53s}

        /* ── Facility card hover bar ── */
        .facility-card { position:relative; overflow:hidden; }
        .facility-card .fac-bar { position:absolute; bottom:0; left:0; width:0; height:3px; border-radius:0 0 .75rem .75rem; transition:width .4s }
        .facility-card:hover .fac-bar { width:100% }
      `}</style>

      <div className="min-h-screen bg-slate-50">

        {/* ════════════ 1. HERO ════════════ */}
        {/* Rose → amber → soft yellow — matches Admission hero */}
        <section
          className="hero-clip relative pt-32 pb-24 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#fff0f5 0%,#fff7ed 50%,#fffbeb 100%)' }}
        >
          {/* Blobs */}
          <div className="float-a absolute top-0 right-[-8%] w-[35%] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background:'rgba(224,90,138,0.18)' }}></div>
          <div className="float-b absolute bottom-0 left-[-5%] w-[28%] h-[300px] rounded-full blur-[80px] pointer-events-none" style={{ background:'rgba(251,191,36,0.18)' }}></div>
          <div className="float-a absolute top-10 left-[10%] w-[18%] h-[200px] rounded-full blur-[80px] pointer-events-none" style={{ background:'rgba(139,92,246,0.12)' }}></div>
          <div className="float-b absolute top-1/2 right-[15%] w-[15%] h-[180px] rounded-full blur-[70px] pointer-events-none" style={{ background:'rgba(13,148,136,0.12)' }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="hero-badge inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border px-5 py-2 rounded-full shadow-sm mb-5" style={{ borderColor:'#fce7f0' }}>
              <span className="w-2 h-2 rounded-full" style={{ background:'#e05a8a' }}></span>
              <span className="font-bold uppercase tracking-[0.18em] text-xs" style={{ color:'#c94070' }}>
                {t('about_page.est_badge', 'Est. 1989 · Our Story')}
              </span>
            </div>
            <h1 className="hero-h1 text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tighter leading-tight">
              {t('about_page.title', 'About Our')}{' '}
              <span style={{ color:'#e05a8a' }}>{t('about_page.title_accent', 'School.')}</span>
            </h1>
            <p className="hero-sub text-base md:text-lg text-gray-500 max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
              {t('about_page.subtitle', 'A legacy of excellence spanning over')}{' '}
              <span className="text-gray-900 font-bold underline decoration-4" style={{ textDecorationColor:'#fde68a' }}>
                {t('about_page.subtitle_years', '35 years')}
              </span>.
            </p>
          </div>
        </section>

        {/* ════════════ 2. OUR STORY ════════════ */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              {/* Image side */}
              <div ref={storyImgRef} className="reveal-left relative group">
                {/* Teal dot pattern */}
                <div className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl pointer-events-none"
                     style={{ backgroundImage:'radial-gradient(circle,#5eead4 1.5px,transparent 1.5px)', backgroundSize:'12px 12px', opacity:0.6, zIndex:0 }} />
                {/* Violet offset border */}
                <div className="absolute pointer-events-none" style={{ inset:0, transform:'translate(-10px,-10px)', border:'2px solid #c4b5fd', borderRadius:'1rem', zIndex:0 }} />
                <div className="relative z-10 rounded-2xl p-3 bg-white"
                     style={{ boxShadow:'0 25px 60px -10px rgba(224,90,138,0.12),0 10px 25px -5px rgba(0,0,0,0.07)', border:'1px solid #fce7f0' }}>
                  <div className="rounded-xl overflow-hidden">
                    <img src="/mainschool.jpeg" alt="School Campus"
                         className="w-full h-[400px] object-cover block group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                {/* Amber badge */}
                <div className="num-pop absolute -bottom-4 left-6 z-20 bg-white rounded-xl px-4 py-2 flex items-center gap-2"
                     style={{ border:'1px solid #fef3c7', boxShadow:'0 4px 16px rgba(245,158,11,0.15)' }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:'#f59e0b' }} />
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest">32+ {t('about_page.years_of_legacy','Years of Legacy')}</span>
                </div>
              </div>

              {/* Text side */}
              <div ref={storyTxtRef} className="reveal-right">
                <div className="flex items-center gap-4 mb-6">
                  <div className="grow-line h-[2px]" style={{ background:'#e05a8a' }}></div>
                  <span className="font-bold uppercase tracking-[0.4em] text-[11px]" style={{ color:'#e05a8a' }}>
                    {t('about_page.institution_label','OUR INSTITUTION')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
                  {t('about_page.story_heading','Building the future,')}<br />
                  <span className="px-4 py-1 inline-block mt-2 text-white" style={{ background:'#f59e0b' }}>
                    {t('about_page.story_heading_accent','one student at a time.')}
                  </span>
                </h2>
                <div className="space-y-5 text-gray-600 leading-relaxed text-[17px] font-medium tracking-wide">
                  <p>{t('about_page.story_p1')}</p>
                  <p>{t('about_page.story_p2')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ 3. VISION & MISSION ════════════ */}
        {/* Light cream background — matches Admission docs/dates section */}
        <section className="py-8 bg-gray-50/50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="stagger-grid flex flex-col lg:flex-row gap-12 justify-center revealed">

      {/* Vision — teal accent */}
      <div className="card-lift flex-1 max-w-[550px] group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: '#0d9488' }}></div>
        <div className="flex items-center p-6 gap-6">
          <div className="flex-shrink-0 w-14 h-14 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all duration-500">
            <Eye className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-teal-600 transition-colors">
              {t('about_page.vision_label', 'Our Vision')}
            </h3>
            <p className="text-gray-500 text-[12px] leading-relaxed tracking-wide">
              {t('about_page.vision_text')}
            </p>
          </div>
        </div>
      </div>

      {/* Mission — amber accent */}
      <div className="card-lift flex-1 max-w-[550px] group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: '#f59e0b' }}></div>
        <div className="flex items-center p-6 gap-6">
          <div className="flex-shrink-0 w-14 h-14 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-500">
            <Target className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-amber-500 transition-colors">
              {t('about_page.mission_label', 'Our Mission')}
            </h3>
            <p className="text-gray-500 text-[12px] leading-relaxed tracking-wide">
              {t('about_page.mission_text')}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
        {/* ════════════ 4. FACILITIES ════════════ */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div ref={facilitiesRef} className="reveal relative mb-10">
              <span className="absolute -top-12 left-0 text-7xl md:text-9xl font-black text-gray-50 uppercase tracking-tighter select-none -z-0 pointer-events-none">
                Campus
              </span>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grow-line h-1.5 rounded-full" style={{ background:'#8b5cf6' }}></div>
                    <span className="font-bold uppercase tracking-[0.4em] text-[10px]" style={{ color:'#8b5cf6' }}>
                      {t('about_page.facilities_resources_label','FACILITIES & RESOURCES')}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {t('about_page.facilities_title','World-Class')}{' '}
                    <span style={{ color:'#8b5cf6' }}>{t('about_page.facilities_title_accent','Infrastructure')}</span>
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-xs md:text-right font-medium tracking-wide leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-purple-100 pl-4 md:pl-0 md:pr-4">
                  {t('about_page.facilities_subtitle')}
                </p>
              </div>
            </div>

            {/* DESKTOP grid */}
            <div ref={facilGridRef} className="stagger-grid desktop-only grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {facilities.map((item, idx) => (
                <div key={idx}
                     className="facility-card card-lift group flex items-center bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                     style={{ '--hover-border': item.accent } as React.CSSProperties}
                     onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = item.accent; (e.currentTarget as HTMLElement).style.background = item.accentBg; }}
                     onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f3f4f6'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                  <div className="fac-bar" style={{ background:`linear-gradient(90deg,${item.accent},${item.accent}99)` }}></div>
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-500"
                       style={{ background: item.accentBg, color: item.accent }}
                       onMouseOver={e => { (e.currentTarget as HTMLElement).style.background=item.accent;(e.currentTarget as HTMLElement).style.color='#fff'; }}
                       onMouseOut={e => { (e.currentTarget as HTMLElement).style.background=item.accentBg;(e.currentTarget as HTMLElement).style.color=item.accent; }}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-bold text-gray-900 transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* MOBILE */}
            <div className="mobile-only flex flex-col gap-3">
              {facilities.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-11 h-11 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background:item.accentBg, color:item.accent }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-1">{item.description}</p>
                  </div>
                </div>
              ))}
              <div className={`mobile-expand ${facilitiesExpanded ? 'open' : ''}`}>
                <div className="flex flex-col gap-3 pt-3">
                  {facilities.slice(4).map((item, idx) => (
                    <div key={idx+4} className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-11 h-11 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background:item.accentBg, color:item.accent }}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-500 text-xs line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setFacilitiesExpanded(prev => !prev)}
                className="mt-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold uppercase tracking-widest transition-colors active:scale-[0.98]"
                style={{ borderColor:'#c4b5fd', background:'#f5f3ff', color:'#7c3aed' }}>
                {facilitiesExpanded ? t('about_page.show_less','Show Less') : `${t('about_page.view_all_facilities','View All')} (${facilities.length - 4} ${t('about_page.more','more')})`}
                <ChevronDown className={`w-4 h-4 chevron-icon ${facilitiesExpanded ? 'rotated' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════ 5. HOSTEL ════════════ */}
        {/* Very soft warm tint — matches Admission enquiry section */}
        <section className="py-14 relative overflow-hidden" style={{ background:'#fdf8ff' }}>
          {/* Violet blob */}
          <div className="float-a absolute top-0 left-0 w-72 h-72 rounded-full blur-[100px] opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background:'#ede9fe' }}></div>
          {/* Rose blob */}
          <div className="float-b absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-40 translate-x-1/3 translate-y-1/3 pointer-events-none" style={{ background:'#fce7f0' }}></div>
          {/* Amber blob centre */}
          <div className="float-a absolute top-1/2 left-1/2 w-60 h-60 rounded-full blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background:'#fef3c7' }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div ref={hostelRef} className="reveal relative mb-12">
              <span className="absolute -top-12 left-0 text-7xl md:text-9xl font-black text-gray-100 uppercase tracking-tighter select-none -z-0 pointer-events-none">
                {t('about_page.hostel_title','Hostel')}
              </span>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grow-line h-1.5 rounded-full" style={{ background:'#ad5ae0' }}></div>
                    <span className="font-bold uppercase tracking-[0.4em] text-[10px]" style={{ color:'#ad5ae0' }}>
                      {t('about_page.hostel_label','RESIDENTIAL LIFE')}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {t('about_page.hostel_title','Hostel')}{' '}
                    <span style={{ color:'#000000' }}>{t('about_page.hostel_title_accent','Life')}</span>
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-xs md:text-right font-medium tracking-wide leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-pink-100 pl-4 md:pl-0 md:pr-4">
                  {t('about_page.hostel_subtitle')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Hostel Facilities — rose accent */}
               <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'#4f46e5' }}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">
                    {t('about_page.hostel_facilities_heading','Facilities')}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {(['hostel_f1','hostel_f2','hostel_f3','hostel_f4','hostel_f5','hostel_f6','hostel_f7'] as const).map((key, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-medium">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'#4f46e5' }}></span>
                      {t(`about_page.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Food & Safety — teal accent */}
              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'#0d9488' }}>
                    <FlaskConical className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">
                    {t('about_page.hostel_food_heading','Food & Safety')}
                  </h3>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {(['hostel_food1','hostel_food2','hostel_food3','hostel_food4'] as const).map((key, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-medium">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'#0d9488' }}></span>
                      {t(`about_page.${key}`)}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color:'#0d9488' }}>
                    {t('about_page.hostel_safety_heading','Safety Measures')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['hostel_s1','hostel_s2','hostel_s3','hostel_s4'] as const).map((key, i) => (
                      <span key={i} className="text-[11px] font-semibold border px-3 py-1 rounded-full"
                            style={{ background:'#f0fdfa', color:'#0d9488', borderColor:'#99f6e4' }}>
                        {t(`about_page.${key}`)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Routine — amber accent */}
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div
                className="flex items-center gap-3 mb-0 md:mb-6 cursor-pointer md:cursor-default select-none"
                onClick={() => setHostelRoutineExpanded(prev => !prev)}
                role="button" aria-expanded={hostelRoutineExpanded}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'#f59e0b' }}>
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex-1">
                  {t('about_page.hostel_routine_heading','Daily Routine')}
                </h3>
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {t('about_page.hostel_routine_days','Mon – Sat')}
                </span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 chevron-icon md:hidden`} style={{ color:'#f59e0b' }} />
              </div>
              <p className="mt-1 mb-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 md:hidden">
                {t('about_page.hostel_routine_days','Mon – Sat')}
              </p>

              {/* Desktop grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] as const).map((n, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors hover:border-amber-200"
                       style={{ background:'#fffbeb', borderColor:'#fef3c7' }}>
                    <span className="text-sm font-black tabular-nums whitespace-nowrap tracking-tight min-w-[80px]" style={{ color:'#d97706' }}>
                      {t(`about_page.hostel_t${n}_time`)}
                    </span>
                    <div className="w-px h-7 bg-amber-200 flex-shrink-0"></div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{t(`about_page.hostel_t${n}_act`)}</p>
                  </div>
                ))}
              </div>

              {/* Mobile collapsible */}
              <div className={`md:hidden mobile-expand ${hostelRoutineExpanded ? 'open' : ''}`}>
                <div className="flex flex-col gap-2 mt-4">
                  {([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] as const).map((n, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3 border" style={{ background:'#fffbeb', borderColor:'#fef3c7' }}>
                      <span className="text-sm font-black tabular-nums whitespace-nowrap tracking-tight min-w-[76px]" style={{ color:'#d97706' }}>
                        {t(`about_page.hostel_t${n}_time`)}
                      </span>
                      <div className="w-px h-6 bg-amber-200 flex-shrink-0"></div>
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{t(`about_page.hostel_t${n}_act`)}</p>
                    </div>
                  ))}
                </div>
              </div>
              {!hostelRoutineExpanded && (
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-center md:hidden" style={{ color:'#f59e0b' }}>
                  Tap heading to view full schedule ↑
                </p>
              )}
              <p className="mt-5 text-[11px] text-gray-400 font-medium tracking-wide border-t border-gray-100 pt-4">
                {t('about_page.hostel_routine_note')}
              </p>
            </div>
          </div>
        </section>

 {/* ── PRINCIPAL'S MESSAGE ── */}
        <section className="py-14 bg-[#FDFCF6] relative overflow-hidden">
          <div className="float-a absolute top-0 left-0 w-72 h-72 bg-red-50 rounded-full blur-[100px] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="float-b absolute bottom-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[120px] opacity-50 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={principalRef} className="reveal flex items-center gap-4 mb-10">
              <div className="grow-line h-[2px] bg-red-600"></div>
              <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px]">{t('about_page.principal_label', 'LEADERSHIP')}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60">

              {/* ── LEFT: Photo panel ── */}
              <div
                className="principal-photo-panel principal-left lg:col-span-4 relative bg-[#e3ae58] flex flex-col justify-end min-h-[480px] lg:min-h-[450px]"
                ref={el => { if (el) { const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){el.classList.add('revealed');obs.unobserve(el);} },{threshold:0.1}); obs.observe(el); } }}
              >
                <img
                  src="/Principal.png"
                  alt="Principal"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-100 lg:opacity-90 z-0"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-t from-[#cf7b72]/95 via-[#cf7b72]/70 to-transparent lg:hidden pointer-events-none z-0"
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-t from-red-900/55 via-red-900/20 to-transparent hidden lg:block pointer-events-none z-0"
                ></div>
                <div className="relative z-10 p-6 lg:p-8 w-full mt-auto">
                  <div className="absolute bottom-6 right-4 text-[#ff9b9b] text-[80px] font-serif leading-none select-none pointer-events-none lg:hidden opacity-80" style={{ transform: 'translateY(15px)' }}>
                    "
                  </div>
                  <div className="text-red-400/30 text-[120px] font-serif leading-none absolute top-4 right-6 select-none pointer-events-none hidden lg:block">
                    "
                  </div>
                  <div className="inline-block bg-white/10 backdrop-blur-md border border-white/40 rounded-2xl px-4 py-1.5 mb-2 shadow-sm">
                    <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-md">
                      {t('about_page.principal_desk', "PRINCIPAL'S DESK")}
                    </span>
                  </div>
                  <h3 className="text-[28px] sm:text-3xl lg:text-2xl font-black text-white tracking-tight leading-none mb-1.5 drop-shadow-md">
                    {t('about_page.principal_name', 'Mr. Arunsingh Patil')}
                  </h3>
                  <p className="text-[#fca5a5] text-[10px] font-bold uppercase tracking-widest drop-shadow-sm mb-2 lg:mb-0">
                    {t('about_page.principal_title_role', 'PRINCIPAL · PH.D. IN EDUCATION')}
                  </p>
                  <div className="h-[2px] w-8 lg:w-10 bg-red-400 mt-3 lg:mt-4 hidden lg:block"></div>
                </div>
              </div>

              {/* ── RIGHT: Message panel ── */}
              <div
                className="principal-message-panel principal-right lg:col-span-8 bg-white px-10 py-12 flex flex-col justify-center relative overflow-hidden"
                ref={el => { if (el) { const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){el.classList.add('revealed');obs.unobserve(el);} },{threshold:0.1}); obs.observe(el); } }}
              >
                <span
                  className="message-bg-text-desktop absolute -top-4 right-4 text-8xl font-black uppercase select-none pointer-events-none"
                  style={{ WebkitTextStroke:'1px #fee2e2', color:'transparent' }}
                >
                  MESSAGE
                </span>
                <span
                  className="message-bg-text-mobile text-[3rem] font-black uppercase select-none pointer-events-none tracking-tighter mb-1"
                  style={{ WebkitTextStroke:'1px #fee2e2', color:'transparent', lineHeight: 1 }}
                >
                  MESSAGE
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-8 relative z-10">
                  {t('about_page.principal_section_heading', "A Message from our")} <span className="text-red-600">{t('about_page.principal_section_accent', 'Principal')}</span>
                </h2>
                <Quote className="w-8 h-8 text-red-200 mb-4 flex-shrink-0" />
                <div className="space-y-5 text-gray-600 leading-relaxed text-[15px] tracking-wide font-medium relative z-10">
                  <p><span className="text-gray-900 font-bold">{t('about_page.principal_salutation')}</span></p>
                  <p>{t('about_page.principal_p1')}</p>
                  <p>{t('about_page.principal_p2')}</p>
                </div>
                <div className="mt-10 flex items-center gap-5 pt-6 border-t border-gray-100 relative z-10">
                  <div>
                    <p className="text-2xl font-black text-gray-900 italic tracking-tight" style={{ fontFamily:'Georgia, serif' }}>{t('about_page.principal_signature', 'Mr. Arunsingh Patil')}</p>
                    <p className="text-red-600 text-[11px] font-bold uppercase tracking-widest mt-0.5">{t('about_page.principal_role_footer', 'Principal, Shri V. D. Mane High School')}</p>
                  </div>
                  <div className="ml-auto w-14 h-14 rounded-full border-2 border-red-600 flex items-center justify-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <span className="text-white text-[8px] font-black uppercase tracking-wider text-center leading-tight">
                        {t('about_page.principal_seal', 'SEAL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FACULTY ── */}
        <section className="py-14 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={facultyHdRef} className="reveal relative mb-12 text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-60 -z-10"></div>
              <div className="inline-block px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-lg shadow-red-200">
                {t('about_page.faculty_label', 'OUR EDUCATORS')}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
                {t('about_page.faculty_title', 'Meet Our')} <span className="text-red-600">{t('about_page.faculty_title_accent', 'Faculty')}</span>
              </h2>
              <div className="flex justify-center items-center gap-4">
                <div className="h-[1px] w-12 bg-gray-200"></div>
                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">{t('about_page.faculty_subtitle', 'Dedicated to Excellence')}</p>
                <div className="h-[1px] w-12 bg-gray-200"></div>
              </div>
            </div>

            <div
              ref={facultyGrdRef}
              className="stagger-grid max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6"
            >
              {faculty.slice(0, 3).map((teacher, idx) => (
                <div key={idx} className="md:col-span-2">
                  <FacultyCard teacher={teacher} />
                </div>
              ))}
              {faculty.slice(3, 5).map((teacher, idx) => (
                <div
                  key={idx + 3}
                  className={`md:col-span-2 ${idx === 0 ? 'md:col-start-2' : ''}`}
                >
                  <FacultyCard teacher={teacher} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default About;