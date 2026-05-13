import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{t('footer.school_name')}</h3>
                <p className="text-xs text-gray-400">{t('footer.excellence')}</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              {t('footer.about_text')}
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h4 className="text-white font-semibold mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-400 transition-colors">{t('navbar.home')}</Link></li>
              <li><Link to="/about" className="hover:text-red-400 transition-colors">{t('navbar.about')}</Link></li>
              <li><button onClick={() => scrollToSection('achievements')} className="hover:text-red-400 transition-colors">{t('navbar.achievements')}</button></li>
              <li><button onClick={() => scrollToSection('activities')} className="hover:text-red-400 transition-colors">{t('navbar.activities')}</button></li>
              <li><Link to="/admission" className="hover:text-red-400 transition-colors">{t('navbar.admission')}</Link></li>
              <li><Link to="/donate" className="hover:text-red-400 transition-colors">{t('navbar.donate')}</Link></li>
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact_info')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>+91 7588869700 | +91 9657630464</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h4 className="text-white font-semibold mb-4">{t('footer.location')}</h4>
            <div className="rounded-lg overflow-hidden h-40 bg-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.960597446557!2d74.22967877412803!3d16.82831071867229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc10791ab5931cb%3A0x176a8a1c030ebb6f!2sManpadle%20Highschool%2C%20Manpadle!5e0!3m2!1sen!2sin!4v1778676872130!5m2!1sen!2sin"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} {t('footer.school_name')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;