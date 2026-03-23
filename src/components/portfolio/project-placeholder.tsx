interface Props {
  className?: string;
  /** Deterministic seed (e.g. project.id) picks variant + color */
  seed?: number;
}

// ── colour palettes ───────────────────────────────────────────────────────────
const PALETTES = [
  { bg1: "#f5f3ff", bg2: "#fdfcff", accent: "#7c3aed", mid: "#8b5cf6", light: "#4c1d95" }, // violet
  { bg1: "#f0f9ff", bg2: "#fbfeff", accent: "#0284c7", mid: "#0ea5e9", light: "#0c4a6e" }, // sky
  { bg1: "#f0fdf4", bg2: "#f8fefb", accent: "#059669", mid: "#10b981", light: "#064e3b" }, // emerald
  { bg1: "#fffbeb", bg2: "#fffef7", accent: "#d97706", mid: "#f59e0b", light: "#78350f" }, // amber
  { bg1: "#fff1f2", bg2: "#fff8f9", accent: "#e11d48", mid: "#f43f5e", light: "#881337" }, // rose
  { bg1: "#eef2ff", bg2: "#f7f8ff", accent: "#4338ca", mid: "#6366f1", light: "#312e81" }, // indigo
];

// ── pattern renderers ─────────────────────────────────────────────────────────
type Palette = (typeof PALETTES)[number];

/** Circuit-board grid + corner traces */
function PatternCircuit({ p, id }: { p: Palette; id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.bg1} />
          <stop offset="100%" stopColor={p.bg2} />
        </linearGradient>
        <pattern id={`${id}grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={p.accent} strokeWidth="0.6" strokeOpacity="0.22" />
        </pattern>
        <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill={`url(#${id}bg)`} />
      <rect width="800" height="450" fill={`url(#${id}grid)`} />
      <ellipse cx="400" cy="225" rx="280" ry="200" fill={`url(#${id}glow)`} />

      {/* dashed ring */}
      <circle cx="400" cy="225" r="105" stroke={p.accent} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="6 10" fill="none" />
      <circle cx="400" cy="225" r="70" stroke={p.mid} strokeOpacity="0.15" strokeWidth="0.75" fill="none" />

      {/* corner traces */}
      {([
        [[52,52],[118,52],[118,92]],
        [[748,52],[682,52],[682,92]],
        [[52,398],[118,398],[118,358]],
        [[748,398],[682,398],[682,358]],
      ] as [number,number][][]).map((pts, i) => (
        <g key={i}>
          <polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={p.accent} strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx={pts[0][0]} cy={pts[0][1]} r="3.5" fill={p.accent} fillOpacity="0.6" />
          <circle cx={pts[2][0]} cy={pts[2][1]} r="3.5" fill={p.mid}   fillOpacity="0.5" />
        </g>
      ))}

      {/* side ticks */}
      <line x1="0" y1="145" x2="55" y2="145" stroke={p.accent} strokeWidth="1" strokeOpacity="0.22" />
      <line x1="745" y1="305" x2="800" y2="305" stroke={p.accent} strokeWidth="1" strokeOpacity="0.22" />

      {/* scatter dots */}
      {[[192,158],[218,194],[162,292],[610,148],[642,182],[628,308],[308,88],[486,362]] .map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%2===0?2:1.5} fill={i%3===0?p.accent:p.mid} fillOpacity={i%2===0?0.45:0.3} />
      ))}

      {/* IC pads */}
      {[[145,202],[649,246],[308,352],[482,80]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width="6" height="6" fill={p.accent} fillOpacity="0.3"/>
      ))}

      {/* center hex */}
      <polygon points="400,174 443,198 443,252 400,276 357,252 357,198"
        fill={p.accent} fillOpacity="0.07" stroke={p.accent} strokeOpacity="0.28" strokeWidth="1" />

      {/* symbol */}
      <text x="400" y="248" textAnchor="middle"
        fontFamily="'Courier New', Courier, monospace" fontSize="64" fontWeight="700"
        fill={p.light} fillOpacity="0.88" letterSpacing="-1">{"</>"}</text>
    </>
  );
}

