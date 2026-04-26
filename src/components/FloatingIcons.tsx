import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloatingIcons = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const icons = [
    {
      icon: Phone,
      title: t('floating_icons.phone'),
      href: 'tel:+917588869700',
      bg: 'bg-red-600 hover:bg-red-700',
    },
    {
      icon: MessageCircle,
      title: t('floating_icons.whatsapp'),
      href: 'https://whatsapp.com/channel/0029VaMpijgGzzKU3IMOIi2i',
      bg: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Instagram,
      title: t('floating_icons.instagram'),
      href: 'https://www.instagram.com/edu_mhm?igsh=MTE3N2poeTBqbGZrNg==',
      bg: 'bg-pink-600 hover:bg-pink-700',
    },
  ];

  return (
    <div
      className="fixed right-4 bottom-6 flex flex-col gap-3 z-[9999]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          title={item.title}
          target={item.href.startsWith('tel:') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white transition-all duration-300 active:scale-90 ${item.bg} ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: `${index * 75}ms` }}
        >
          <item.icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
};

export default FloatingIcons;