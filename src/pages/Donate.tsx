import { useState, FormEvent, useEffect, useRef } from 'react';
import { Heart, BookOpen, Monitor, Users, Building, Smartphone, Mail, Phone, CheckCircle, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

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
      Form will reset in <span className="text-red-500 font-bold">{seconds}</span>s —{' '}
      <button onClick={() => onResetRef.current()} className="text-red-600 underline hover:text-red-800 font-medium">
        reset now
      </button>
    </p>
  );
}

const Donate = () => {
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

  const whyRef        = useScrollAnimation();
  const waysTitle     = useScrollAnimation();
  const contrib1      = useScrollAnimation();
  const contrib2      = useScrollAnimation();
  const contrib3      = useScrollAnimation();
  const contrib4      = useScrollAnimation();
  const howTitle      = useScrollAnimation();
  const method1       = useScrollAnimation();
  const method2       = useScrollAnimation();
  const method3       = useScrollAnimation();
  const method4       = useScrollAnimation();
  const faqTitle      = useScrollAnimation();
  const faq1          = useScrollAnimation();
  const faq2          = useScrollAnimation();
  const faq3          = useScrollAnimation();
  const formRef       = useScrollAnimation();
  const contactRef    = useScrollAnimation();

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
      newErrors.full_name = "Please enter a valid full name (at least 2 characters).";
    } else if (/[0-9]/.test(formData.full_name)) {
      newErrors.full_name = "Name cannot contain numbers.";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (!formData.donation_type) {
      newErrors.donation_type = "Please select a contribution type.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('donation_interests').insert([formData]);
      if (error) throw error;
      setResetKey(k => k + 1);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contributionTypes = [
    { icon: BookOpen, title: 'Learning Materials', description: 'Support students with books, stationery, and educational resources', impact: 'Help 50+ students access quality learning materials', color: 'from-blue-500 to-blue-600', ref: contrib1, delay: 'delay-100' },
    { icon: Monitor, title: 'Digital Classrooms', description: 'Contribute to upgrading technology and digital infrastructure', impact: 'Enable modern, interactive learning experiences', color: 'from-green-500 to-green-600', ref: contrib2, delay: 'delay-200' },
    { icon: Users, title: 'Volunteer & Mentor', description: 'Share your expertise and time with our students', impact: 'Guide and inspire the next generation', color: 'from-purple-500 to-purple-600', ref: contrib3, delay: 'delay-300' },
    { icon: Heart, title: 'Financial Support', description: 'General donations for scholarships and school development', impact: 'Make quality education accessible to all', color: 'from-red-500 to-red-600', ref: contrib4, delay: 'delay-400' },
  ];

  const donationMethods = [
    { icon: Smartphone, title: 'UPI Payment', description: 'Quick and easy payment through any UPI app', ref: method1, delay: 'delay-100' },
    { icon: CreditCard, title: 'Bank Transfer', description: 'Direct bank transfer for larger contributions', ref: method2, delay: 'delay-200' },
    { icon: Building, title: 'Visit Campus', description: 'Donate in person at our administrative office', ref: method3, delay: 'delay-300' },
    { icon: Users, title: 'CSR Partnership', description: 'Corporate partnerships for sustained impact', ref: method4, delay: 'delay-400' },
  ];

  const faqs = [
    { question: 'Is my donation tax-deductible?', answer: 'Yes, all donations to Greenfield High School are eligible for tax deductions under Section 80G.', ref: faq1, delay: 'delay-100' },
    { question: 'How will my donation be used?', answer: 'Your donation directly supports student scholarships, infrastructure development, and educational programs.', ref: faq2, delay: 'delay-200' },
    { question: 'Can I donate in kind instead of money?', answer: 'Absolutely! We welcome donations of books, computers, sports equipment, and other educational materials.', ref: faq3, delay: 'delay-300' },
  ];

  return (
    <>
      <style>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-animate.animate-in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-left.animate-in-view {
          opacity: 1;
          transform: translateX(0);
        }
        .scroll-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-right.animate-in-view {
          opacity: 1;
          transform: translateX(0);
        }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.5); }
          70%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.35; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25%       { transform: scale(1.15); }
          50%       { transform: scale(1); }
          75%       { transform: scale(1.1); }
        }
        .hero-title  { animation: fadeSlideDown 0.8s ease both; }
        .hero-sub    { animation: fadeSlideUp 0.8s 0.25s ease both; }
        .hero-btn    { animation: fadeSlideUp 0.8s 0.45s ease both; }
        .pulse-blob  { animation: pulseSlow 4s infinite; }
        .heart-beat  { animation: heartbeat 1.8s ease-in-out infinite; }
        .success-icon { animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }

        /* ── Hero CTA button ── */
        .hero-cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #dc2626;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px 32px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5);
          transition: all 0.25s ease;
          overflow: hidden;
          letter-spacing: 0.01em;
        }
        .hero-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .hero-cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 32px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.4);
          color: #ffffff;
          border-color: #dc2626;
        }
        .hero-cta-btn:hover::before {
          opacity: 1;
        }
        .hero-cta-btn span {
          position: relative;
          z-index: 1;
        }
        .hero-cta-btn:active {
          transform: translateY(-1px) scale(1.01);
        }

        /* ── Contribution cards ── */
        .contrib-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .contrib-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        /* ── Donate-through / way cards — blue border on hover ── */
        .way-card {
          cursor: pointer;
          border: 2px solid #bfdbfe; /* blue-200 default */
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .way-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(59,130,246,0.15);
          border-color: #2563eb; /* blue-600 */
          background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
        }
        .way-card .way-icon-wrap {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .way-card:hover .way-icon-wrap {
          transform: scale(1.12);
          box-shadow: 0 4px 12px rgba(59,130,246,0.2);
          border-color: #93c5fd;
        }
        .way-card .way-title {
          transition: color 0.3s ease;
        }
        .way-card:hover .way-title {
          color: #1d4ed8;
        }

        /* ── FAQ cards ── */
        .faq-card {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .faq-card:hover {
          background: #fef2f2;
          transform: translateX(4px);
        }

        @keyframes kenBurns1 {
          0%   { opacity: 1; transform: scale(1.05); }
          28%  { opacity: 1; transform: scale(1.12); }
          33%  { opacity: 0; transform: scale(1.12); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        @keyframes kenBurns2 {
          0%   { opacity: 0; }
          28%  { opacity: 0; }
          33%  { opacity: 1; transform: scale(1.05); }
          61%  { opacity: 1; transform: scale(1.12); }
          66%  { opacity: 0; transform: scale(1.12); }
          100% { opacity: 0; }
        }
        @keyframes kenBurns3 {
          0%   { opacity: 0; }
          61%  { opacity: 0; }
          66%  { opacity: 1; transform: scale(1.05); }
          94%  { opacity: 1; transform: scale(1.12); }
          100% { opacity: 0; transform: scale(1.12); }
        }
        .slide1 { animation: kenBurns1 12s ease-in-out infinite; }
        .slide2 { animation: kenBurns2 12s ease-in-out infinite; }
        .slide3 { animation: kenBurns3 12s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen pt-20 bg-slate-50">

        {/* 1. HERO */}
<section className="relative py-24 bg-gradient-to-br from-red-700 to-red-900 text-white overflow-hidden">
  <div className="absolute inset-0 z-0">

    {/* Slide 1 */}
    <div className="slide1 absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1600"
        alt="Students learning"
        className="w-full h-full object-cover object-top"
      />
    </div>

    {/* Slide 2 */}
    <div className="slide2 absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&q=80&w=1600"
        alt="Classroom"
        className="w-full h-full object-cover object-top"
      />
    </div>

    {/* Slide 3 */}
    <div className="slide3 absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1600"
        alt="School building"
        className="w-full h-full object-cover object-top"
      />
    </div>

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-red-900/50" />
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
    <Heart className="w-16 h-16 mx-auto mb-6 text-pink-300 heart-beat" />
    <h1 className="text-4xl md:text-5xl font-bold mb-6 hero-title drop-shadow-lg">
      Support Our <span className="text-red-200">Mission</span>
    </h1>
    <p className="text-xl text-gray-100 max-w-3xl mx-auto hero-sub mb-8 drop-shadow">
      Your contribution helps us provide quality education and create opportunities for deserving students
    </p>
    <div className="hero-btn">
      <button onClick={scrollToForm} className="hero-cta-btn">
        <span>Express Your Interest</span>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center border-b-4 border-red-600 pb-4 inline-block">
                Why Your Support Matters
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>At Manpadle High School, we believe that quality education should be accessible to all students, regardless of their financial background. Your generous donations help us bridge the gap and create equal opportunities for every child to excel.</p>
                <p>Over the years, contributions from alumni, parents, and well-wishers have enabled us to provide scholarships to deserving students, upgrade our facilities, and introduce innovative learning programs. Every donation, big or small, makes a tangible difference in a student's life.</p>
                <p>We maintain complete transparency in how donations are utilized. Annual reports detailing fund allocation and impact are shared with all donors, ensuring your trust in our commitment to educational excellence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WAYS TO CONTRIBUTE */}
        <section className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={waysTitle as any} className="scroll-animate text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ways to Contribute</h2>
              <p className="text-gray-500">Choose how you'd like to make a difference</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">You Can Donate Through</h2>
              <p className="text-gray-500">Multiple convenient options to support our cause</p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Express Your Interest</h2>
                <p className="text-gray-600">Let us know how you'd like to contribute, and we'll get in touch</p>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm success-icon">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 text-base">
                      We've received your interest. Our team will contact you shortly to discuss how you can contribute.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      For urgent enquiries, call us at{' '}
                      <a href="tel:+91 9657630464 | +91 9527794050" className="text-red-600 font-semibold hover:underline">+91 12345 67890</a>{' '}
                      or email{' '}
                      <a href="mailto:donations@greenfieldhigh.com" className="text-red-600 font-semibold hover:underline">donations@greenfieldhigh.com</a>
                    </p>
                    <AutoReset key={resetKey} onReset={handleReset} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 mr-2 text-red-600" /> Full Name
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
                        placeholder="Enter your full name"
                      />
                      {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-red-600" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 mr-2 text-red-600" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Heart className="w-4 h-4 mr-2 text-red-600" /> Type of Contribution
                      </label>
                      <select
                        value={formData.donation_type}
                        onChange={(e) => {
                          setFormData({ ...formData, donation_type: e.target.value });
                          if (errors.donation_type) setErrors({ ...errors, donation_type: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.donation_type ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">Select contribution type</option>
                        <option value="Learning Materials">Learning Materials</option>
                        <option value="Digital Classrooms">Digital Classrooms</option>
                        <option value="Volunteer & Mentor">Volunteer & Mentor</option>
                        <option value="Financial Support">Financial Support</option>
                        <option value="Infrastructure">Infrastructure Development</option>
                        <option value="Scholarships">Student Scholarships</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.donation_type && <p className="text-red-500 text-xs mt-1">{errors.donation_type}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-red-600" /> Additional Message
                        <span className="ml-2 text-xs font-normal text-gray-400">(optional)</span>
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white resize-none"
                        placeholder="Tell us more about your contribution plans or any questions you have"
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl">
                        Something went wrong. Please try again or contact us directly.
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red-600 hover:bg-red-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-red-200"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Interest'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={faqTitle as any} className="scroll-animate text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  ref={faq.ref as any}
                  className={`scroll-animate ${faq.delay} faq-card bg-red-50 rounded-xl p-6 border border-red-100`}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div ref={contactRef as any} className="scroll-animate mt-12 bg-gradient-to-br from-red-50 to-slate-50 rounded-2xl p-8 text-center border border-red-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h3>
              <p className="text-gray-600 mb-6">Our team is here to help you with any donation-related queries</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:donations@greenfieldhigh.edu" className="flex items-center justify-center px-6 py-3 bg-white rounded-xl shadow hover:shadow-lg transition-all border border-red-100">
                  <Mail className="w-5 h-5 mr-2 text-red-600" />
                  <span className="font-medium text-gray-900">donations@greenfieldhigh.edu</span>
                </a>
                <a href="tel:+911234567890" className="flex items-center justify-center px-6 py-3 bg-white rounded-xl shadow hover:shadow-lg transition-all border border-red-100">
                  <Phone className="w-5 h-5 mr-2 text-red-600" />
                  <span className="font-medium text-gray-900">+91 9657630464 | +91 9527794050</span>
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