import React from 'react';

interface Weather3DIconProps {
  conditionCode?: number;
  group?: 'clear' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
  isDay?: boolean;
  className?: string;
}

export const Weather3DIcon: React.FC<Weather3DIconProps> = ({
  group = 'cloud',
  isDay = true,
  className = 'h-14 w-14',
}) => {
  if (group === 'clear') {
    if (!isDay) {
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fff8e7" />
              <stop offset="60%" stopColor="#f4e0a5" />
              <stop offset="100%" stopColor="#d8b456" />
            </radialGradient>
            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M38 12C26.954 12 18 20.954 18 32C18 43.046 26.954 52 38 52C42.27 52 46.21 50.66 49.44 48.38C42.3 47.1 36.88 40.88 36.88 33.36C36.88 25.1 43.18 18.28 51.18 17.5C47.46 14.07 42.48 12 38 12Z"
            fill="url(#moonGrad)"
            filter="url(#moonGlow)"
          />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff6b3" />
            <stop offset="40%" stopColor="#ffb938" />
            <stop offset="90%" stopColor="#f58220" />
            <stop offset="100%" stopColor="#d96b14" />
          </radialGradient>
          <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="32" cy="32" r="18" fill="url(#sunGrad)" filter="url(#sunGlow)" />
        {/* Soft sun rays */}
        <g stroke="#ffb938" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <line x1="32" y1="6" x2="32" y2="10" />
          <line x1="32" y1="54" x2="32" y2="58" />
          <line x1="6" y1="32" x2="10" y2="32" />
          <line x1="54" y1="32" x2="58" y2="32" />
          <line x1="14" y1="14" x2="17" y2="17" />
          <line x1="47" y1="47" x2="50" y2="50" />
          <line x1="14" y1="50" x2="17" y2="47" />
          <line x1="47" y1="17" x2="50" y2="14" />
        </g>
      </svg>
    );
  }

  if (group === 'rain' || group === 'drizzle') {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rainCloudGrad" cx="40%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#e2e8f0" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>
          <filter id="rainCloudShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.3" />
          </filter>
          <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path
          d="M45.5 35C49.64 35 53 31.64 53 27.5C53 23.58 49.99 20.37 46.16 20.03C44.82 14.28 39.67 10 33.5 10C26.36 10 20.47 15.34 19.64 22.31C15.93 22.95 13 26.17 13 30.07C13 34.45 16.55 38 20.93 38H45.5C49.64 38 53 34.64 53 30.5"
          fill="url(#rainCloudGrad)"
          filter="url(#rainCloudShadow)"
        />
        {/* Drops */}
        <g fill="url(#dropGrad)">
          <path d="M22 43C22 43 20 46.5 20 48C20 49.1 20.9 50 22 50C23.1 50 24 49.1 24 48C24 46.5 22 43 22 43Z" />
          <path d="M32 45C32 45 30 48.5 30 50C30 51.1 30.9 52 32 52C33.1 52 34 51.1 34 50C34 48.5 32 45 32 45Z" />
          <path d="M42 43C42 43 40 46.5 40 48C40 49.1 40.9 50 42 50C43.1 50 44 49.1 44 48C44 46.5 42 43 42 43Z" />
        </g>
      </svg>
    );
  }

  if (group === 'storm') {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="stormCloudGrad" cx="35%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>
          <filter id="stormShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.4" />
          </filter>
        </defs>
        <path
          d="M45.5 33C49.64 33 53 29.64 53 25.5C53 21.58 49.99 18.37 46.16 18.03C44.82 12.28 39.67 8 33.5 8C26.36 8 20.47 13.34 19.64 20.31C15.93 20.95 13 24.17 13 28.07C13 32.45 16.55 36 20.93 36H45.5"
          fill="url(#stormCloudGrad)"
          filter="url(#stormShadow)"
        />
        {/* Lightning bolt */}
        <path
          d="M33 34L26 45H32L29 56L40 43H33L36 34H33Z"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default: Realistic 3D Cloud matching the uploaded screenshot
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Ambient soft shadow */}
        <filter id="cloud3DShadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        
        {/* Primary soft white-to-light-grey 3D cloud radial gradient */}
        <radialGradient id="cloudMainGrad" cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f1f5f9" />
          <stop offset="85%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>

        {/* Specular highlight */}
        <radialGradient id="cloudHighlight" cx="35%" cy="25%" r="45%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Bottom ambient occlusion */}
        <linearGradient id="cloudBottomShade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0" />
          <stop offset="100%" stopColor="#64748b" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Main 3D Cloud Body */}
      <g filter="url(#cloud3DShadow)">
        {/* Base composite cloud silhouette with realistic 3D volumetric curves */}
        <path
          d="M44.5 44C49.1944 44 53 40.1944 53 35.5C53 31.0664 49.6056 27.4265 45.2787 27.0394C44.1524 20.3526 38.3582 15.25 31.25 15.25C23.5137 15.25 17.1517 21.0963 16.3456 28.6669C12.7816 29.5668 10 32.7836 10 36.625C10 41.2504 13.7496 45 18.375 45H44.5C49.1944 45 53 41.1944 53 36.5"
          fill="url(#cloudMainGrad)"
        />
        {/* Soft bottom occlusion */}
        <path
          d="M44.5 44C49.1944 44 53 40.1944 53 35.5C53 31.0664 49.6056 27.4265 45.2787 27.0394C44.1524 20.3526 38.3582 15.25 31.25 15.25C23.5137 15.25 17.1517 21.0963 16.3456 28.6669C12.7816 29.5668 10 32.7836 10 36.625C10 41.2504 13.7496 45 18.375 45H44.5C49.1944 45 53 41.1944 53 36.5"
          fill="url(#cloudBottomShade)"
        />
        {/* Specular top highlight */}
        <ellipse cx="31" cy="22" rx="11" ry="6" fill="url(#cloudHighlight)" />
        <ellipse cx="44" cy="32" rx="6" ry="4" fill="url(#cloudHighlight)" />
        <ellipse cx="18" cy="34" rx="5" ry="3.5" fill="url(#cloudHighlight)" />
      </g>
    </svg>
  );
};
