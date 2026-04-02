import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
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
                <h3 className="text-white font-bold text-lg">Manpadale Highschool</h3>
                <p className="text-xs text-gray-400">Excellence in Education</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              A educational institute nurturing minds and building futures where every child is known and encouraged to do their best.
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About</Link></li>
              <li><button onClick={() => scrollToSection('achievements')} className="hover:text-red-400 transition-colors">Achievements</button></li>
              <li><button onClick={() => scrollToSection('activities')} className="hover:text-red-400 transition-colors">Activities</button></li>
              <li><Link to="/admission" className="hover:text-red-400 transition-colors">Admission</Link></li>
              <li><Link to="/donate" className="hover:text-red-400 transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Manpadle–Manewadi Road, Manpadle,
Taluka Hatkanangale, District Kolhapur</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>+91 9657630464 | +91 9527794050</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>admissions@manpadale.edu.in</span>
              </li>
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
  <h4 className="text-white font-semibold mb-4">Our Location</h4>
  <div className="rounded-lg overflow-hidden h-40 bg-gray-800">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d491.8!2d74.2321883!3d16.8283375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc10791ab5931cb:0x176a8a1c030ebb6f!2sManpadle+Highschool%2C+Manpadle!5e0!3m2!1sen!2sin!4v1234567890"
      width="100%"
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
          <p>&copy; {new Date().getFullYear()} Manpadale Highschool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;