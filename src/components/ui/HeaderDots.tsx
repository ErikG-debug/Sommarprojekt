const W = 1440;
const H = 72;

export function HeaderDots() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="g-l" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
          gradientTransform="translate(160 36) scale(590 36)">
          <stop offset="0%"   stopColor="#0b4e87" stopOpacity="1"   />
          <stop offset="28%"  stopColor="#1a7bc4" stopOpacity="1"   />
          <stop offset="58%"  stopColor="#5ab0de" stopOpacity="0.65"/>
          <stop offset="80%"  stopColor="#1a6ba8" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#1a6ba8" stopOpacity="0"   />
        </radialGradient>

        <radialGradient id="g-r" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
          gradientTransform="translate(1249 36) scale(630 40)">
          <stop offset="0%"   stopColor="#0b4e87" stopOpacity="1"   />
          <stop offset="28%"  stopColor="#1a7bc4" stopOpacity="1"   />
          <stop offset="58%"  stopColor="#5ab0de" stopOpacity="0.65"/>
          <stop offset="80%"  stopColor="#1a6ba8" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#1a6ba8" stopOpacity="0"   />
        </radialGradient>

        {/*
          Flerskiktad thermal displacement — exakt som en värmekamera:
          Lager 1 (grov): stora flödesmönster som termisk konvektion (~50px)
          Lager 2 (medel): ytvariation och struktur (~25px)
          Lager 3 (fin):   sensor-grain (~1px)
          Enbart feDisplacementMap = inga färgändringar = noll grå.
        */}
        <filter id="thermo" x="-10%" y="-100%" width="120%" height="300%">
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.005"
            numOctaves="5" seed="5" result="coarse" />
          <feDisplacementMap in="SourceGraphic" in2="coarse"
            scale="55" xChannelSelector="R" yChannelSelector="G" result="w1" />

          <feTurbulence type="fractalNoise" baseFrequency="0.038 0.028"
            numOctaves="4" seed="11" result="mid" />
          <feDisplacementMap in="w1" in2="mid"
            scale="16" xChannelSelector="R" yChannelSelector="G" result="w2" />

          <feTurbulence type="fractalNoise" baseFrequency="0.78 0.78"
            numOctaves="2" seed="3" result="fine" />
          <feDisplacementMap in="w2" in2="fine"
            scale="4" xChannelSelector="R" yChannelSelector="G" result="w3" />

          <feGaussianBlur in="w3" stdDeviation="2.2 1.6" />
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#g-l)" filter="url(#thermo)" />
      <rect width={W} height={H} fill="url(#g-r)" filter="url(#thermo)" />
    </svg>
  );
}