/** Hexagonal tile grid + curly braces */
function PatternHex({ p, id }: { p: Palette; id: string }) {
  // flat-top hexagons, 60px wide, row/col layout
  const hexPath = (cx: number, cy: number, r: number) => {
    const pts = Array.from({length:6},(_,i)=>{
      const a = (Math.PI/180)*(60*i-30);
      return `${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  };

  const hexes: [number,number,number][] = [
    // center large
    [400,225,90],
    // ring
    [400,80,45],[556,162,45],[556,288,45],[400,370,45],[244,288,45],[244,162,45],
    // outer corners
    [160,58,28],[640,58,28],[730,225,28],[640,392,28],[160,392,28],[70,225,28],
  ];

  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.bg1} />
          <stop offset="100%" stopColor={p.bg2} />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.1" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill={`url(#${id}bg)`} />
      <ellipse cx="400" cy="225" rx="320" ry="240" fill={`url(#${id}glow)`} />

      {hexes.map(([cx,cy,r],i)=>(
        <path key={i} d={hexPath(cx,cy,r)}
          fill={p.accent} fillOpacity={i===0?0.1:0.05}
          stroke={p.mid} strokeOpacity={i===0?0.35:0.18} strokeWidth={i===0?1.2:0.8} />
      ))}

      {/* corner connector lines */}
      <line x1="70" y1="225" x2="0" y2="225" stroke={p.accent} strokeOpacity="0.22" strokeWidth="1" />
      <line x1="730" y1="225" x2="800" y2="225" stroke={p.accent} strokeOpacity="0.22" strokeWidth="1" />

      {/* dots at small hex corners */}
      {[[160,58],[640,58],[730,225],[640,392],[160,392],[70,225]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill={p.mid} fillOpacity="0.5" />
      ))}

      {/* symbol */}
      <text x="400" y="248" textAnchor="middle"
        fontFamily="'Courier New', Courier, monospace" fontSize="64" fontWeight="700"
        fill={p.light} fillOpacity="0.88">{"{ }"}</text>
    </>
  );
}

/** Constellation: dots + connecting lines + terminal prompt */
function PatternDots({ p, id }: { p: Palette; id: string }) {
  const nodes: [number,number][] = [
    [120,90],[260,60],[400,90],[540,60],[680,90],
    [80,225],[200,170],[320,200],[480,180],[600,210],[720,225],
    [120,360],[260,390],[400,360],[540,390],[680,360],
    [400,225],
  ];
  const edges: [number,number][] = [
    [0,1],[1,2],[2,3],[3,4],
    [5,6],[6,7],[7,8],[8,9],[9,10],
    [11,12],[12,13],[13,14],[14,15],
    [0,5],[4,10],[11,5],[15,10],
    [6,1],[9,3],[7,16],[8,16],[6,16],[9,16],
    [2,16],[13,16],
  ];

  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.bg1} />
          <stop offset="100%" stopColor={p.bg2} />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.1" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill={`url(#${id}bg)`} />
      <ellipse cx="400" cy="225" rx="300" ry="220" fill={`url(#${id}glow)`} />

      {/* edges */}
      {edges.map(([a,b],i)=>(
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={p.mid} strokeOpacity="0.22" strokeWidth="0.8" />
      ))}

      {/* nodes */}
      {nodes.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y}
          r={i===16?5:i<4||i>12?2.5:2}
          fill={i===16?p.light:p.mid}
          fillOpacity={i===16?0.9:0.55} />
      ))}

      {/* center ring */}
      <circle cx="400" cy="225" r="65" stroke={p.accent} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="5 8" fill="none" />

      {/* terminal prompt symbol */}
      <text x="400" y="248" textAnchor="middle"
        fontFamily="'Courier New', Courier, monospace" fontSize="64" fontWeight="700"
        fill={p.light} fillOpacity="0.88">{"_$"}</text>
    </>
  );
}

// ── main component ────────────────────────────────────────────────────────────
const PATTERNS = [PatternCircuit, PatternHex, PatternDots];

export function ProjectPlaceholder({ className, seed = 0 }: Props) {
  const palette  = PALETTES[seed % PALETTES.length];
  const Pattern  = PATTERNS[seed % PATTERNS.length];
  const id       = `pp${seed}-`; // unique SVG def IDs per instance

  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <Pattern p={palette} id={id} />
      </svg>
    </div>
  );
}
