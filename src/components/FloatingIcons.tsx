import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloatingIcons = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const icons = [
    {
      icon: Phone,
      title: t('floating_icons.phone'),
      href: 'tel:+15551234567',
      bg: 'bg-red-600',
      delay: 100,
    },
    {
      icon: MessageCircle,
      title: t('floating_icons.whatsapp'),
      href: 'https://wa.me/15551234567',
      bg: 'bg-green-600',
      delay: 150,
    },
    {
      icon: Instagram,
      title: t('floating_icons.instagram'),
      href: 'https://instagram.com/manpadale',
      bg: 'bg-pink-600',
      delay: 200,
    },
  ];

  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-4 z-40">
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          title={item.title}
          target={item.href.startsWith('tel:') ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className={`floating-icon ${item.bg} ${
            visible ? 'animate-float' : 'opacity-0'
          }`}
          style={{
            animationDelay: `${item.delay}ms`,
          }}
        >
          <item.icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
};

export default FloatingIcons;