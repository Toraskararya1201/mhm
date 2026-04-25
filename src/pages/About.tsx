import React, { useEffect, useRef } from 'react';
import { BookOpen, Users, Target, Eye, FlaskConical, Monitor, Dumbbell, Quote } from 'lucide-react';
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

const FacultyCard = ({ teacher }) => (
  <div className="group relative border border-gray-200 rounded-lg p-5 text-center bg-white transition duration-300 hover:shadow-md hover:border-red-300 h-[220px] w-full flex flex-col justify-between">
    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-500 rounded-tl-lg"></div>
    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-500 rounded-br-lg"></div>
    <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700 group-hover:bg-red-50 group-hover:text-red-600 transition">
      {teacher.name.charAt(0)}
    </div>
    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition">{teacher.name}</h3>
    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{teacher.subject}</p>
    <p className="text-xs text-gray-600 leading-tight">{teacher.qualification}</p>
  </div>
);

const About = () => {
  const { t } = useTranslation();

  const facilities = [
    { icon: BookOpen,     title: t('about_page.facility1_title'), description: t('about_page.facility1_desc') },
    { icon: Monitor,      title: t('about_page.facility2_title'), description: t('about_page.facility2_desc') },
    { icon: Target,       title: t('about_page.facility3_title'), description: t('about_page.facility3_desc') },
    { icon: FlaskConical, title: t('about_page.facility4_title'), description: t('about_page.facility4_desc') },
    { icon: Eye,          title: t('about_page.facility5_title'), description: t('about_page.facility5_desc') },
    { icon: Dumbbell,     title: t('about_page.facility6_title'), description: t('about_page.facility6_desc') },
    { icon: Users,        title: t('about_page.facility7_title'), description: t('about_page.facility7_desc') },
    { icon: BookOpen,     title: t('about_page.facility8_title'), description: t('about_page.facility8_desc') },
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

  return (
    <>
      <style>{`
        .reveal          { opacity:0; transform:translateY(36px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal.revealed { opacity:1; transform:none; }
        .reveal-left          { opacity:0; transform:translateX(-52px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-left.revealed { opacity:1; transform:none; }
        .reveal-right          { opacity:0; transform:translateX(52px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-right.revealed { opacity:1; transform:none; }
        .reveal-scale          { opacity:0; transform:scale(.92); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-scale.revealed { opacity:1; transform:scale(1); }

        .stagger-grid > * {
          opacity:0; transform:translateY(28px);
          transition:opacity .55s cubic-bezier(.4,0,.2,1), transform .55s cubic-bezier(.4,0,.2,1);
        }
        .stagger-grid.revealed > *:nth-child(1)  { opacity:1;transform:none;transition-delay:.04s }
        .stagger-grid.revealed > *:nth-child(2)  { opacity:1;transform:none;transition-delay:.10s }
        .stagger-grid.revealed > *:nth-child(3)  { opacity:1;transform:none;transition-delay:.16s }
        .stagger-grid.revealed > *:nth-child(4)  { opacity:1;transform:none;transition-delay:.22s }
        .stagger-grid.revealed > *:nth-child(5)  { opacity:1;transform:none;transition-delay:.28s }
        .stagger-grid.revealed > *:nth-child(6)  { opacity:1;transform:none;transition-delay:.34s }
        .stagger-grid.revealed > *:nth-child(7)  { opacity:1;transform:none;transition-delay:.40s }
        .stagger-grid.revealed > *:nth-child(8)  { opacity:1;transform:none;transition-delay:.46s }

        @keyframes heroFade  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes heroSub   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes heroBadge { from{opacity:0;transform:scale(.7)}        to{opacity:1;transform:scale(1)} }
        .hero-badge { animation:heroBadge .6s cubic-bezier(.4,0,.2,1) .1s both }
        .hero-h1    { animation:heroFade  .8s cubic-bezier(.4,0,.2,1) .3s both }
        .hero-sub   { animation:heroSub   .8s cubic-bezier(.4,0,.2,1) .55s both }

        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        .float-a { animation:floatA 6s ease-in-out infinite; }
        .float-b { animation:floatB 8s ease-in-out infinite; }

        @keyframes growLine { from{width:0} to{width:3rem} }
        .grow-line { animation:growLine .6s cubic-bezier(.4,0,.2,1) .5s both; }

        .card-lift { transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .card-lift:hover { transform:translateY(-5px) scale(1.01); }

        .principal-left          { opacity:0; transform:translateX(-60px); transition:opacity .8s cubic-bezier(.4,0,.2,1) .1s, transform .8s cubic-bezier(.4,0,.2,1) .1s; }
        .principal-left.revealed { opacity:1; transform:none; }
        .principal-right          { opacity:0; transform:translateX(60px); transition:opacity .8s cubic-bezier(.4,0,.2,1) .25s, transform .8s cubic-bezier(.4,0,.2,1) .25s; }
        .principal-right.revealed { opacity:1; transform:none; }

        @keyframes numPop { 0%{opacity:0;transform:scale(.5) translateY(10px)} 80%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        .num-pop { animation:numPop .7s cubic-bezier(.4,0,.2,1) .6s both; }

        .message-bg-text-desktop { display: block; }
        .message-bg-text-mobile  { display: none;  }

        @media (max-width: 1023px) {
          .message-bg-text-desktop { display: none !important; }
          .message-bg-text-mobile  { display: block !important; }
          .principal-message-panel { padding: 1.75rem 1.25rem !important; }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <div className="relative bg-[#FDFCF6]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}>
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="float-a absolute top-0 right-[-10%] w-[40%] h-[500px] bg-red-100/30 rounded-full blur-[120px]"></div>
            <div className="float-b absolute bottom-0 left-[-5%] w-[30%] h-[400px] bg-gray-200/40 rounded-full blur-[100px]"></div>
          </div>

          {/* ── HEADER ── */}
          <section className="relative pt-8 pb-8 z-10 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={heroRef} className="text-center">
                <span className="hero-badge inline-block text-red-700 font-black uppercase tracking-[0.5em] text-[10px] mb-4 opacity-80">
                  {t('about_page.est_badge', 'EST. 1989')}
                </span>
                <h1 className="hero-h1 text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
                  {t('about_page.title', 'About Our')} <span className="text-red-600">{t('about_page.title_accent', 'School')}</span>
                </h1>
                <p className="hero-sub text-lg md:text-xl text-gray-600/80 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
                  {t('about_page.subtitle', 'A legacy of excellence spanning over')}{' '}
                  <span className="text-gray-900 font-bold underline decoration-red-200 decoration-4">{t('about_page.subtitle_years', '35 years')}</span>.
                </p>
              </div>
            </div>
          </section>

          {/* ── OUR STORY ── */}
          <section className="pb-14 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div ref={storyImgRef} className="reveal-left lg:col-span-5 relative group">
                  <div className="absolute -inset-4 border border-red-600/10 rounded-[2rem] scale-95 group-hover:scale-100 transition-transform duration-700"></div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src="/mainschool.jpeg"
                      alt="School Campus"
                      className="w-full h-[480px] object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    />
                  </div>
                  <div className="num-pop absolute -bottom-6 -left-6 bg-red-600 text-white px-8 py-6 rounded-2xl shadow-xl hidden md:block border-4 border-[#FDFCF6]">
                    <p className="text-4xl font-black leading-none tracking-tighter">32+</p>
                    <p className="text-[11px] uppercase tracking-widest font-bold mt-1">{t('about_page.years_of_legacy', 'Years of Legacy')}</p>
                  </div>
                </div>
                <div ref={storyTxtRef} className="reveal-right lg:col-span-7 lg:pl-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="grow-line h-[2px] bg-red-600"></div>
                    <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">{t('about_page.institution_label', 'OUR INSTITUTION')}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
                    {t('about_page.story_heading', 'Building the future,')} <br/>
                    <span className="bg-red-600 text-white px-4 py-1 inline-block mt-2">{t('about_page.story_heading_accent', 'one student at a time.')}</span>
                  </h2>
                  <div className="space-y-6 text-gray-700/90 leading-relaxed text-lg tracking-wide font-medium">
                    <p>{t('about_page.story_p1')}</p>
                    <p>{t('about_page.story_p2')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── VISION & MISSION ── */}
        <section className="py-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={visionRef} className="stagger-grid flex flex-col lg:flex-row gap-6 justify-center">
              <div className="card-lift flex-1 max-w-[550px] group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                <div className="flex items-center p-6 gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                    <Eye className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">{t('about_page.vision_label', 'Our Vision')}</h3>
                    <p className="text-gray-500 text-[12px] leading-relaxed tracking-wide">{t('about_page.vision_text')}</p>
                  </div>
                </div>
              </div>
              <div className="card-lift flex-1 max-w-[550px] group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                <div className="flex items-center p-6 gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                    <Target className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">{t('about_page.mission_label', 'Our Mission')}</h3>
                    <p className="text-gray-500 text-[12px] leading-relaxed tracking-wide">{t('about_page.mission_text')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FACILITIES ── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={facilitiesRef} className="reveal relative mb-10">
              <span className="absolute -top-12 left-0 text-7xl md:text-9xl font-black text-gray-50 uppercase tracking-tighter select-none -z-0">
                Campus
              </span>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grow-line h-1.5 bg-red-600 rounded-full"></div>
                    <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px]">{t('about_page.facilities_resources_label', 'FACILITIES & RESOURCES')}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {t('about_page.facilities_title', 'World-Class')} <span className="text-red-600">{t('about_page.facilities_title_accent', 'Infrastructure')}</span>
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-xs md:text-right font-medium tracking-wide leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-red-100 pl-4 md:pl-0 md:pr-4">
                  {t('about_page.facilities_subtitle')}
                </p>
              </div>
            </div>
            <div ref={facilGridRef} className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((item, idx) => (
                <div key={idx} className="card-lift group flex items-center bg-white p-5 rounded-xl border border-gray-100 hover:border-red-600 shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 flex-shrink-0 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-1">{item.description}</p>
                  </div>
                </div>
              ))}
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

            {/* Faculty cards — 1 col mobile | 3-col grid on desktop, last 2 centered via col-start */}
            <div
              ref={facultyGrdRef}
              className="stagger-grid max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6"
            >
              {/* Row 1: 3 cards — each spans 2 of 6 cols */}
              {faculty.slice(0, 3).map((teacher, idx) => (
                <div key={idx} className="md:col-span-2">
                  <FacultyCard teacher={teacher} />
                </div>
              ))}
              {/* Row 2: 2 cards centered — start at col 2, each spans 2 of 6 cols */}
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