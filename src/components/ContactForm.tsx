import { useState, FormEvent } from 'react';
import Button from './Button';
import { Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Backend integration reserved: This section will handle form submission to store user queries in Supabase database
      const { error } = await supabase.from('enquiry').insert([{
  student_name: formData.name,
  email: formData.email,
  message: formData.message,
}]);
if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-8 animate-slide-up">
      {submitStatus === 'success' ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4 animate-zoom-in">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact_form.success_title')}</h3>
          <p className="text-gray-600">
            {t('contact_form.success_msg')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-red-600" />
              {t('contact_form.name')}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
              placeholder={t('contact_form.name')}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2 text-red-600" />
              {t('contact_form.email')}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
              placeholder={t('contact_form.email')}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 mr-2 text-red-600" />
              {t('contact_form.message')}
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: '' });
              }}
              rows={5}
              className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none`}
              placeholder={t('contact_form.message')}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {t('contact_form.error')}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t('contact_form.sending') : t('contact_form.send')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
