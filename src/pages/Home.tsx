import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation, Trans } from 'react-i18next';

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSc9ou8hM-Yp3kdbapaR2Ie5QOV6Bjp4DL73YcEb5BMAcAE4Ug/formResponse';

const ENTRY = {
  student_name: 'entry.2005620554',
  email:        'entry.1045781291',
  phone:        'entry.1166974658',
  message:      'entry.839337160',
};

/* ── TypeScript interfaces ── */
interface FormData {
  student_name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  student_name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
}

/* ─── tiny hook: triggers CSS class when element enters viewport ─── */
function useReveal(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.12, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Auto-reset countdown after success ─── */
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
      {t('home.reset_text')}{' '}
      <span className="font-bold" style={{ color: '#e05a8a' }}>{seconds}</span>{t('home.reset_seconds_unit')} —{' '}
      <button onClick={() => onResetRef.current()} className="underline hover:opacity-80 font-medium" style={{ color: '#c94070' }}>
        {t('home.reset_now')}
      </button>
    </p>
  );
}

/* ─── JS-driven infinite marquee hook ─── */
function useManualScroll({ direction = 'left', speed = 0.5 }: { direction?: 'left' | 'right'; speed?: number } = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let offset = 0;
    const autoSpeed = direction === 'left' ? -speed : speed;
    let isHovered = false;
    let isDragging = false;
    let velocity = 0;
    let momentumActive = false;
    let rafId = 0;

    let dragStartX = 0;
    let dragStartOffset = 0;
    let lastX = 0;
    let lastTime = 0;

    const halfWidth = () => el.scrollWidth / 2;

    const wrapOffset = (v: number) => {
      const hw = halfWidth();
      if (hw === 0) return v;
      v = v % hw;
      if (v > 0) v -= hw;
      return v;
    };

    const applyTransform = () => {
      el.style.transform = `translateX(${offset}px)`;
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      if (isDragging) return;

      if (momentumActive) {
        velocity *= 0.92;
        offset += velocity;
        offset = wrapOffset(offset);
        applyTransform();
        if (Math.abs(velocity) < 0.3) {
          momentumActive = false;
          velocity = 0;
        }
        return;
      }

      if (!isHovered) {
        offset += autoSpeed;
        offset = wrapOffset(offset);
        applyTransform();
      }
    };

    rafId = requestAnimationFrame(tick);

    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeave = () => {
      isHovered = false;
      if (isDragging) {
        isDragging = false;
        el.style.cursor = '';
        momentumActive = true;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      momentumActive = false;
      velocity = 0;
      dragStartX = e.pageX;
      dragStartOffset = offset;
      lastX = e.pageX;
      lastTime = Date.now();
      el.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);
      velocity = (e.pageX - lastX) / dt * 16;
      lastX = e.pageX;
      lastTime = now;
      offset = wrapOffset(dragStartOffset + (e.pageX - dragStartX));
      applyTransform();
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = '';
      momentumActive = true;
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      momentumActive = false;
      velocity = 0;
      dragStartX = e.touches[0].pageX;
      dragStartOffset = offset;
      lastX = e.touches[0].pageX;
      lastTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);
      velocity = (e.touches[0].pageX - lastX) / dt * 16;
      lastX = e.touches[0].pageX;
      lastTime = now;
      offset = wrapOffset(dragStartOffset + (e.touches[0].pageX - dragStartX));
      applyTransform();
    };

    const onTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      momentumActive = true;
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [direction, speed]);

  return ref;
}

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contactRef = useScrollAnimation();

  const achievements = [
    { image: '/ach2.jpeg',     title: t('home.achievements_card1_title'), description: t('home.achievements_card1_desc') },
    { image: '/achieve1.jpeg', title: t('home.achievements_card2_title'), description: t('home.achievements_card2_desc') },
    { image: '/achieve2.jpeg', title: t('home.achievements_card3_title'), description: t('home.achievements_card3_desc') },
    { image: '/achieve3.jpeg', title: t('home.achievements_card4_title'), description: t('home.achievements_card4_desc') },
    { image: '/ach1.jpeg',     title: t('home.achievements_card5_title'), description: t('home.achievements_card5_desc') },
    { image: '/achieve.jpeg',  title: t('home.achievements_card6_title'), description: t('home.achievements_card6_desc') },
    { image: '/achp.jpeg',     title: t('home.achievements_card7_title'), description: t('home.achievements_card7_desc') },
  ];

  const activitiesRow1 = [
    { image: '/activity.jpeg',  title: t('home.activity_c1_title'),  description: t('home.activity_c1_desc') },
    { image: '/activity2.jpeg', title: t('home.activity_c2_title'),  description: t('home.activity_c2_desc') },
    { image: '/activity3.jpeg', title: t('home.activity_c3_title'),  description: t('home.activity_c3_desc') },
    { image: '/activity4.jpeg', title: t('home.activity_c4_title'),  description: t('home.activity_c4_desc') },
    { image: '/act1.jpeg',      title: t('home.activity_c5_title'),  description: t('home.activity_c5_desc') },
    { image: '/act2.jpeg',      title: t('home.activity_c6_title'),  description: t('home.activity_c6_desc') },
    { image: '/act20.jpeg',     title: t('home.activity_c7_title'),  description: t('home.activity_c7_desc') },
    { image: '/act21.jpeg',     title: t('home.activity_c8_title'),  description: t('home.activity_c8_desc') },
    { image: '/act22.jpeg',     title: t('home.activity_c9_title'),  description: t('home.activity_c9_desc') },
    { image: '/act23.jpeg',     title: t('home.activity_c10_title'), description: t('home.activity_c10_desc') },
    { image: '/act24.jpeg',     title: t('home.activity_c11_title'), description: t('home.activity_c11_desc') },
    { image: '/act25.jpeg',     title: t('home.activity_c12_title'), description: t('home.activity_c12_desc') },
  ];

  const activitiesRow2 = [
    { image: '/act3.jpeg',  title: t('home.activity_c13_title'), description: t('home.activity_c13_desc') },
    { image: '/act4.jpeg',  title: t('home.activity_c14_title'), description: t('home.activity_c14_desc') },
    { image: '/act5.jpeg',  title: t('home.activity_c15_title'), description: t('home.activity_c15_desc') },
    { image: '/act6.jpeg',  title: t('home.activity_c16_title'), description: t('home.activity_c16_desc') },
    { image: '/act7.jpeg',  title: t('home.activity_c17_title'), description: t('home.activity_c17_desc') },
    { image: '/act8.jpeg',  title: t('home.activity_c18_title'), description: t('home.activity_c18_desc') },
    { image: '/act9.jpeg',  title: t('home.activity_c19_title'), description: t('home.activity_c19_desc') },
    { image: '/act10.jpeg', title: t('home.activity_c20_title'), description: t('home.activity_c20_desc') },
    { image: '/act11.jpeg', title: t('home.activity_c21_title'), description: t('home.activity_c21_desc') },
    { image: '/act12.jpeg', title: t('home.activity_c22_title'), description: t('home.activity_c22_desc') },
    { image: '/act13.jpeg', title: t('home.activity_c23_title'), description: t('home.activity_c23_desc') },
    { image: '/act14.jpeg', title: t('home.activity_c24_title'), description: t('home.activity_c24_desc') },
    { image: '/act15.jpeg', title: t('home.activity_c25_title'), description: t('home.activity_c25_desc') },
    { image: '/act16.jpeg', title: t('home.activity_c26_title'), description: t('home.activity_c26_desc') },
    { image: '/act17.jpeg', title: t('home.activity_c27_title'), description: t('home.activity_c27_desc') },
    { image: '/act18.jpeg', title: t('home.activity_c28_title'), description: t('home.activity_c28_desc') },
    { image: '/act19.jpeg', title: t('home.activity_c29_title'), description: t('home.activity_c29_desc') },
  ];

  const admissionSteps = [
    { number: '01', title: t('home.admission_step1_title'), description: t('home.admission_step1_desc'), icon: BookOpen },
    { number: '02', title: t('home.admission_step2_title'), description: t('home.admission_step2_desc'), icon: CheckCircle },
    { number: '03', title: t('home.admission_step3_title'), description: t('home.admission_step3_desc'), icon: Award },
  ];

  /* Step accent colors matching admission.tsx: rose / amber / teal */
  const stepAccents = [
    { accent: '#e05a8a', accentBg: '#fdf2f6', numBg: '#fce7f0' },
    { accent: '#f59e0b', accentBg: '#fffbeb', numBg: '#fef3c7' },
    { accent: '#0d9488', accentBg: '#f0fdfa', numBg: '#ccfbf1' },
  ];

  const achievementsRef   = useManualScroll({ direction: 'left',  speed: 1.2 });
  const activitiesRow1Ref = useManualScroll({ direction: 'right', speed: 1.2 });
  const activitiesRow2Ref = useManualScroll({ direction: 'left',  speed: 1.2 });

  const aboutRef      = useReveal();
  const admissionRef  = useReveal();
  const achieveRef    = useReveal();
  const activitiesRef = useReveal();
  const ctaRef        = useReveal();

  const [formData, setFormData] = useState<FormData>({ student_name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setFormData({ student_name: '', email: '', phone: '', message: '' });
    setErrors({});
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!formData.student_name.trim() || formData.student_name.trim().length < 2)
      newErrors.student_name = t('home.err_name_short');
    else if (/[0-9]/.test(formData.student_name))
      newErrors.student_name = t('home.err_name_numbers');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('home.err_email');
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = t('home.err_phone');
    if (!formData.message.trim() || formData.message.trim().length < 10)
      newErrors.message = t('home.err_message');

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setIsSubmitting(true);
    try {
      const iframeName = `gform-iframe-${Date.now()}`;

      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      await new Promise(resolve => {
        iframe.onload = resolve;
        setTimeout(resolve, 500);
      });

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_FORM_ACTION;
      form.target = iframeName;

      const fields: Record<string, string> = {
        [ENTRY.student_name]: formData.student_name,
        [ENTRY.email]:        formData.email,
        [ENTRY.phone]:        formData.phone,
        [ENTRY.message]:      formData.message,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        form.submit();
        setTimeout(resolve, 6000);
      });

      try { document.body.removeChild(form); } catch {}
      try { document.body.removeChild(iframe); } catch {}

      setResetKey(k => k + 1);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .reveal          { opacity: 0; transform: translateY(36px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-left          { opacity: 0; transform: translateX(-48px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-left.revealed { opacity: 1; transform: none; }
        .reveal-right          { opacity: 0; transform: translateX(48px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-right.revealed { opacity: 1; transform: none; }

        .stagger > * { opacity: 0; transform: translateY(28px); transition: opacity .55s cubic-bezier(.4,0,.2,1), transform .55s cubic-bezier(.4,0,.2,1); }
        .stagger.revealed > *:nth-child(1) { opacity:1;transform:none;transition-delay:.05s }
        .stagger.revealed > *:nth-child(2) { opacity:1;transform:none;transition-delay:.15s }
        .stagger.revealed > *:nth-child(3) { opacity:1;transform:none;transition-delay:.25s }
        .stagger.revealed > *:nth-child(4) { opacity:1;transform:none;transition-delay:.35s }
        .stagger.revealed > *:nth-child(5) { opacity:1;transform:none;transition-delay:.45s }
        .stagger.revealed > *:nth-child(6) { opacity:1;transform:none;transition-delay:.55s }

        @keyframes heroFade  { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:none } }
        @keyframes heroSlide { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        @keyframes heroBtns  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
        .hero-title  { animation: heroFade  .9s cubic-bezier(.4,0,.2,1) .2s both }
        .hero-sub    { animation: heroSlide .9s cubic-bezier(.4,0,.2,1) .5s both }
        .hero-btns   { animation: heroBtns  .9s cubic-bezier(.4,0,.2,1) .75s both }

        .marquee-strip {
          display: flex;
          width: max-content;
          will-change: transform;
          cursor: grab;
          user-select: none;
        }
        .marquee-strip:active { cursor: grabbing; }

        @keyframes popIn { 0%{opacity:0;transform:scale(.7)} 80%{transform:scale(1.07)} 100%{opacity:1;transform:scale(1)} }
        .pop-in { animation: popIn .5s cubic-bezier(.4,0,.2,1) both; }

        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        .float-a { animation: floatA 6s ease-in-out infinite; }
        .float-b { animation: floatB 8s ease-in-out infinite; }

        @keyframes growLine { from{width:0} to{width:4rem} }
        .grow-line { animation: growLine .6s cubic-bezier(.4,0,.2,1) .4s both; }

        .card-hover { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .card-hover:hover { transform: translateY(-4px) scale(1.01); }
      `}</style>

      <div className="min-h-screen overflow-x-hidden">
        {/* Warm soft background matching admission.tsx hero */}
        <div style={{ background: 'linear-gradient(to bottom, #fff0f5 0%, #fff7ed 40%, #fffbeb 70%, #fafaf7 100%)' }}>

          {/* ── HERO ── */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/school.png"
                alt="School Building"
                className="w-full h-full object-cover opacity-80"
                style={{ objectPosition: 'center 30%' }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            {/* Floating blobs matching admission.tsx */}
            <div className="float-a absolute top-24 left-12 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(224,90,138,0.15)', filter: 'blur(40px)' }}></div>
            <div className="float-b absolute bottom-32 right-16 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(251,191,36,0.15)', filter: 'blur(60px)' }}></div>
            <div className="float-a absolute top-16 right-24 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'rgba(139,92,246,0.12)', filter: 'blur(50px)' }}></div>

            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
              <h1 className="hero-title mb-6 leading-tight">
                {/* "Welcome to" pill — now with teal/amber border glow instead of maroon */}
                <span
                  className="inline-block text-xl md:text-2xl lg:text-3xl mb-4 tracking-[0.3em] uppercase font-light px-6 py-1.5"
                  style={{
                    color: '#ffffff',
                    fontFamily: "'Georgia', serif",
                    letterSpacing: '0.25em',
                  }}
                >
                  {t('home.hero_welcome')}
                </span>
                {/* School name — white with amber/teal glow instead of maroon */}
                <span
                  className="block text-3xl md:text-5xl lg:text-6xl font-bold mt-2"
                  style={{
                    fontFamily: "'Georgia', serif",
                    color: '#ffffff',
                    textShadow: '1px 1px 0 #ac1e0b, -1px -1px 0 #ac1e0b, 1px -1px 0 #ac1e0b, -1px 1px 0 #ac1e0b',
                    lineHeight: '1.4',
                  }}
                >
                  {t('home.hero_title')}
                </span>
              </h1>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 mb-7 hero-sub">
                <span className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, #ffffff)' }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffffff', boxShadow: '0 0 6px 2px rgba(240, 231, 233, 0.7)' }} />
                <span className="h-px w-6" style={{ background: '#ffffff', opacity: 0.6 }} />
                <span
                  className="text-xs tracking-[0.35em] uppercase font-semibold px-3"
                  style={{ color: '#fde68a', fontFamily: "'Georgia', serif", letterSpacing: '0.3em' }}
                >
                  ✦
                </span>
                <span className="h-px w-6" style={{ background: '#ffffff', opacity: 0.6 }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffffff', boxShadow: '0 0 6px 2px rgba(240, 231, 233, 0.7)' }} />
                <span className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, #ffffff)' }} />
              </div>

              <p className="hero-sub mb-8">
                <span
                  className="block font-bold text-xl md:text-2xl mb-2"
                  style={{
                    color: '#ffffff',
                    letterSpacing: '0.06em',
                    textShadow: '0 0 16px rgba(199, 32, 32, 0.8), 0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {t('home.hero_slogan_sanskrit')}
                </span>
                <span
                  className="block italic text-sm md:text-base font-medium tracking-wide"
                  style={{
                    color: '#ffffff',
                    letterSpacing: '0.06em',
                    textShadow: '0 0 16px rgba(199, 32, 32, 0.8), 0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {t('home.hero_slogan_english')}
                </span>
              </p>

              <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/admission')}>
                  {t('home.hero_apply_btn')}
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/donate')}
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:border-white hover:text-white"
                >
                  {t('home.hero_support_btn')}
                </Button>
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section className="py-12">
            <div ref={aboutRef} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Text + Stats */}
                <div>
                  <div className="relative mb-2">
                    <span
                      className="text-7xl md:text-8xl font-black absolute -top-6 left-0 uppercase select-none pointer-events-none whitespace-nowrap"
                      style={{ WebkitTextStroke: '1.5px #fde68a', color: 'transparent' }}
                    >
                      About Us
                    </span>
                    <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: '#fce7f0', color: '#c94070' }}>
                      {t('home.about_badge')}
                    </span>
                  </div>
                  <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('home.about_title')} <span style={{ color: '#aa1e36' }}>{t('home.about_title_accent')}</span>
                  </h2>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    <Trans
                      i18nKey="home.about_description"
                      components={{ b: <span className="font-semibold text-gray-900" /> }}
                    />
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: t('home.about_stat1') },
                      { label: t('home.about_stat2') },
                      { label: t('home.about_stat3') },
                      { label: t('home.about_stat4') },
                    ].map((s, i) => {
                      /* Cycle through rose / amber / teal / violet */
                      const statColors = [
                        {  border: '#eebbd1', dot: '#e05a8a', text: '#c94070' },
                        {  border: '#f0e0a2', dot: '#f59e0b', text: '#d97706' },
                        {  border: '#b2f1e4', dot: '#0d9488', text: '#0d9488' },
                        {  border: '#ccc6eb', dot: '#8b5cf6', text: '#7c3aed' },
                      ];
                      const c = statColors[i % 4];
                      return (
                        <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }}></div>
                          <div className="text-sm font-semibold" style={{ color: c.text }}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grow-line h-0.5 rounded-full mb-6" style={{ background: '#fde68a' }}></div>
                  <Button onClick={() => navigate('/about')} variant="outline">
                    {t('home.about_btn')}
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Right: School Photo with frame */}
                <div className="relative">
                  {/* Teal dot pattern background — same as admission.tsx overview image */}
                  <div
                    className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #5eead4 1.5px, transparent 1.5px)',
                      backgroundSize: '12px 12px',
                      zIndex: 0,
                      opacity: 0.6,
                    }}
                  />
                  {/* Violet offset border — same as admission.tsx */}
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
                    className="relative rounded-2xl z-10"
                    style={{
                      padding: '10px',
                      background: '#ffffff',
                      boxShadow: '0 20px 60px -10px rgba(224,90,138,0.12), 0 8px 24px -4px rgba(0,0,0,0.07)',
                      border: '1px solid #fce7f0',
                    }}
                  >
                    {/* Corner accents in teal */}
                    <span style={{ position: 'absolute', top: 8, left: 8, width: 28, height: 28, zIndex: 20, borderTop: '2px solid #0d9488', borderLeft: '2px solid #0d9488', borderRadius: '6px 0 0 0' }} />
                    <span style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, zIndex: 20, borderTop: '2px solid #0d9488', borderRight: '2px solid #0d9488', borderRadius: '0 6px 0 0' }} />
                    <span style={{ position: 'absolute', bottom: 8, left: 8, width: 28, height: 28, zIndex: 20, borderBottom: '2px solid #0d9488', borderLeft: '2px solid #0d9488', borderRadius: '0 0 0 6px' }} />
                    <span style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, zIndex: 20, borderBottom: '2px solid #0d9488', borderRight: '2px solid #0d9488', borderRadius: '0 0 6px 0' }} />
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src="/act34.jpeg"
                        alt="Manpadale High School"
                        className="w-full h-[380px] object-cover block"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full border-[12px] pointer-events-none z-20" style={{ borderColor: '#fde68a40' }}></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full border-[8px] pointer-events-none z-20" style={{ borderColor: '#ccfbf150' }}></div>
                </div>

              </div>
            </div>
          </section>

          {/* ── ADMISSION PROCESS ── */}
          <section id="admission" className="py-12 relative overflow-hidden">
            {/* Floating blobs */}
            <div className="float-a absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none" style={{ border: '50px solid rgba(224,90,138,0.10)' }}></div>
            <div className="float-b absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none" style={{ border: '40px solid rgba(251,191,36,0.10)' }}></div>
            <div ref={admissionRef} className="stagger max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <div className="relative mb-2">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-6 left-1/2 -translate-x-1/2 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #fde68a', color: 'transparent' }}
                  >
                    {t('home.admission_watermark', 'Admission')}
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: '#fef3c7', color: '#d97706' }}>
                    {t('home.admission_badge')}
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {t('home.admission_title')} <span style={{ color: '#97430c' }}>{t('home.admission_title_accent')}</span>
                </h2>
                <p className="text-gray-500 text-base max-w-xl mx-auto mb-4">
                  {t('home.admission_subtitle')}
                </p>
                <div className="grow-line h-1 mx-auto rounded-full" style={{ background: '#f59e0b' }}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
                {admissionSteps.map((step, index) => {
                  const c = stepAccents[index];
                  return (
                    <div key={index} className="group relative flex">
                      <div
                        className="card-hover relative rounded-2xl p-5 border-2 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center w-full"
                        style={{
                          borderColor: '#e5e7eb',
                        }}
                        onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; }}
                        onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
                      >
                        <div
                          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                          style={{ background: c.accent }}
                        >
                          {step.number}
                        </div>
                        <div
                          className="mt-4 mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 flex-shrink-0"
                          style={{ background: c.numBg, color: c.accent }}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed flex-1">{step.description}</p>
                        <div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-1 rounded-full transition-all duration-500"
                          style={{ background: c.accent }}
                        ></div>
                      </div>
                      {index < admissionSteps.length - 1 && (
                        <div
                          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 z-10 items-center justify-center w-9 h-9 rounded-full text-white shadow-md"
                          style={{ background: '#f59e0b' }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate('/admission')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-colors duration-300 shadow-md hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #e05a8a 0%, #c94070 100%)' }}
                >
                  {t('home.admission_cta_btn')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

        </div>{/* end gradient wrapper */}

        <div className="bg-white">

          {/* ── ACHIEVEMENTS ── */}
          <section id="achievements" className="py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={achieveRef} className="reveal-left mb-10 flex flex-col items-start">
                <div className="relative mb-1">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-5 left-0 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #ccfbf1', color: 'transparent' }}
                  >
                    {t('home.success_watermark', 'Success')}
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                    {t('home.achievements_badge')}
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t('home.achievements_title')} <span style={{ color: '#0d9488' }}>{t('home.achievements_title_accent')}</span>
                </h2>
                <div className="grow-line h-1 rounded-full mt-2" style={{ background: '#0d9488' }}></div>
              </div>
              <div className="overflow-hidden">
                <div ref={achievementsRef} className="marquee-strip py-4" style={{ gap: '0.5rem' }}>
                  {[...achievements, ...achievements].map((achievement, index) => (
                    <div
                      key={index}
                      className="card-hover w-[260px] flex-shrink-0 group relative overflow-hidden rounded-2xl border-2 hover:shadow-lg"
                      style={{ marginRight: '1.5rem', borderColor: '#ccfbf1' }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0d9488'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ccfbf1'; }}
                    >
                      <div className="h-[180px] overflow-hidden">
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/75 via-gray-800/10 to-transparent flex items-end p-5">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-base font-bold text-white mb-1">{achievement.title}</h3>
                          <p className="text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm" style={{ background: '#0d9488' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── GALLERY ── */}
          <section id="activities" className="py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={activitiesRef} className="reveal-right mb-10 flex flex-col items-end text-right">
                <div className="relative mb-1 self-end">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-5 right-0 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #ede9fe', color: 'transparent' }}
                  >
                    {t('home.campus_watermark', 'Campus')}
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                    {t('home.activities_badge')}
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t('home.activities_title')} <span style={{ color: '#8b5cf6' }}>{t('home.activities_title_accent')}</span>
                </h2>
                <div className="grow-line h-1 rounded-full mt-2" style={{ background: '#8b5cf6' }}></div>
              </div>

              {/* Row 1 — scrolls RIGHT — amber accent */}
              <div className="overflow-hidden">
                <div ref={activitiesRow1Ref} className="marquee-strip py-4" style={{ gap: '0.5rem' }}>
                  {[...activitiesRow1, ...activitiesRow1].map((activity, index) => (
                    <div
                      key={index}
                      className="card-hover w-[260px] flex-shrink-0 group relative overflow-hidden rounded-2xl border-2 hover:shadow-lg"
                      style={{ marginRight: '1.5rem', borderColor: '#fef3c7' }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fef3c7'; }}
                    >
                      <div className="h-[180px] overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/75 via-gray-800/10 to-transparent flex items-end p-5">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-base font-bold text-white mb-1">{activity.title}</h3>
                          <p className="text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">{activity.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm" style={{ background: '#f59e0b' }}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 — scrolls LEFT — violet accent */}
              <div className="overflow-hidden mt-3">
                <div ref={activitiesRow2Ref} className="marquee-strip py-4" style={{ gap: '0.5rem' }}>
                  {[...activitiesRow2, ...activitiesRow2].map((activity, index) => (
                    <div
                      key={index}
                      className="card-hover w-[260px] flex-shrink-0 group relative overflow-hidden rounded-2xl border-2 hover:shadow-lg"
                      style={{ marginRight: '1.5rem', borderColor: '#ede9fe' }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8b5cf6'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ede9fe'; }}
                    >
                      <div className="h-[180px] overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-800/10 to-transparent flex items-end p-5">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-base font-bold text-white mb-1">{activity.title}</h3>
                          <p className="text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">{activity.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm" style={{ background: '#8b5cf6' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

           {/* ── CONTACT / ENQUIRY FORM ── */}
          <section id="contact" className="py-12">
            <div ref={ctaRef} className="reveal max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-red-100 text-[#7F2020] px-4 py-1.5 rounded-full mb-4">
                  {t('home.contact_badge')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('home.contact_title')}
                </h2>
                <p className="text-lg text-gray-500">
                  {t('home.contact_subtitle')}
                </p>
                <div className="grow-line h-1 bg-[#7F2020] mx-auto rounded-full mt-4"></div>
              </div>
              <div className="bg-red-50 rounded-3xl shadow-2xl p-8 border border-gray-100">
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm" style={{ animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both' }}>
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('home.success_title')}</h3>
                    <p className="text-gray-500 text-base">{t('home.success_msg')}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {t('home.success_urgent')}{' '}
                      <a href="tel:+91 7588869700" className="text-[#7F2020] font-semibold hover:underline">+91 7588869700</a>{' '}
                      {t('home.success_or_email')}{' '}
                      <a href="mailto:headmaster.mhm@gmail.com" className="text-[#7F2020] font-semibold hover:underline">headmaster.mhm@gmail.com</a>
                    </p>
                    <AutoReset key={resetKey} onReset={handleReset} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                          <User className="w-4 h-4 mr-2 text-[#7F2020]" /> {t('home.form_name_label')}
                        </label>
                        <input
                          type="text"
                          value={formData.student_name}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = e.target.value.replace(/[0-9]/g, '');
                            setFormData({ ...formData, student_name: val });
                            if (errors.student_name) setErrors({ ...errors, student_name: null });
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#7F2020] outline-none transition-all bg-white ${errors.student_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder={t('home.form_name_placeholder')}
                        />
                        {errors.student_name && <p className="text-[#7F2020] text-xs mt-1">{errors.student_name}</p>}
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="w-4 h-4 mr-2 text-[#7F2020]" /> {t('home.form_email_label')}
                          <span className="ml-2 text-xs font-normal text-gray-400">{t('home.form_email_optional')}</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: null });
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#7F2020] outline-none transition-all bg-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder={t('home.form_email_placeholder')}
                        />
                        {errors.email && <p className="text-[#7F2020] text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 mr-2 text-[#7F2020]" /> {t('home.form_phone_label')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#7F2020] outline-none transition-all bg-white ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('home.form_phone_placeholder')}
                      />
                      {errors.phone && <p className="text-[#7F2020] text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 mr-2 text-[#7F2020]" /> {t('home.form_message_label')}
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#7F2020] outline-none transition-all bg-white resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('home.form_message_placeholder')}
                      />
                      {errors.message && <p className="text-[#7F2020] text-xs mt-1">{errors.message}</p>}
                    </div>
                    {submitStatus === 'error' && (
                      <div className="bg-red-100 border border-red-300 text-[#7F2020] text-sm px-4 py-3 rounded-xl">
                        {t('home.form_error_msg')}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#7F2020] hover:bg-[#6b1a1a] py-4 text-lg font-bold rounded-xl shadow-lg shadow-red-200"
                    >
                      {isSubmitting ? t('home.form_submitting') : t('home.form_submit_btn')}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </section>

        </div>{/* end bg-white */}
      </div>{/* end min-h-screen */}
    </>
  );
};

export default Home;