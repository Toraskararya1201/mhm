import { useState, FormEvent, useEffect, useRef } from 'react';
import { Calendar, FileText, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
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

// ── Auto-reset countdown after success ──────────────────────────
function AutoReset({ onReset }: { onReset: () => void }) {
  const [seconds, setSeconds] = useState(10);
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  useEffect(() => {
    if (seconds <= 0) {
      onResetRef.current();
      return;
    }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <p className="text-gray-400 text-xs mt-6">
      Form will reset in{' '}
      <span className="text-red-500 font-bold">{seconds}</span>s —{' '}
      <button
        onClick={() => onResetRef.current()}
        className="text-red-600 underline hover:text-red-800 font-medium"
      >
        reset now
      </button>
    </p>
  );
}

const Admission = () => {
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const overviewRef  = useScrollAnimation();
  const docsRef      = useScrollAnimation();
  const datesRef     = useScrollAnimation();
  const processTitle = useScrollAnimation();
  const step1Ref     = useScrollAnimation();
  const step2Ref     = useScrollAnimation();
  const step3Ref     = useScrollAnimation();
  const formRef      = useScrollAnimation();

  const handleReset = () => {
    setFormData({ student_name: '', email: '', phone: '', message: '' });
    setErrors({});
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.student_name.trim() || formData.student_name.trim().length < 2) {
      newErrors.student_name = "Please enter a valid full name (at least 2 characters).";
    } else if (/[0-9]/.test(formData.student_name)) {
      newErrors.student_name = "Name cannot contain numbers.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please enter a message (at least 10 characters).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('enquiry').insert([formData]);
      if (error) throw error;
      setResetKey(k => k + 1);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: FileText, title: 'Fill Application Form', description: 'Complete the online admission form with accurate information.', ref: step1Ref },
    { icon: CheckCircle, title: 'Document Verification', description: 'Submit required documents including birth certificate and records.', ref: step2Ref },
    { icon: MessageSquare, title: 'Enrollment Confirmation', description: 'Complete formalities and receive your confirmation.', ref: step3Ref },
  ];

  const requirements = [
    'Birth Certificate (Original and photocopy)',
    'Transfer Certificate from previous school',
    'Academic records of last 2 years',
    'Recent passport-size photographs',
    'Address proof (Utility bill/Aadhar)',
  ];

  const importantDates = [
    { event: 'Admission Opens', date: 'January 15, 2024' },
    { event: 'Application Deadline', date: 'March 31, 2024' },
    { event: 'Entrance Test', date: 'April 10-15, 2024' },
    { event: 'Results Announcement', date: 'April 25, 2024' },
    { event: 'Admission Confirmation', date: 'May 1-15, 2024' },
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
        .scroll-zoom {
          opacity: 0;
          transform: scale(0.92);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .scroll-zoom.animate-in-view {
          opacity: 1;
          transform: scale(1);
        }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
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
        .hero-title { animation: fadeSlideDown 0.8s ease both; }
        .hero-sub   { animation: fadeSlideUp 0.8s 0.25s ease both; }
        .pulse-blob { animation: pulseSlow 4s infinite; }
        .success-icon { animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }
        .list-item {
          opacity: 0;
          transform: translateX(-16px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .animate-in-view .list-item { opacity: 1; transform: translateX(0); }
        .animate-in-view .list-item:nth-child(1) { transition-delay: 0.05s; }
        .animate-in-view .list-item:nth-child(2) { transition-delay: 0.15s; }
        .animate-in-view .list-item:nth-child(3) { transition-delay: 0.25s; }
        .animate-in-view .list-item:nth-child(4) { transition-delay: 0.35s; }
        .animate-in-view .list-item:nth-child(5) { transition-delay: 0.45s; }

        /* ── Process card hover effects ── */
        .process-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease;
        }
        .process-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(220,38,38,0.02) 100%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .process-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 24px 48px -8px rgba(220,38,38,0.18), 0 8px 16px -4px rgba(0,0,0,0.08);
          background-color: #fff7f7;
        }
        .process-card:hover::before {
          opacity: 1;
        }
        .process-card .card-icon-wrap {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .process-card:hover .card-icon-wrap {
          transform: scale(1.18) rotate(-6deg);
          background-color: #b91c1c;
          box-shadow: 0 8px 20px rgba(185,28,28,0.35);
        }
        .process-card .card-number {
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .process-card:hover .card-number {
          color: #fecaca;
          transform: scale(1.1);
        }
        .process-card .card-title {
          transition: color 0.3s ease;
        }
        .process-card:hover .card-title {
          color: #dc2626;
        }
        .process-card .card-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 4px;
          background: linear-gradient(90deg, #dc2626, #f87171);
          border-radius: 0 0 0.75rem 0.75rem;
          transition: width 0.4s ease;
        }
        .process-card:hover .card-bottom-bar {
          width: 100%;
        }
      `}</style>

      <div className="min-h-screen pt-20 bg-slate-50">

        {/* 1. HERO */}
        <section className="relative py-20 bg-gradient-to-br from-red-700 to-red-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 hero-title">Admissions 2024-25</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto hero-sub">
              Begin your educational journey with Greenfield High School
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pulse-blob"></div>
        </section>

        {/* 2. OVERVIEW */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div ref={overviewRef as any} className="scroll-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">Admission Overview</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Greenfield High School welcomes applications from students seeking admission. Our process is designed to be transparent, fair, and inclusive.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We assess students based on their academic potential and alignment with our school's values.
                </p>
              </div>
              <div className="scroll-zoom animate-in-view relative">
                <div className="absolute -inset-4 bg-red-100 rounded-2xl transform rotate-3 -z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef1460370e?auto=format&fit=crop&q=80&w=800"
                  alt="Students"
                  className="rounded-2xl shadow-2xl border-4 border-white object-cover h-80 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div ref={docsRef as any} className="scroll-left bg-red-50 rounded-2xl p-8 border border-red-100 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-red-600" /> Required Documents
                </h3>
                <ul className="space-y-3">
                  {requirements.map((req, i) => (
                    <li key={i} className="list-item flex items-start text-gray-700">
                      <CheckCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" /> {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div ref={datesRef as any} className="scroll-right bg-[#FDFCF6] rounded-2xl p-8 border border-red-100 shadow-sm">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-red-600" /> Important Dates
                </h3>
                <ul className="space-y-5">
                  {importantDates.map((item, i) => (
                    <li key={i} className="list-item border-l-4 border-red-600 pl-4 transition-transform hover:translate-x-1">
                      <p className="font-bold text-black text-lg">{item.event}</p>
                      <p className="text-sm text-gray-800 font-medium mt-1">{item.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. APPLICATION PROCESS */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={processTitle as any} className="scroll-animate text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Application Process</h2>
              <p className="text-gray-600">Follow these three steps to secure enrollment</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={step.ref as any}
                  className={`process-card scroll-animate delay-${(index + 1) * 100} bg-white rounded-xl p-8 shadow-md h-full flex flex-col`}
                >
                  {/* Animated bottom bar */}
                  <div className="card-bottom-bar"></div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="card-number text-4xl font-bold text-red-50 inline-block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="card-icon-wrap bg-red-600 p-3 rounded-full">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="card-title text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ENQUIRY FORM */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={formRef as any} className="scroll-animate">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Admission Enquiry Form</h2>
                <p className="text-gray-600">Submit your details and we will get back to you soon.</p>
              </div>
              <div className="bg-red-50 rounded-3xl shadow-2xl p-8 border border-gray-100">

                {/* SUCCESS */}
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm success-icon">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 text-base">
                      Your message has been received. We'll get back to you soon.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      For urgent enquiries, call us at{' '}
                      <a href="tel:+911234567890" className="text-red-600 font-semibold hover:underline">
                        +91 12345 67890
                      </a>{' '}
                      or email{' '}
                      <a href="mailto:admissions@greenfieldhigh.com" className="text-red-600 font-semibold hover:underline">
                        admissions@greenfieldhigh.com
                      </a>
                    </p>
                    <AutoReset key={resetKey} onReset={handleReset} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Student Name */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                          <User className="w-4 h-4 mr-2 text-red-600" /> Student Name
                        </label>
                        <input
                          type="text"
                          value={formData.student_name}
                          onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[0-9]/g, '');
                            setFormData({ ...formData, student_name: val });
                            if (errors.student_name) setErrors({ ...errors, student_name: null });
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.student_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder="Enter Full Name"
                        />
                        {errors.student_name && <p className="text-red-500 text-xs mt-1">{errors.student_name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="w-4 h-4 mr-2 text-red-600" /> Email Address
                          <span className="ml-2 text-xs font-normal text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: null });
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone */}
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
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 mr-2 text-red-600" /> Message
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: null });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder="Write your enquiry here — e.g. class applying for, any questions..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
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
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
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