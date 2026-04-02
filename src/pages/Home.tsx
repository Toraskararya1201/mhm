import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/* ─── tiny hook: triggers CSS class when element enters viewport ─── */
function useReveal(options = {}) {
  const ref = useRef(null);
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
function AutoReset({ onReset }) {
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
      Form will reset in{' '}
      <span className="text-red-500 font-bold">{seconds}</span>s —{' '}
      <button onClick={() => onResetRef.current()} className="text-red-600 underline hover:text-red-800 font-medium">
        reset now
      </button>
    </p>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const contactRef = useScrollAnimation();

  const achievements = [
  { image: '/achieve.jpeg',  title: 'NAFED Agriculture Pledge',   description: 'Certified by NAFED & MyGov for supporting Cooperative Agriculture — January 2026' },
  { image: '/achieve1.jpeg', title: 'Javelin Champion',           description: 'Student Sanikumar Sav won 2nd place at taluka-level Javelin competition, featured in Dainik Sakal & Pudhari' },
  { image: '/achieve2.jpeg', title: 'Hindi Olympiad Excellence',  description: 'Students excelled in national Hindi Olympiad, proving rural students compete at par with city schools' },
  { image: '/achieve3.jpeg', title: 'Blood Donation Pledge',      description: 'Certified by NBTC & Ministry of Health for promoting voluntary blood donation culture' },
  { image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Leadership Program',  description: "Developing tomorrow's leaders through quality education" },
  { image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Community Impact',   description: 'Active social responsibility and community outreach initiatives' },
];

  const activities = [
  { image: '/activity.jpeg',  title: 'Best from Waste',       description: 'Students crafted creative objects from waste, showcasing innovation and environmental responsibility' },
  { image: '/activity2.jpeg', title: 'Health & Medical Camp', description: 'Free medical checkup camp organized for all students by visiting healthcare professionals' },
  { image: '/activity3.jpeg', title: 'Constitution Day — Art',description: 'Drawing competition celebrating भारतीय संविधान दिन with student artwork on national themes' },
  { image: '/activity4.jpeg', title: 'Constitution Day Speech',description: 'Students delivered speeches and cultural performances on भारतीय संविधान दिन, 26 November 2025' },
  { image: 'https://images.pexels.com/photos/5582863/pexels-photo-5582863.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Art & Creativity',      description: 'Students express creativity through art, craft and cultural activities' },
  { image: 'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Music & Performances', description: 'Annual talent showcases and cultural performances by students' },
];

  const admissionSteps = [
    { number: '01', title: 'Application Form',        description: 'Fill out the online admission form with required details',    icon: BookOpen },
    { number: '02', title: 'Document Verification',   description: 'Submit and verify all necessary documents',                   icon: CheckCircle },
    { number: '03', title: 'Enrollment Confirmation', description: 'Complete payment and receive admission confirmation',         icon: Award },
  ];

  const aboutRef      = useReveal();
  const admissionRef  = useReveal();
  const achieveRef    = useReveal();
  const activitiesRef = useReveal();
  const ctaRef        = useReveal();

  const [formData, setFormData] = useState({ student_name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setFormData({ student_name: '', email: '', phone: '', message: '' });
    setErrors({});
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.student_name.trim() || formData.student_name.trim().length < 2)
      newErrors.student_name = 'Please enter a valid full name (at least 2 characters).';
    else if (/[0-9]/.test(formData.student_name))
      newErrors.student_name = 'Name cannot contain numbers.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address.';
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    if (!formData.message.trim() || formData.message.trim().length < 10)
      newErrors.message = 'Please enter a message (at least 10 characters).';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('enquiry').insert([formData]);
      if (error) throw error;
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

        @keyframes scrollLeft  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes scrollRight { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .scroll-left  { display:flex; width:max-content; animation:scrollLeft  28s linear infinite; }
        .scroll-right { display:flex; width:max-content; animation:scrollRight 28s linear infinite; }
        .scroll-left:hover, .scroll-right:hover { animation-play-state:paused; }

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

      <div className="min-h-screen">
        <div style={{ background: 'linear-gradient(to bottom, #fffaf5 0%, #fff7f0 40%, #fff4eb 70%, #fff1e6 100%)' }}>

          {/* ── HERO ── */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/school.jpeg"
                alt="School Building"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-800/10"></div>
            </div>
            <div className="float-a absolute top-24 left-12 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none"></div>
            <div className="float-b absolute bottom-32 right-16 w-48 h-48 rounded-full bg-red-300/10 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
              <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                Welcome to Manpadle Highschool, Manpadle
              </h1>
<p className="hero-sub text-xl md:text-2xl mb-8 text-red-100">
  <b>न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।</b> <br />
  <b>Our goal is to nurture students into cultured, value-driven, and exemplary personalities.</b>
</p>

              <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/admission')}>
                  Apply for Admission
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/donate')}
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:border-white hover:text-white"
                >
                  Support Our Mission
                </Button>
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section className="py-12">
            <div ref={aboutRef} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <div className="relative mb-2">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-6 left-1/2 -translate-x-1/2 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #fddcb5', color: 'transparent' }}
                  >
                    About Us
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase bg-red-100 text-red-600 px-4 py-1.5 rounded-full mb-5">
                    Who We Are
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  About Manpadle Highschool
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Welcome to <b>Manpadle Highschool</b> — a place where every child is known, cared for, and encouraged to do their best. Manpadale Highschool was started to give good education to children  in our village and nearby areas. Our school runs from Class 5 to 10  and is managed by <b>Late Buvasaheb Patil Shikshan Prasarak Mandal</b>,  Manpadale and awarded with the <b>Dalit Mitra Puraskar</b>. We believe every child deserves a chance to study. That is why we  provide <b>free admission</b>, <b>free uniform</b>, and <b>free books</b> to all students.  Our teachers work hard every day to help each child grow and succeed. here change the starting</p>
                <div className="grow-line h-0.5 bg-red-200 mx-auto mb-8 rounded-full"></div>
                <Button onClick={() => navigate('/about')} variant="outline">
                  Know More About Us
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* ── ADMISSION PROCESS ── */}
          <section id="admission" className="py-12 relative overflow-hidden">
            <div className="float-a absolute -top-16 -right-16 w-72 h-72 rounded-full border-[50px] border-red-100/25 pointer-events-none"></div>
            <div className="float-b absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[40px] border-orange-100/25 pointer-events-none"></div>
            <div ref={admissionRef} className="stagger max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <div className="relative mb-2">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-6 left-1/2 -translate-x-1/2 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #fddcb5', color: 'transparent' }}
                  >
                    Admission
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase bg-red-100 text-red-600 px-4 py-1.5 rounded-full mb-4">
                    How to Join
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Admission <span className="text-red-600">Process</span>
                </h2>
                <p className="text-gray-500 text-base max-w-xl mx-auto mb-4">
                  Three simple steps to become part of our community
                </p>
                <div className="grow-line h-1 bg-red-600 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
                {admissionSteps.map((step, index) => (
                  <div key={index} className="group relative flex">
                    <div className="card-hover relative rounded-2xl p-5 border-2 border-orange-100 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-red-300 hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-300 text-center flex flex-col items-center w-full">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        {step.number}
                      </div>
                      <div className="mt-4 mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1">{step.description}</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-1 bg-red-600 rounded-full transition-all duration-500"></div>
                    </div>
                    {index < admissionSteps.length - 1 && (
                      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 z-10 items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white shadow-md">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate('/admission')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Start Your Application
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-white">

          {/* ── ACHIEVEMENTS — image cards scrolling LEFT ── */}
          <section id="achievements" className="py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={achieveRef} className="reveal-left mb-10 flex flex-col items-start">
                <div className="relative mb-1">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-5 left-0 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #fecaca', color: 'transparent' }}
                  >
                    Success
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase bg-red-100 text-red-600 px-4 py-1.5 rounded-full mb-4">
                    Recognition
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Our <span className="text-red-600">Achievements</span>
                </h2>
                <div className="grow-line h-1 bg-red-600 rounded-full mt-2"></div>
              </div>
              <div className="overflow-hidden">
                <div className="scroll-left py-4" style={{ gap: '1.5rem' }}>
                  {[...achievements, ...achievements].map((achievement, index) => (
                    <div
                      key={index}
                      className="card-hover w-[260px] flex-shrink-0 group relative overflow-hidden rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-lg hover:shadow-red-50"
                      style={{ marginRight: '1.5rem' }}
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
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── ACTIVITIES — heading RIGHT ── */}
          <section id="activities" className="py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={activitiesRef} className="reveal-right mb-10 flex flex-col items-end text-right">
                <div className="relative mb-1 self-end">
                  <span
                    className="text-7xl md:text-8xl font-black absolute -top-5 right-0 uppercase select-none pointer-events-none whitespace-nowrap"
                    style={{ WebkitTextStroke: '1.5px #fecaca', color: 'transparent' }}
                  >
                    Campus
                  </span>
                  <span className="pop-in relative inline-block text-xs font-semibold tracking-widest uppercase bg-red-100 text-red-600 px-4 py-1.5 rounded-full mb-4">
                    Campus Life
                  </span>
                </div>
                <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Activities & <span className="text-red-600">Facilities</span>
                </h2>
                <div className="grow-line h-1 bg-red-600 rounded-full mt-2"></div>
              </div>
              <div className="overflow-hidden">
                <div className="scroll-right py-4" style={{ gap: '1.5rem' }}>
                  {[...activities, ...activities].map((activity, index) => (
                    <div
                      key={index}
                      className="card-hover w-[260px] flex-shrink-0 group relative overflow-hidden rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-lg hover:shadow-red-50"
                      style={{ marginRight: '1.5rem' }}
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
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"></div>
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
                <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-red-100 text-red-600 px-4 py-1.5 rounded-full mb-4">
                  Get In Touch
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get In Touch
                </h2>
                <p className="text-lg text-gray-500">
                  Have questions? We're here to help!
                </p>
                <div className="grow-line h-1 bg-red-600 mx-auto rounded-full mt-4"></div>
              </div>
              <div className="bg-red-50 rounded-3xl shadow-2xl p-8 border border-gray-100">
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm" style={{ animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both' }}>
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 text-base">Your message has been received. We'll get back to you soon.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      For urgent enquiries, call us at{' '}
                      <a href="tel:+911234567890" className="text-red-600 font-semibold hover:underline">+91 12345 67890</a>{' '}
                      or email{' '}
                      <a href="mailto:admissions@greenfieldhigh.com" className="text-red-600 font-semibold hover:underline">admissions@greenfieldhigh.com</a>
                    </p>
                    <AutoReset key={resetKey} onReset={handleReset} />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Home;