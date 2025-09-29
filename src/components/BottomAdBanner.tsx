import React, { useEffect, useRef } from 'react';
import AdSense from 'react-adsense';
import { ExternalLink, Sparkles } from 'lucide-react';

const BottomAdBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  // Ensure page content has enough bottom padding to avoid overlap with the fixed banner
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const updatePadding = () => {
      const height = el.offsetHeight;
      // Apply padding to the body to create safe area for the fixed bottom banner
      document.body.style.paddingBottom = `${height}px`;
    };

    updatePadding();

    // Observe size changes (responsive or content changes) and update padding accordingly
    const ro = new ResizeObserver(updatePadding);
    ro.observe(el);

    // Clean up on unmount
    return () => {
      ro.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, []);

  return (
    <div ref={bannerRef} className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl">
      <AdSense.Google
        client='ca-pub-XXXXXXXXXXXXXXXX' // Replace with your AdSense client ID
        slot='XXXXXXXXXX' // Replace with your AdSense ad slot ID
        style={{ display: 'block', width: '100%', height: 'auto' }}
        format='auto'
        responsive='true'
      />
    </div>
  );
};

export default BottomAdBanner;