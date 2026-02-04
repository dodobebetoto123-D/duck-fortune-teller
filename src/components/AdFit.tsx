import React, { useEffect, useRef } from 'react';

interface AdFitProps {
  adUnit: string;
  adWidth: string;
  adHeight: string;
}

const AdFit: React.FC<AdFitProps> = ({ adUnit, adWidth, adHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) return;

    const container = containerRef.current;
    if (!container) return;

    // Create the <ins> tag for the ad
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.dataset.adUnit = adUnit;
    ins.dataset.adWidth = adWidth;
    ins.dataset.adHeight = adHeight;
    
    // Add the <ins> tag to the container
    container.appendChild(ins);

    // Create and load the AdFit script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    
    // Add the script to the container
    container.appendChild(script);

    isAdLoaded.current = true;

  }, [adUnit, adWidth, adHeight]);

  return <div ref={containerRef} style={{ width: adWidth + 'px', height: adHeight + 'px' }} />;
};

export default AdFit;
