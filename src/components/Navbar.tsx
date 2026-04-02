import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Languages } from 'lucide-react';

// ── Google Translate trigger hook ──
function useGoogleTranslate() {
  const [isMarathi, setIsMarathi] = useState(() => {
    return localStorage.getItem('lang') === 'mr';
  });

  useEffect(() => {
    if (localStorage.getItem('lang') === 'mr') {
      const tryTranslate = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select) {
          select.value = 'mr';
          select.dispatchEvent(new Event('change'));
        } else {
          setTimeout(tryTranslate, 300);
        }
      };
      setTimeout(tryTranslate, 800);
    }
  }, []);

  const toggle = () => {
    if (isMarathi) {
      localStorage.setItem('lang', 'en');
      setIsMarathi(false);
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${location.hostname}`;
      window.location.reload();
    } else {
      localStorage.setItem('lang', 'mr');
      setIsMarathi(true);
      const tryTranslate = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select) {
          select.value = 'mr';
          select.dispatchEvent(new Event('change'));
        } else {
          setTimeout(tryTranslate, 300);
        }
      };
      tryTranslate();
    }
  };

  return { isMarathi, toggle };
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const { isMarathi, toggle } = useGoogleTranslate();

  // ── Scroll handler: navbar shadow + active section detection ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname !== '/') {
        setActiveSection(null);
        return;
      }

      const sections = ['achievements', 'activities', 'contact'];
      let current: string | null = null;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // ── Close mobile menu + reset active section on route change ──
  useEffect(() => {
    setIsOpen(false);
    setActiveSection(null);
  }, [location]);

  // ── After navigating to home, scroll to stored section ──
  useEffect(() => {
    const id = sessionStorage.getItem('scrollTo');
    if (id) {
      sessionStorage.removeItem('scrollTo');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const top = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location]);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollTo', id);
      window.location.href = '/';
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  // ── Active link logic (Home unhighlights when a section is active) ──
  const isLinkActive = (link: { path?: string; section?: string }) => {
    if (link.path) {
      if (link.path === '/' && activeSection !== null) return false;
      return location.pathname === link.path;
    }
    if (link.section) {
      return activeSection === link.section;
    }
    return false;
  };

  const navLinks = [
    { name: 'Home',         path: '/' },
    { name: 'About',        path: '/about' },
    { name: 'Achievements', section: 'achievements' },
    { name: 'Activities',   section: 'activities' },
    { name: 'Admission',    path: '/admission' },
    { name: 'Donate',       path: '/donate' },
    { name: 'Contact',      section: 'contact' },
  ];

  const TranslateButton = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 font-medium transition-all duration-200 border rounded-lg
        ${isMarathi
          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
          : 'text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-600'
        }
        ${mobile ? 'w-full px-4 py-3 text-sm' : 'px-3 py-1.5 text-sm ml-2'}
      `}
    >
      <Languages className="w-4 h-4" />
      <span className="notranslate" translate="no">
        {isMarathi ? 'English' : 'मराठी'}
      </span>
    </button>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link to="/mainlogo.jpeg" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-gray-900">
                Manpadle Highschool Manpadle
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                Excellence in Education
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.path ? (
                  <Link
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isLinkActive(link)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(link.section!)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isLinkActive(link)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
            <TranslateButton />
          </div>

          {/* Mobile: translate + hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggle}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border transition-all
                ${isMarathi
                  ? 'bg-red-600 text-white border-red-600'
                  : 'text-gray-700 border-gray-300 hover:text-red-600 hover:border-red-600'
                }`}
            >
              <Languages className="w-3 h-3" />
              <span className="notranslate" translate="no">
                {isMarathi ? 'ENG' : 'मराठी'}
              </span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-red-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white border-t border-gray-100`}>
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.path ? (
                <Link
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isLinkActive(link)
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  onClick={() => scrollToSection(link.section!)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isLinkActive(link)
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {link.name}
                </button>
              )}
            </div>
          ))}
          <TranslateButton mobile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;