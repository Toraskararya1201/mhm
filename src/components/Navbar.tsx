import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const toggle = () => i18n.changeLanguage(isMarathi ? 'en' : 'mr');

  // ── Scroll handler: navbar shadow + active section detection ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const validPaths = ['/', '/about'];
      if (!validPaths.includes(location.pathname)) {
        setActiveSection(null);
        return;
      }

      const sections = ['achievements', 'activities', 'hostel', 'contact'];
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

  // ── After navigating to a new page, scroll to stored section ──
  // Fires on pathname change (e.g. / → /about), giving page time to render
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
      }, 600);
    }
  }, [location.pathname]); // ← key fix: was [location], now [location.pathname]

  // ── Unified scroll-to-section handler ──
  const scrollToSection = (id: string, page = '/') => {
    if (location.pathname !== page) {
      // Different page: store target and navigate, scroll fires after render
      sessionStorage.setItem('scrollTo', id);
      navigate(page);
    } else {
      // Already on the right page: scroll directly, no navigation needed
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  // ── Active link logic ──
  const isLinkActive = (link: { path?: string; section?: string; page?: string }) => {
    if (link.path) {
  if (link.path === '/' && activeSection !== null) return false;
  if (link.path === '/about' && activeSection !== null) return false;
  return location.pathname === link.path;
}
    if (link.section) {
      return location.pathname === (link.page ?? '/') && activeSection === link.section;
    }
    return false;
  };

  const navLinks = [
    { name: t('navbar.home'),         path: '/' },
    { name: t('navbar.about'),        path: '/about' },
    { name: t('navbar.achievements'), section: 'achievements' },
    { name: t('navbar.activities'),   section: 'activities' },
    { name: t('navbar.hostel'),       section: 'hostel', page: '/about' },
    { name: t('navbar.admission'),    path: '/admission' },
    { name: t('navbar.donate'),       path: '/donate' },
    { name: t('navbar.contact'),      section: 'contact' },
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
      <span>{isMarathi ? 'English' : 'मराठी'}</span>
    </button>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            className="flex items-center space-x-3 group"
          >
            <img
              src="/mainlogo.jpeg"
              alt="School Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-gray-900">
                {t('navbar.school_name')}
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                {t('footer.excellence')}
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
    onClick={() => { if (link.path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                    onClick={() => scrollToSection(link.section!, link.page ?? '/')}
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
              <span>{isMarathi ? 'ENG' : 'मराठी'}</span>
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
    onClick={() => { if (link.path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                  onClick={() => scrollToSection(link.section!, link.page ?? '/')}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;