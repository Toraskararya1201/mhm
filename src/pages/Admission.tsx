import { useState, FormEvent, useEffect, useRef } from 'react';
import { Calendar, FileText, CheckCircle, User, Mail, Phone, MessageSquare, BookOpen, Award } from 'lucide-react';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSc9ou8hM-Yp3kdbapaR2Ie5QOV6Bjp4DL73YcEb5BMAcAE4Ug/formResponse';

const ENTRY = {
  student_name: 'entry.2005620554',
  email:        'entry.1045781291',
  phone:        'entry.1166974658',
  message:      'entry.839337160',
};

/* ─── scroll-reveal hook ─── */
function useReveal(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); }
      },
      { threshold: 0.1, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Auto-reset countdown ─── */
function AutoReset({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(10);
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;
  useEffect(() => {
    if (seconds <= 0) { onResetRef.current(); return; }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  return (
    <p className="text-gray-400 text-xs mt-6">
      {t('admission_page.reset_text')}{' '}
      <span className="font-bold" style={{ color: '#e05a8a' }}>{seconds}</span>{t('admission_page.reset_seconds_unit')} —{' '}
      <button onClick={() => onResetRef.current()} className="underline font-medium" style={{ color: '#c94070' }}>
        {t('admission_page.reset_now')}
      </button>
    </p>
  );
}

const Admission = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ student_name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const overviewRef     = useReveal();
  const docsRef         = useReveal();
  const datesRef        = useReveal();
  const processTitleRef = useReveal();
  const processGridRef  = useReveal();
  const formRef         = useReveal();

  const handleReset = () => {
    setFormData({ student_name: '', email: '', phone: '', message: '' });
    setErrors({});
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.student_name.trim() || formData.student_name.trim().length < 2)
      newErrors.student_name = t('admission_page.err_name_short');
    else if (/[0-9]/.test(formData.student_name))
      newErrors.student_name = t('admission_page.err_name_numbers');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('admission_page.err_email');
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = t('admission_page.err_phone');
    if (!formData.message.trim() || formData.message.trim().length < 10)
      newErrors.message = t('admission_page.err_message');
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setIsSubmitting(true);

    try {
      const body = new URLSearchParams({
        [ENTRY.student_name]: formData.student_name,
        [ENTRY.email]:        formData.email,
        [ENTRY.phone]:        formData.phone,
        [ENTRY.message]:      formData.message,
      });

      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      setResetKey(k => k + 1);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Step colors: rose / amber / teal ─── */
  const steps = [
    {
      icon: BookOpen,
      title: t('admission_page.step1_title'),
      description: t('admission_page.step1_desc'),
      accent: '#e05a8a',
      accentBg: '#fdf2f6',
      accentSoft: '#fce7f0',
      num: '#fce7f0',
      numText: '#e05a8a',
    },
    {
      icon: CheckCircle,
      title: t('admission_page.step2_title'),
      description: t('admission_page.step2_desc'),
      accent: '#f59e0b',
      accentBg: '#fffbeb',
      accentSoft: '#fef3c7',
      num: '#fef3c7',
      numText: '#d97706',
    },
    {
      icon: Award,
      title: t('admission_page.step3_title'),
      description: t('admission_page.step3_desc'),
      accent: '#0d9488',
      accentBg: '#f0fdfa',
      accentSoft: '#ccfbf1',
      num: '#ccfbf1',
      numText: '#0d9488',
    },
  ];

  const requirements = [
    t('admission_page.doc1'), t('admission_page.doc2'), t('admission_page.doc3'),
    t('admission_page.doc4'), t('admission_page.doc5'),
  ];

  const importantDates = [
    { event: t('admission_page.date1_event'), date: t('admission_page.date1_date') },
    { event: t('admission_page.date2_event'), date: t('admission_page.date2_date') },
    { event: t('admission_page.date3_event'), date: t('admission_page.date3_date') },
  ];

  /* teal accents for dates */
  const dateColors = ['#0d9488', '#0891b2', '#0891b2'];

  return (
    <>
      <style>{`
        /* ── Reveal system ── */
        .reveal           { opacity:0; transform:translateY(36px); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal.revealed  { opacity:1; transform:none }
        .reveal-left           { opacity:0; transform:translateX(-52px); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal-left.revealed  { opacity:1; transform:none }
        .reveal-right           { opacity:0; transform:translateX(52px); transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1) }
        .reveal-right.revealed  { opacity:1; transform:none }
        .stagger-grid > * { opacity:0; transform:translateY(28px); transition:opacity .55s cubic-bezier(.4,0,.2,1),transform .55s cubic-bezier(.4,0,.2,1) }
        .stagger-grid.revealed > *:nth-child(1) { opacity:1;transform:none;transition-delay:.04s }
        .stagger-grid.revealed > *:nth-child(2) { opacity:1;transform:none;transition-delay:.13s }
        .stagger-grid.revealed > *:nth-child(3) { opacity:1;transform:none;transition-delay:.22s }
        .stagger-grid.revealed > *:nth-child(4) { opacity:1;transform:none;transition-delay:.31s }
        .stagger-grid.revealed > *:nth-child(5) { opacity:1;transform:none;transition-delay:.40s }

        /* ── Hero animations ── */
        @keyframes heroFade  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes heroSub   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes heroBadge { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
        .hero-badge { animation:heroBadge .6s cubic-bezier(.4,0,.2,1) .1s both }
        .hero-h1    { animation:heroFade  .8s cubic-bezier(.4,0,.2,1) .3s both }
        .hero-sub   { animation:heroSub   .8s cubic-bezier(.4,0,.2,1) .55s both }

        /* ── Float blobs ── */
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)}  }
        .float-a { animation:floatA 6s ease-in-out infinite }
        .float-b { animation:floatB 8s ease-in-out infinite }

        /* ── Grow line ── */
        @keyframes growLine { from{width:0} to{width:3rem} }
        .grow-line { animation:growLine .6s cubic-bezier(.4,0,.2,1) .5s both }

        /* ── Card lift ── */
        .card-lift { transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease }
        .card-lift:hover { transform:translateY(-5px) scale(1.01) }

        /* ── Process cards ── */
        .process-card { position:relative; overflow:hidden; transition:transform .35s ease,box-shadow .35s ease,background-color .35s ease }
        .process-card:hover { transform:translateY(-8px) }
        .process-card .card-bottom-bar { position:absolute; bottom:0; left:0; width:0%; height:4px; border-radius:0 0 .75rem .75rem; transition:width .4s }
        .process-card:hover .card-bottom-bar { width:100% }
        .process-card .card-icon-wrap { transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .3s }
        .process-card:hover .card-icon-wrap { transform:scale(1.18) rotate(-6deg) }

        /* ── List stagger ── */
        .list-item { opacity:0; transform:translateX(-16px); transition:opacity .4s ease,transform .4s ease }
        .revealed .list-item { opacity:1; transform:none }
        .revealed .list-item:nth-child(1){transition-delay:.05s}
        .revealed .list-item:nth-child(2){transition-delay:.13s}
        .revealed .list-item:nth-child(3){transition-delay:.21s}
        .revealed .list-item:nth-child(4){transition-delay:.29s}
        .revealed .list-item:nth-child(5){transition-delay:.37s}

        /* ── Date stagger ── */
        .date-item { opacity:0; transform:translateX(16px); transition:opacity .4s ease,transform .4s ease }
        .revealed .date-item { opacity:1; transform:none }
        .revealed .date-item:nth-child(1){transition-delay:.08s}
        .revealed .date-item:nth-child(2){transition-delay:.18s}
        .revealed .date-item:nth-child(3){transition-delay:.28s}

        /* ── Success icon ── */
        @keyframes popIn { 0%{opacity:0;transform:scale(.5)} 70%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }
        .success-icon { animation:popIn .5s cubic-bezier(.175,.885,.32,1.275) both }

        /* ── Input focus ── */
        .adm-input { transition:border-color .2s,box-shadow .2s }
        .adm-input:focus { border-color:#e05a8a; box-shadow:0 0 0 3px rgba(224,90,138,.12); outline:none }

        /* ── Hero bottom clip ── */
        .hero-clip { clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%) }
      `}</style>

      <div className="min-h-screen bg-slate-50">

        {/* ════════════ 1. HERO ════════════ */}
        {/* Warm rose-to-amber gradient — soft and cheerful */}
        <section
          className="hero-clip relative pt-32 pb-24 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #fff7ed 50%, #fffbeb 100%)' }}
        >
          <div className="float-a absolute top-0 right-[-8%] w-[35%] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(224,90,138,0.18)' }}></div>
          <div className="float-b absolute bottom-0 left-[-5%] w-[28%] h-[300px] rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(251,191,36,0.18)' }}></div>
          {/* Violet blob top-left */}
          <div className="float-a absolute top-10 left-[10%] w-[18%] h-[200px] rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(139,92,246,0.12)' }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="hero-badge inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border px-5 py-2 rounded-full shadow-sm mb-5" style={{ borderColor: '#fce7f0' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: '#e05a8a' }}></span>
              <span className="font-bold uppercase tracking-[0.18em] text-xs" style={{ color: '#c94070' }}>
                {t('admission_page.hero_badge', 'Admissions Open • 2025–26')}
              </span>
            </div>
            <h1 className="hero-h1 text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tighter leading-tight">
              {t('admission_page.hero_title', 'Begin Your')}{' '}
              <span style={{ color: '#e05a8a' }}>{t('admission_page.hero_title_accent', 'Journey Here.')}</span>
            </h1>
            <p className="hero-sub text-base md:text-lg text-gray-500 max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
              {t('admission_page.hero_subtitle')}{' '}
              <span className="text-gray-900 font-bold underline decoration-4" style={{ textDecorationColor: '#fde68a' }}>
                {t('admission_page.hero_subtitle_accent', 'excellence & character')}
              </span>.
            </p>
          </div>
        </section>

        {/* ════════════ 2. OVERVIEW ════════════ */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              <div ref={overviewRef as any} className="reveal-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="grow-line h-[2px]" style={{ background: '#e05a8a' }}></div>
                  <span className="font-bold uppercase tracking-[0.4em] text-[11px]" style={{ color: '#e05a8a' }}>
                    {t('admission_page.overview_label', 'ADMISSIONS')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
                  {t('admission_page.overview_title')}<br />
                  {/* Amber accent block */}
                  <span className="px-4 py-1 inline-block mt-2 text-white" style={{ background: '#f59e0b' }}>
                    {t('admission_page.overview_title_accent', 'Overview')}
                  </span>
                </h2>
                <div className="space-y-5 text-gray-600 leading-relaxed text-[17px] font-medium tracking-wide">
                  <p>{t('admission_page.overview_p1')}</p>
                  <p>{t('admission_page.overview_p2')}</p>
                </div>
              </div>

              <div
                className="reveal-right relative"
                ref={el => {
                  if (el) {
                    const o = new IntersectionObserver(
                      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); o.unobserve(el); } },
                      { threshold: 0.1 }
                    );
                    o.observe(el);
                  }
                }}
              >
                {/* Teal dot pattern */}
                <div
                  className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #5eead4 1.5px, transparent 1.5px)',
                    backgroundSize: '12px 12px',
                    zIndex: 0,
                    opacity: 0.6,
                  }}
                />
                {/* Violet offset border */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: 0,
                    transform: 'translate(-10px, -10px)',
                    border: '2px solid #c4b5fd',
                    borderRadius: '1rem',
                    zIndex: 0,
                  }}
                />
                <div
                  className="relative z-10 rounded-2xl p-3 bg-white"
                  style={{
                    boxShadow: '0 25px 60px -10px rgba(224,90,138,0.12), 0 10px 25px -5px rgba(0,0,0,0.07)',
                    border: '1px solid #fce7f0',
                  }}
                >
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src="/act3.jpeg"
                      alt="Students at Manpadale"
                      className="w-full h-[400px] object-cover block"
                    />
                  </div>
                </div>
                {/* Rose badge */}
                <div
                  className="absolute -bottom-4 left-6 z-20 bg-white rounded-xl px-4 py-2 flex items-center gap-2"
                  style={{
                    border: '1px solid #fce7f0',
                    boxShadow: '0 4px 16px rgba(224,90,138,0.10)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#e05a8a' }} />
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest">
                    {t('admission_page.overview_label', 'Admissions')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ 3. DOCS + DATES ════════════ */}
        {/* Light warm cream background */}
        <section className="py-10" style={{ background: '#fafaf7' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="reveal relative mb-10"
                 ref={el => { if(el){const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('revealed');o.unobserve(el);}},{threshold:.1});o.observe(el);} }}>
              <span className="absolute -top-10 left-0 text-7xl md:text-9xl font-black text-gray-100 uppercase tracking-tighter select-none -z-0 pointer-events-none">
                {t('admission_page.details_watermark', 'Details')}
              </span>
              <div className="relative z-10 flex items-center gap-3">
                <div className="grow-line h-1.5 rounded-full" style={{ background: '#0d9488' }}></div>
                <span className="font-bold uppercase tracking-[0.4em] text-[20px]" style={{ color: '#0d9488' }}>
                  {t('admission_page.details_label', 'WHAT YOU NEED')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Documents card — amber accent */}
              <div ref={docsRef as any} className="card-lift reveal-left group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: '#f59e0b' }}></div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500"
                      style={{ background: '#fffbeb', color: '#d97706' }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#f59e0b'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#fffbeb'; (e.currentTarget as HTMLElement).style.color = '#d97706'; }}
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest transition-colors group-hover:text-amber-500">
                      {t('admission_page.docs_title')}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {requirements.map((req, i) => (
                      <li key={i} className="list-item flex items-start text-gray-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dates card — teal accent */}
              <div ref={datesRef as any} className="card-lift reveal-right group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: '#0d9488' }}></div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500"
                      style={{ background: '#f0fdfa', color: '#0d9488' }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#0d9488'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdfa'; (e.currentTarget as HTMLElement).style.color = '#0d9488'; }}
                    >
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest transition-colors group-hover:text-teal-600">
                      {t('admission_page.dates_title')}
                    </h3>
                  </div>
                  <ul className="space-y-5">
                    {importantDates.map((item, i) => (
                      <li
                        key={i}
                        className="date-item pl-4 transition-transform hover:translate-x-1"
                        style={{ borderLeft: `4px solid ${dateColors[i]}` }}
                      >
                        <p className="font-black text-gray-900 text-sm tracking-tight">{item.event}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{item.date}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ 4. APPLICATION PROCESS ════════════ */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div ref={processTitleRef as any} className="reveal relative mb-12">
              <span className="absolute -top-10 left-0 text-7xl md:text-9xl font-black text-gray-50 uppercase tracking-tighter select-none -z-0 pointer-events-none">
                {t('admission_page.apply_watermark', 'Apply')}
              </span>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grow-line h-1.5 rounded-full" style={{ background: '#8b5cf6' }}></div>
                    <span className="font-bold uppercase tracking-[0.4em] text-[10px]" style={{ color: '#8b5cf6' }}>
                      {t('admission_page.process_label', 'HOW TO APPLY')}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {t('admission_page.process_title')}{' '}
                    <span style={{ color: '#8b5cf6' }}>{t('admission_page.process_title_accent', 'Process')}</span>
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-xs md:text-right font-medium tracking-wide leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-purple-100 pl-4 md:pl-0 md:pr-4">
                  {t('admission_page.process_subtitle')}
                </p>
              </div>
            </div>

            <div ref={processGridRef as any} className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="process-card rounded-xl p-8 shadow-md border border-gray-100 flex flex-col"
                  style={{ background: '#fff' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = step.accentBg; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px -8px ${step.accent}22, 0 6px 12px -4px rgba(0,0,0,0.05)`; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                >
                  {/* Coloured bottom bar */}
                  <div className="card-bottom-bar" style={{ background: `linear-gradient(90deg, ${step.accent}, ${step.accent}99)` }}></div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl font-black select-none leading-none" style={{ color: step.num, WebkitTextStroke: `1px ${step.accent}44` }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="card-icon-wrap p-3 rounded-full flex-shrink-0"
                      style={{ background: step.accent }}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight transition-colors" style={{}}>
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm font-medium">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

{/* ════════════ 5. ENQUIRY FORM ════════════ */}
        <section className="py-14 bg-[#FDFCF6] relative overflow-hidden">
          <div className="float-a absolute top-0 left-0 w-72 h-72 bg-red-50 rounded-full blur-[100px] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="float-b absolute bottom-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[120px] opacity-50 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div ref={formRef as any} className="reveal">

              <div className="flex items-center gap-4 mb-8">
                <div className="grow-line h-[2px] bg-red-600"></div>
                <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px]">
                  {t('admission_page.form_section_label', 'ENQUIRY')}
                </span>
              </div>

              <div className="relative mb-8">
                <span className="absolute -top-6 right-0 text-7xl font-black uppercase select-none pointer-events-none hidden md:block"
                      style={{ WebkitTextStroke:'1px #fee2e2', color:'transparent' }}>
                  {t('admission_page.enquire_watermark', 'ENQUIRE')}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter relative z-10">
                  {t('admission_page.form_title')} <span className="text-red-600">{t('admission_page.form_title_accent', 'Enquiry')}</span>
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-2 tracking-wide">{t('admission_page.form_subtitle')}</p>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-8 border border-gray-100">
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm success-icon">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{t('admission_page.success_title')}</h3>
                    <p className="text-gray-500 text-base">{t('admission_page.success_msg')}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {t('admission_page.success_urgent')}{' '}
                      <a href="tel:+91 7588869700" className="text-red-600 font-semibold hover:underline">+91 7588869700</a>
                      {' '}{t('admission_page.success_or_email')}{' '}
                      <a href="mailto:headmaster.mhm@gmail.com" className="text-red-600 font-semibold hover:underline">headmaster.mhm@gmail.com</a>
                    </p>
                    <AutoReset key={resetKey} onReset={handleReset} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center text-[11px] font-black text-gray-700 uppercase tracking-widest mb-2">
                          <User className="w-3.5 h-3.5 mr-2 text-red-600" /> {t('admission_page.form_name_label')}
                        </label>
                        <input
                          type="text"
                          value={formData.student_name}
                          onKeyDown={e => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                          onChange={e => {
                            const val = e.target.value.replace(/[0-9]/g, '');
                            setFormData({ ...formData, student_name: val });
                            if (errors.student_name) setErrors({ ...errors, student_name: null });
                          }}
                          className={`adm-input w-full px-4 py-3 border rounded-xl bg-gray-50 text-sm font-medium ${errors.student_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder={t('admission_page.form_name_placeholder')}
                        />
                        {errors.student_name && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.student_name}</p>}
                      </div>
                      <div>
                        <label className="flex items-center text-[11px] font-black text-gray-700 uppercase tracking-widest mb-2">
                          <Mail className="w-3.5 h-3.5 mr-2 text-red-600" /> {t('admission_page.form_email_label')}
                          <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">{t('admission_page.form_email_optional')}</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: null });
                          }}
                          className={`adm-input w-full px-4 py-3 border rounded-xl bg-gray-50 text-sm font-medium ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder={t('admission_page.form_email_placeholder')}
                        />
                        {errors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center text-[11px] font-black text-gray-700 uppercase tracking-widest mb-2">
                        <Phone className="w-3.5 h-3.5 mr-2 text-red-600" /> {t('admission_page.form_phone_label')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        className={`adm-input w-full px-4 py-3 border rounded-xl bg-gray-50 text-sm font-medium ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('admission_page.form_phone_placeholder')}
                      />
                      {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="flex items-center text-[11px] font-black text-gray-700 uppercase tracking-widest mb-2">
                        <MessageSquare className="w-3.5 h-3.5 mr-2 text-red-600" /> {t('admission_page.form_message_label')}
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={e => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: null });
                        }}
                        className={`adm-input w-full px-4 py-3 border rounded-xl bg-gray-50 text-sm font-medium resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('admission_page.form_message_placeholder')}
                      />
                      {errors.message && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.message}</p>}
                    </div>
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">
                        {t('admission_page.form_error_msg')}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red-600 hover:bg-red-700 py-4 text-[13px] font-black rounded-xl shadow-lg shadow-red-200 uppercase tracking-widest transition-colors"
                    >
                      {isSubmitting ? t('admission_page.form_submitting') : t('admission_page.form_submit_btn')}
                    </Button>

                    <div className="pt-5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400 font-medium">
                      <a href="tel:+917588869700" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> +91 7588869700
                      </a>
                      <span className="text-gray-200">|</span>
                      <a href="tel:+919657630464" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> +91 9657630464
                      </a>
                      <span className="text-gray-200">|</span>
                      <a href="mailto:headmaster.mhm@gmail.com" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> headmaster.mhm@gmail.com
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Admission;