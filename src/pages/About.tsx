import React, { useEffect, useRef } from 'react';
import { BookOpen, Users, Target, Eye, Library, FlaskConical, Monitor, Dumbbell, Quote } from 'lucide-react';

/* ─── scroll-reveal hook (same as Home) ─── */
function useReveal(options = {}) {
  const ref = useRef(null);
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

const About = () => {
  const facilities = [
    { icon: BookOpen,     title: 'Smart Classrooms', description: 'Interactive digital boards for enhanced learning.' },
    { icon: Library,      title: 'Digital Library',  description: 'Extensive collection of global journals and resources.' },
    { icon: FlaskConical, title: 'Science Labs',      description: 'Well-equipped Physics, Chemistry, and Biology labs.' },
    { icon: Dumbbell,     title: 'Sports Complex',    description: 'Multi-sport facility including athletics track.' },
    { icon: Monitor,      title: 'Computer Lab',      description: 'High-speed internet and latest software.' },
    { icon: Users,        title: 'Auditorium',        description: 'Modern space for performances and gatherings.' },
  ];

  const faculty = [
    { name: 'Dr. Sarah Mitchell',   subject: 'Principal',     qualification: 'Ph.D. in Education' },
    { name: 'Prof. James Anderson', subject: 'Mathematics',   qualification: 'M.Sc. Mathematics' },
    { name: 'Dr. Emily Roberts',    subject: 'Science',       qualification: 'Ph.D. in Physics' },
    { name: 'Mr. David Chen',       subject: 'English',       qualification: 'M.A. English Literature' },
    { name: 'Ms. Priya Sharma',     subject: 'Social Studies',qualification: 'M.A. History' },
    { name: 'Mr. Robert Wilson',    subject: 'P.E. Trainer',  qualification: 'M.P.Ed.' },
  ];

  /* individual reveal refs */
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
      {/* ─── Global animation styles ─── */}
      <style>{`
        /* base reveal — fade + slide up */
        .reveal          { opacity:0; transform:translateY(36px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal.revealed { opacity:1; transform:none; }

        /* slide from left */
        .reveal-left          { opacity:0; transform:translateX(-52px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-left.revealed { opacity:1; transform:none; }

        /* slide from right */
        .reveal-right          { opacity:0; transform:translateX(52px); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-right.revealed { opacity:1; transform:none; }

        /* scale-up reveal */
        .reveal-scale          { opacity:0; transform:scale(.92); transition:opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-scale.revealed { opacity:1; transform:scale(1); }

        /* stagger grid children */
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

        /* hero entrance */
        @keyframes heroFade  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes heroSub   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes heroBadge { from{opacity:0;transform:scale(.7)}        to{opacity:1;transform:scale(1)} }
        .hero-badge { animation:heroBadge .6s cubic-bezier(.4,0,.2,1) .1s both }
        .hero-h1    { animation:heroFade  .8s cubic-bezier(.4,0,.2,1) .3s both }
        .hero-sub   { animation:heroSub  .8s cubic-bezier(.4,0,.2,1) .55s both }

        /* floating orbs */
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        .float-a { animation:floatA 6s ease-in-out infinite; }
        .float-b { animation:floatB 8s ease-in-out infinite; }

        /* red underline grow */
        @keyframes growLine { from{width:0} to{width:3rem} }
        .grow-line { animation:growLine .6s cubic-bezier(.4,0,.2,1) .5s both; }

        /* card lift on hover */
        .card-lift { transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .card-lift:hover { transform:translateY(-5px) scale(1.01); }

        /* principal card slide-in split */
        .principal-left          { opacity:0; transform:translateX(-60px); transition:opacity .8s cubic-bezier(.4,0,.2,1) .1s, transform .8s cubic-bezier(.4,0,.2,1) .1s; }
        .principal-left.revealed { opacity:1; transform:none; }
        .principal-right          { opacity:0; transform:translateX(60px); transition:opacity .8s cubic-bezier(.4,0,.2,1) .25s, transform .8s cubic-bezier(.4,0,.2,1) .25s; }
        .principal-right.revealed { opacity:1; transform:none; }

        /* counter number pop */
        @keyframes numPop { 0%{opacity:0;transform:scale(.5) translateY(10px)} 80%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        .num-pop { animation:numPop .7s cubic-bezier(.4,0,.2,1) .6s both; }
      `}</style>

      <div className="min-h-screen bg-white">

        {/* ── WARM CANVAS TOP ── */}
        <div className="relative bg-[#FDFCF6]">

          {/* noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}>
          </div>

          {/* gradient light leaks */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="float-a absolute top-0 right-[-10%] w-[40%] h-[500px] bg-red-100/30 rounded-full blur-[120px]"></div>
            <div className="float-b absolute bottom-0 left-[-5%] w-[30%] h-[400px] bg-gray-200/40 rounded-full blur-[100px]"></div>
          </div>

          {/* ── HEADER ── */}
          <section className="relative pt-12 pb-12 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={heroRef} className="text-center">
                <span className="hero-badge inline-block text-red-700 font-black uppercase tracking-[0.5em] text-[10px] mb-4 opacity-80">
                  Est. 1985
                </span>
                <h1 className="hero-h1 text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
                  About <span className="text-red-600">Manpadle Highschool</span>
                </h1>
                <p className="hero-sub text-lg md:text-xl text-gray-600/80 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
                  Building excellence through quality education and holistic development for over{' '}
                  <span className="text-gray-900 font-bold underline decoration-red-200 decoration-4">35 years</span>.
                </p>
              </div>
            </div>
          </section>

          {/* ── OUR STORY ── */}
          <section className="pb-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                {/* image — slides in from left */}
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
                    <p className="text-4xl font-black leading-none tracking-tighter">35+</p>
                    <p className="text-[11px] uppercase tracking-widest font-bold mt-1">Years of Legacy</p>
                  </div>
                </div>

                {/* text — slides in from right */}
                <div ref={storyTxtRef} className="reveal-right lg:col-span-7 lg:pl-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="grow-line h-[2px] bg-red-600"></div>
                    <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[11px]">The Institution</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
                    A Tradition of <br/>
                    <span className="bg-red-600 text-white px-4 py-1 inline-block mt-2">Innovation.</span>
                  </h2>
                  <div className="space-y-6 text-gray-700/90 leading-relaxed text-lg tracking-wide font-medium">
                    <p>Founded in 1985, <span className="text-gray-900 font-bold">Greenfield High School</span> began as a small institution with a big vision: to provide quality education that nurtures both mind and character.</p>
                    <p>Our journey has been marked by continuous innovation in teaching methodologies and infrastructure development.</p>
                    <p>Today, we stand proud as an institution that consistently produces outstanding results while maintaining a warm, inclusive environment.</p>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>

        {/* ── VISION & MISSION ── */}
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={visionRef} className="stagger-grid flex flex-col lg:flex-row gap-6 justify-center">

              <div className="card-lift flex-1 max-w-[550px] group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                <div className="flex items-center p-6 gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                    <Eye className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">Our Vision</h3>
                    <p className="text-gray-500 text-[12px] leading-relaxed tracking-wide">To be a leading center of excellence, nurturing future leaders through holistic education and innovation for a better tomorrow.</p>
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
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">Our Mission</h3>
                    <p className="text-gray-500 text-[12px] leading-relaxed tracking-wide">Providing quality education that balances academic rigor with character building, ensuring every student achieves their full potential.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FACILITIES ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div ref={facilitiesRef} className="reveal relative mb-20">
              <span className="absolute -top-12 left-0 text-7xl md:text-9xl font-black text-gray-50 uppercase tracking-tighter select-none -z-0">
                Campus
              </span>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grow-line h-1.5 bg-red-600 rounded-full"></div>
                    <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px]">Resources</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    World-Class <span className="text-red-600">Facilities.</span>
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-xs md:text-right font-medium tracking-wide leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-red-100 pl-4 md:pl-0 md:pr-4">
                  Advanced infrastructure designed to inspire curiosity and facilitate holistic development.
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
        <section className="py-24 bg-[#FDFCF6] relative overflow-hidden">
          <div className="float-a absolute top-0 left-0 w-72 h-72 bg-red-50 rounded-full blur-[100px] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="float-b absolute bottom-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[120px] opacity-50 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div ref={principalRef} className="reveal flex items-center gap-4 mb-16">
              <div className="grow-line h-[2px] bg-red-600"></div>
              <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px]">Leadership</span>
            </div>

            {/* split card — each half animates separately via sibling reveal classes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60">

              {/* LEFT photo panel */}
              <div className="principal-left revealed lg:col-span-4 relative bg-gray-900 flex flex-col justify-end min-h-[380px]"
                   ref={el => { if (el) { const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){el.classList.add('revealed');obs.unobserve(el);} },{threshold:0.1}); obs.observe(el); } }}>
                <img
                  src="/Principal.png"
                  alt="Principal"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/95 via-red-900/40 to-transparent"></div>
                <div className="relative z-10 p-8">
                  <div className="text-red-400/30 text-[120px] font-serif leading-none absolute top-4 right-6 select-none pointer-events-none">"</div>
                  <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 mb-4">
                    <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.4em]">Principal's Desk</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Dr. Sarah Mitchell</h3>
                  <p className="text-red-300 text-[11px] font-bold uppercase tracking-widest mt-1">Principal · Ph.D. in Education</p>
                  <div className="h-[2px] w-10 bg-red-400 mt-4"></div>
                </div>
              </div>

              {/* RIGHT message panel */}
              <div className="principal-right revealed lg:col-span-8 bg-white px-10 py-12 flex flex-col justify-center relative"
                   ref={el => { if (el) { const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){el.classList.add('revealed');obs.unobserve(el);} },{threshold:0.1}); obs.observe(el); } }}>
                <span className="absolute -top-4 right-4 text-8xl font-black uppercase select-none pointer-events-none"
                      style={{ WebkitTextStroke:'1px #fee2e2', color:'transparent' }}>
                  Message
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-8 relative z-10">
                  A Word From Our <span className="text-red-600">Principal</span>
                </h2>
                <Quote className="w-8 h-8 text-red-200 mb-4 flex-shrink-0" />
                <div className="space-y-5 text-gray-600 leading-relaxed text-[15px] tracking-wide font-medium relative z-10">
                  <p><span className="text-gray-900 font-bold">Dear Students, Parents and Well-Wishers,</span></p>
                  <p>At Greenfield, we believe education is far more than marks and milestones. It is about shaping curious minds, compassionate hearts and resilient characters — equipping every student to face a rapidly changing world with confidence and purpose.</p>
                  <p>Our dedicated faculty, world-class facilities and vibrant community come together each day with one shared goal: to help every child discover their fullest potential. We nurture not just achievers, but thoughtful human beings who lead with integrity and serve with humility.</p>
                  <p>Every milestone we celebrate here reaffirms our belief that the most powerful investment we can make is in the education of our children.</p>
                </div>
                <div className="mt-10 flex items-center gap-5 pt-6 border-t border-gray-100 relative z-10">
                  <div>
                    <p className="text-2xl font-black text-gray-900 italic tracking-tight" style={{ fontFamily:'Georgia, serif' }}>Mr. Arunsingh Patil</p>
                    <p className="text-red-600 text-[11px] font-bold uppercase tracking-widest mt-0.5">Principal, Manpadle High School</p>
                  </div>
                  <div className="ml-auto w-14 h-14 rounded-full border-2 border-red-600 flex items-center justify-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <span className="text-white text-[8px] font-black uppercase tracking-wider text-center leading-tight">GHS<br/>1985</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FACULTY ── */}
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div ref={facultyHdRef} className="reveal relative mb-24 text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-60 -z-10"></div>
              <div className="inline-block px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-lg shadow-red-200">
                Expert Mentors
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
                Our Professional <span className="text-red-600">Faculty</span>
              </h2>
              <div className="flex justify-center items-center gap-4">
                <div className="h-[1px] w-12 bg-gray-200"></div>
                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Guiding the next generation</p>
                <div className="h-[1px] w-12 bg-gray-200"></div>
              </div>
            </div>

            <div ref={facultyGrdRef} className="stagger-grid flex flex-wrap justify-center gap-8">
              {faculty.map((teacher, idx) => (
                <div key={idx} className="card-lift group relative bg-white border border-gray-100 rounded-xl p-6 transition-all duration-300 hover:border-red-600 shadow-sm hover:shadow-xl w-[240px] text-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-8 h-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600 rounded-tr-full"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600 rounded-br-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">{teacher.name}</h3>
                  <p className="text-red-600 text-[11px] font-bold uppercase tracking-widest mt-1 mb-3">{teacher.subject}</p>
                  <div className="h-px w-8 bg-gray-200 mx-auto transition-all duration-300 group-hover:w-16 group-hover:bg-red-200"></div>
                  <p className="text-gray-500 text-[11px] mt-3 italic">{teacher.qualification}</p>
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