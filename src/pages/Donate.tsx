import { useState, FormEvent, useEffect, useRef } from 'react';
import { Heart, BookOpen, Monitor, Users, Building, Smartphone, Mail, Phone, CheckCircle, CreditCard, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

// ── Scroll animation hook ──────────────────────────────────────────
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in-view');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── Auto-reset countdown ──────────────────────────────────────────
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
      {t('donate_page.reset_text')} <span className="text-red-500 font-bold">{seconds}</span>{t('donate_page.reset_seconds_unit')} —{' '}
      <button onClick={() => onResetRef.current()} className="text-red-600 underline hover:text-red-800 font-medium">
        {t('donate_page.reset_now')}
      </button>
    </p>
  );
}

// ── FAQ Accordion Item ────────────────────────────────────────────
function FaqItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`faq-accordion-item rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-red-300 bg-white shadow-md shadow-red-100'
          : 'border-gray-200 bg-white hover:border-red-200 hover:shadow-sm'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span className={`text-base font-semibold transition-colors duration-200 ${isOpen ? 'text-red-600' : 'text-gray-800 group-hover:text-red-600'}`}>
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-red-600 text-white rotate-180' : 'bg-red-50 text-red-500 group-hover:bg-red-100'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <div
        ref={bodyRef}
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: isOpen ? `${bodyRef.current?.scrollHeight ?? 300}px` : '0px',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
        }}
      >
        <div className="px-6 pb-5">
          <div className="h-px bg-red-100 mb-4" />
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// ── Google Forms submission ───────────────────────────────────────
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSdUhk2gvvUCKR-b8EPVPPkZ-wQ42LXZ-zXvwJOXZXuWTHKBBg/formResponse';

const ENTRY_IDS = {
  full_name:     'entry.468176863',
  email:         'entry.2082340584',
  phone:         'entry.1585586376',
  donation_type: 'entry.309465188',
  message:       'entry.1744908057',
};

async function submitToGoogleForm(data: {
  full_name: string;
  email: string;
  phone: string;
  donation_type: string;
  message: string;
}) {
  const body = new URLSearchParams({
    [ENTRY_IDS.full_name]:     data.full_name,
    [ENTRY_IDS.email]:         data.email,
    [ENTRY_IDS.phone]:         data.phone,
    [ENTRY_IDS.donation_type]: data.donation_type,
    [ENTRY_IDS.message]:       data.message,
  });

  // Google Forms doesn't support CORS, so we use no-cors.
  // The response will be opaque but the submission still goes through.
  await fetch(GOOGLE_FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
}

const Donate = () => {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    donation_type: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetKey, setResetKey] = useState(0);

  const formSectionRef = useRef<HTMLElement>(null);

  const whyRef     = useScrollAnimation();
  const waysTitle  = useScrollAnimation();
  const contrib1   = useScrollAnimation();
  const contrib2   = useScrollAnimation();
  const contrib3   = useScrollAnimation();
  const contrib4   = useScrollAnimation();
  const howTitle   = useScrollAnimation();
  const method1    = useScrollAnimation();
  const method2    = useScrollAnimation();
  const method3    = useScrollAnimation();
  const method4    = useScrollAnimation();
  const faqTitle   = useScrollAnimation();
  const faqList    = useScrollAnimation();
  const formRef    = useScrollAnimation();
  const contactRef = useScrollAnimation();

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    setFormData({ full_name: '', email: '', phone: '', donation_type: '', message: '' });
    setErrors({});
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      newErrors.full_name = t('donate_page.err_name_short');
    } else if (/[0-9]/.test(formData.full_name)) {
      newErrors.full_name = t('donate_page.err_name_numbers');
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('donate_page.err_email');
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t('donate_page.err_phone');
    }
    if (!formData.donation_type) {
      newErrors.donation_type = t('donate_page.err_type');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await submitToGoogleForm(formData);
      setResetKey(k => k + 1);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contributionTypes = [
    { icon: BookOpen, title: t('donate_page.contrib1_title'), description: t('donate_page.contrib1_desc'), impact: t('donate_page.contrib1_impact'), color: 'from-blue-500 to-blue-600', ref: contrib1, delay: 'delay-100' },
    { icon: Monitor,  title: t('donate_page.contrib2_title'), description: t('donate_page.contrib2_desc'), impact: t('donate_page.contrib2_impact'), color: 'from-green-500 to-green-600', ref: contrib2, delay: 'delay-200' },
    { icon: Users,    title: t('donate_page.contrib3_title'), description: t('donate_page.contrib3_desc'), impact: t('donate_page.contrib3_impact'), color: 'from-purple-500 to-purple-600', ref: contrib3, delay: 'delay-300' },
    { icon: Heart,    title: t('donate_page.contrib4_title'), description: t('donate_page.contrib4_desc'), impact: t('donate_page.contrib4_impact'), color: 'from-red-500 to-red-600', ref: contrib4, delay: 'delay-400' },
  ];

  const donationMethods = [
    { icon: Smartphone, title: t('donate_page.method1_title'), description: t('donate_page.method1_desc'), ref: method1, delay: 'delay-100' },
    { icon: CreditCard, title: t('donate_page.method2_title'), description: t('donate_page.method2_desc'), ref: method2, delay: 'delay-200' },
    { icon: Building,   title: t('donate_page.method3_title'), description: t('donate_page.method3_desc'), ref: method3, delay: 'delay-300' },
    { icon: Users,      title: t('donate_page.method4_title'), description: t('donate_page.method4_desc'), ref: method4, delay: 'delay-400' },
  ];

  const faqs = [
    { question: t('donate_page.faq1_q'), answer: t('donate_page.faq1_a') },
    { question: t('donate_page.faq2_q'), answer: t('donate_page.faq2_a') },
    { question: t('donate_page.faq3_q'), answer: t('donate_page.faq3_a') },
    { question: t('donate_page.faq4_q'), answer: t('donate_page.faq4_a') },
  ];

  return (
    <>
      <style>{`
        .scroll-animate { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .scroll-animate.animate-in-view { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }

        @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideUp   { from { opacity: 0; transform: translateY(24px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn         { 0% { opacity: 0; transform: scale(0.5); } 70% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pulseSlow     { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.35; } }
        @keyframes heartbeat     { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.15); } 50% { transform: scale(1); } 75% { transform: scale(1.1); } }

        .hero-title  { animation: fadeSlideDown 0.8s ease both; }
        .hero-sub    { animation: fadeSlideUp 0.8s 0.25s ease both; }
        .hero-btn    { animation: fadeSlideUp 0.8s 0.45s ease both; }
        .pulse-blob  { animation: pulseSlow 4s infinite; }
        .heart-beat  { animation: heartbeat 1.8s ease-in-out infinite; }
        .success-icon { animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }

        .hero-cta-btn {
          position: relative; display: inline-flex; align-items: center; gap: 8px;
          background: #ffffff; color: #dc2626; font-weight: 700; font-size: 1rem;
          padding: 14px 32px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5);
          transition: all 0.25s ease; overflow: hidden; letter-spacing: 0.01em;
        }
        .hero-cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          opacity: 0; transition: opacity 0.25s ease;
        }
        .hero-cta-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 32px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.4); color: #ffffff; border-color: #dc2626; }
        .hero-cta-btn:hover::before { opacity: 1; }
        .hero-cta-btn span { position: relative; z-index: 1; }
        .hero-cta-btn:active { transform: translateY(-1px) scale(1.01); }

        .contrib-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .contrib-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }

        .way-card {
          cursor: pointer; border: 2px solid #bfdbfe;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .way-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(59,130,246,0.15); border-color: #2563eb; background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); }
        .way-card .way-icon-wrap { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .way-card:hover .way-icon-wrap { transform: scale(1.12); box-shadow: 0 4px 12px rgba(59,130,246,0.2); border-color: #93c5fd; }
        .way-card .way-title { transition: color 0.3s ease; }
        .way-card:hover .way-title { color: #1d4ed8; }

        @keyframes kenBurns1 { 0% { opacity: 1; transform: scale(1.05); } 28% { opacity: 1; transform: scale(1.12); } 33% { opacity: 0; transform: scale(1.12); } 100% { opacity: 0; transform: scale(1.05); } }
        @keyframes kenBurns2 { 0% { opacity: 0; } 28% { opacity: 0; } 33% { opacity: 1; transform: scale(1.05); } 61% { opacity: 1; transform: scale(1.12); } 66% { opacity: 0; transform: scale(1.12); } 100% { opacity: 0; } }
        @keyframes kenBurns3 { 0% { opacity: 0; } 61% { opacity: 0; } 66% { opacity: 1; transform: scale(1.05); } 94% { opacity: 1; transform: scale(1.12); } 100% { opacity: 0; transform: scale(1.12); } }
        .slide1 { animation: kenBurns1 12s ease-in-out infinite; }
        .slide2 { animation: kenBurns2 12s ease-in-out infinite; }
        .slide3 { animation: kenBurns3 12s ease-in-out infinite; }

        .section-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fef2f2; color: #dc2626; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.13em; text-transform: uppercase; padding: 5px 14px;
          border-radius: 50px; border: 1px solid #fecaca; margin-bottom: 12px;
        }
        .section-pill::before { content: ''; width: 6px; height: 6px; background: #dc2626; border-radius: 50%; display: inline-block; }

        .heading-accent { position: relative; display: inline; white-space: nowrap; }
        .heading-accent::after {
          content: ''; position: absolute; left: 0; bottom: -4px;
          width: 100%; height: 5px;
          background: linear-gradient(90deg, #dc2626, #f87171 60%, transparent);
          border-radius: 3px;
        }

        /* ── FAQ Accordion ── */
        .faq-accordion-item { cursor: default; }
        .faq-accordion-item button { cursor: pointer; }
      `}</style>

      <div className="min-h-screen pt-20 bg-slate-50">

        {/* 1. HERO */}
        <section className="relative py-24 bg-gradient-to-br from-red-700 to-red-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="slide1 absolute inset-0">
              <img src="/d1.jpeg" alt="Students learning" className="w-full h-full object-cover object-top" />
            </div>
            <div className="slide2 absolute inset-0">
              <img src="/d2.jpeg" alt="Classroom" className="w-full h-full object-cover object-top" />
            </div>
            <div className="slide3 absolute inset-0">
              <img src="/d3.jpeg" alt="School building" className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-red-900/50" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-pink-300 heart-beat" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 hero-title drop-shadow-lg">
              {t('donate_page.hero_title')} <span className="text-red-200">{t('donate_page.hero_title_accent')}</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto hero-sub mb-8 drop-shadow">
              {t('donate_page.hero_subtitle')}
            </p>
            <div className="hero-btn">
              <button onClick={scrollToForm} className="hero-cta-btn">
                <span>{t('donate_page.hero_btn')}</span>
                <span>→</span>
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pulse-blob"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pulse-blob"></div>
        </section>

        {/* 2. WHY YOUR SUPPORT MATTERS */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={whyRef as any} className="scroll-animate">
              <div className="text-center mb-8">
                <div className="section-pill">Our Story</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Every Rupee Plants a{' '}
                  <span className="heading-accent text-red-600">Seed of Change</span>
                </h2>
              </div>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>{t('donate_page.why_p1')}</p>
                <p>{t('donate_page.why_p2')}</p>
                <p>{t('donate_page.why_p3')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WAYS TO CONTRIBUTE */}
        <section className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={waysTitle as any} className="scroll-animate text-center mb-12">
              <div className="section-pill">Make an Impact</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Choose How You{' '}
                <span className="heading-accent text-red-600">Spark a Future</span>
              </h2>
              <p className="text-gray-500 mt-5">{t('donate_page.ways_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contributionTypes.map((type, index) => (
                <div
                  key={index}
                  ref={type.ref as any}
                  className={`scroll-animate ${type.delay} contrib-card bg-white rounded-xl p-6 shadow-md border border-gray-100`}
                >
                  <div className={`inline-block p-4 rounded-lg bg-gradient-to-br ${type.color} mb-4`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{type.description}</p>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-red-600">{type.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. YOU CAN DONATE THROUGH */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={howTitle as any} className="scroll-animate text-center mb-12">
              <div className="section-pill">Simple & Secure</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your Kindness,{' '}
                <span className="heading-accent text-red-600">Your Way</span>
              </h2>
              <p className="text-gray-500 mt-5">{t('donate_page.how_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donationMethods.map((method, index) => (
                <div
                  key={index}
                  ref={method.ref as any}
                  onClick={scrollToForm}
                  className={`scroll-animate ${method.delay} way-card bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 shadow-sm flex items-start gap-5`}
                >
                  <div className="way-icon-wrap bg-white p-3 rounded-xl shadow-sm border border-blue-100 text-blue-600 flex-shrink-0">
                    <method.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="way-title text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. EXPRESS YOUR INTEREST FORM */}
        <section ref={formSectionRef} className="py-16 bg-red-50 scroll-mt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={formRef as any} className="scroll-animate">
              <div className="text-center mb-10">
                <div className="section-pill">Take Action</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Be the{' '}
                  <span className="heading-accent text-red-600">Reason They Smile</span>
                </h2>
                <p className="text-gray-600 mt-5">{t('donate_page.form_subtitle')}</p>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm success-icon">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('donate_page.success_title')}</h3>
                    <p className="text-gray-500 text-base">{t('donate_page.success_msg')}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {t('donate_page.success_urgent')}{' '}
                      <a href="tel:+917588869700" className="text-red-600 font-semibold hover:underline">+91 7588869700 | +91 9657630464</a>{' '}
                      {t('donate_page.success_or_email')}{' '}
                      <a href="mailto:headmaster.mhm@gmail.com" className="text-red-600 font-semibold hover:underline">headmaster.mhm@gmail.com</a>
                    </p>
                    <AutoReset key={resetKey} onReset={handleReset} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 mr-2 text-red-600" /> {t('donate_page.form_name_label')}
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[0-9]/g, '');
                          setFormData({ ...formData, full_name: val });
                          if (errors.full_name) setErrors({ ...errors, full_name: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('donate_page.form_name_placeholder')}
                      />
                      {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-red-600" /> {t('donate_page.form_email_label')}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('donate_page.form_email_placeholder')}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 mr-2 text-red-600" /> {t('donate_page.form_phone_label')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder={t('donate_page.form_phone_placeholder')}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Heart className="w-4 h-4 mr-2 text-red-600" /> {t('donate_page.form_type_label')}
                      </label>
                      <select
                        value={formData.donation_type}
                        onChange={(e) => {
                          setFormData({ ...formData, donation_type: e.target.value });
                          if (errors.donation_type) setErrors({ ...errors, donation_type: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.donation_type ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">{t('donate_page.form_type_placeholder')}</option>
                        <option value="Learning Materials">{t('donate_page.type_learning')}</option>
                        <option value="Digital Classrooms">{t('donate_page.type_digital')}</option>
                        <option value="Volunteer & Mentor">{t('donate_page.type_volunteer')}</option>
                        <option value="Financial Support">{t('donate_page.type_financial')}</option>
                        <option value="Infrastructure">{t('donate_page.type_infrastructure')}</option>
                        <option value="Scholarships">{t('donate_page.type_scholarships')}</option>
                        <option value="Other">{t('donate_page.type_other')}</option>
                      </select>
                      {errors.donation_type && <p className="text-red-500 text-xs mt-1">{errors.donation_type}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-red-600" /> {t('donate_page.form_message_label')}
                        <span className="ml-2 text-xs font-normal text-gray-400">{t('donate_page.form_message_optional')}</span>
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white resize-none"
                        placeholder={t('donate_page.form_message_placeholder')}
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl">
                        {t('donate_page.form_error_msg')}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red-600 hover:bg-red-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-red-200"
                    >
                      {isSubmitting ? t('donate_page.form_submitting') : t('donate_page.form_submit_btn')}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <div ref={faqTitle as any} className="scroll-animate text-center mb-10">
              <div className="section-pill">Got Questions?</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything You{' '}
                <span className="heading-accent text-red-600">Need to Know</span>
              </h2>
              <p className="text-gray-500 text-sm mt-4">Click any question to see the answer</p>
            </div>

            <div ref={faqList as any} className="scroll-animate space-y-3">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqIndex === index}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                />
              ))}
            </div>

            <div ref={contactRef as any} className="scroll-animate mt-12 bg-gradient-to-br from-red-50 to-slate-50 rounded-2xl p-8 text-center border border-red-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.contact_title')}</h3>
              <p className="text-gray-600 mb-6">{t('home.contact_subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:headmaster.mhm@gmail.com" className="flex items-center justify-center px-8 py-4 bg-white rounded-xl shadow hover:shadow-lg transition-all border border-red-100 min-w-[280px]">
                  <Mail className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900 whitespace-nowrap">{t('footer.email')}</span>
                </a>
                <a href="tel:+917588869700" className="flex items-center justify-center px-8 py-4 bg-white rounded-xl shadow hover:shadow-lg transition-all border border-red-100 min-w-[320px]">
                  <Phone className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900 whitespace-nowrap">+91 7588869700 | +91 9657630464</span>
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
    </>
  );
};

export default Donate;