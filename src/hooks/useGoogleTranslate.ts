import { useState, useEffect } from 'react';

export function useGoogleTranslate() {
  const [isMarathi, setIsMarathi] = useState(() => {
    return localStorage.getItem('lang') === 'mr';
  });

  useEffect(() => {
    // If page loads and lang was marathi, re-apply translation
    if (localStorage.getItem('lang') === 'mr') {
      setTimeout(() => triggerTranslate('mr'), 800);
    }
  }, []);

  const triggerTranslate = (lang: string) => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  const toggle = () => {
    if (isMarathi) {
      // Switch back to English
      localStorage.setItem('lang', 'en');
      setIsMarathi(false);
      // Google Translate restore
      const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
      if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
        const restoreBtn = innerDoc?.querySelector('.goog-te-banner-content span') as HTMLElement;
        restoreBtn?.click();
      }
      // Fallback: reload with no translation cookie
      const cookie = document.cookie.match(/googtrans=([^;]+)/);
      if (cookie) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
      }
      window.location.reload();
    } else {
      // Switch to Marathi
      localStorage.setItem('lang', 'mr');
      setIsMarathi(true);
      setTimeout(() => triggerTranslate('mr'), 300);
    }
  };

  return { isMarathi, toggle };
}