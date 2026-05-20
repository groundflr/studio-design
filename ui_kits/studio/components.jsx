// Traverse Studio UI Kit — shared primitive components
// React + inline styles (no tailwind available here). Mirrors the Vue source.

const TS = {
  // colors
  primary50:'#eef2ff', primary100:'#e0e7ff', primary200:'#c7d2fe', primary300:'#a5b4fc',
  primary400:'#818cf8', primary500:'#6366f1', primary600:'#4f46e5', primary700:'#4338ca',
  surface0:'#ffffff', surface50:'#f8fafc', surface100:'#f1f5f9', surface200:'#e2e8f0',
  surface300:'#cbd5e1', surface400:'#94a3b8', surface500:'#64748b', surface600:'#475569',
  surface700:'#334155', surface800:'#1e293b', surface900:'#0f172a',
  error500:'#D92D20', success500:'#039855', warn500:'#cc8925',
  fontSans:"'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
};

function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.5 }) {
  const paths = {
    'tree-map': <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
    'film': <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 8h4M17 8h4M3 16h4M17 16h4"/></>,
    'flask-vial': <path d="M9 3v4l-5 9a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-5-9V3M9 3h6"/>,
    'vial': <path d="M16 3 8 11a4 4 0 0 0 5.6 5.6L22 8M14 9l4 4M9 3h7"/>,
    'person': <><circle cx="12" cy="8" r="3"/><path d="M6 20a6 6 0 0 1 12 0"/><circle cx="5" cy="6" r="1.2"/><circle cx="19" cy="6" r="1.2"/></>,
    'venn': <><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></>,
    'layers': <><path d="M12 3 3 8l9 5 9-5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    'cube': <><path d="M12 3 3 8v8l9 5 9-5V8l-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></>,
    'search': <><circle cx="11" cy="11" r="7"/><path d="m20 20-4.3-4.3"/></>,
    'plus': <path d="M12 5v14M5 12h14"/>,
    'arrow-right': <path d="M5 12h14M13 6l6 6-6 6"/>,
    'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6"/>,
    'x': <path d="M18 6 6 18M6 6l12 12"/>,
    'chevron-down': <path d="m6 9 6 6 6-6"/>,
    'ellipsis': <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    'gear': <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    'user': <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    'sign-out': <><path d="M17 16l4-4-4-4M21 12H9"/><path d="M13 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7"/></>,
    'envelope': <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    'phone': <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>,
    'chat': <path d="M4 4h16v11H8l-4 4V4z"/>,
    'send': <path d="M4 12 22 3l-6 18-4-8-8-1z"/>,
    'paperclip': <path d="m21 12-8.5 8.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>,
    'sparkles': <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></>,
    'bell': <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    'check': <path d="m5 12 5 5L20 6"/>,
    'filter': <path d="M3 4h18l-7 9v6l-4 2v-8L3 4z"/>,
    'mic': <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></>,
    'video': <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,
    'pin': <path d="M12 2v7l-3 3v3h6v-3l-3-3V2zM12 15v7"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
}

function Button({ label, icon, variant = 'primary', size = 'md', disabled, onClick, hotKey, children }) {
  const bySize = {
    xs: { h: 24, px: 8,  fs: 12, r: 6, gap: 6 },
    sm: { h: 28, px: 10, fs: 12, r: 6, gap: 6 },
    md: { h: 36, px: 12, fs: 14, r: 8, gap: 8 },
  }[size];
  const byVar = {
    primary: { bg: TS.primary600, bgH: TS.primary700, bd: TS.primary500, color: '#fff', shadow: '0 1px 2px 0 rgb(0 0 0/.05)' },
    outline: { bg: '#fff', bgH: TS.surface50, bd: TS.surface300, color: TS.surface700, shadow: '0 1px 2px 0 rgb(0 0 0/.05)' },
    destructive: { bg: TS.error500, bgH: '#b91c1c', bd: TS.error500, color: '#fff', shadow: '0 1px 2px 0 rgb(0 0 0/.05)' },
    ghost: { bg: 'transparent', bgH: 'rgba(51,65,85,.05)', bd: 'transparent', color: TS.surface700, shadow: 'none' },
    'ghost-primary': { bg: 'transparent', bgH: 'rgba(67,56,202,.05)', bd: 'transparent', color: TS.primary700, shadow: 'none' },
  }[variant];
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: bySize.gap,
        height: bySize.h, padding: `0 ${bySize.px}px`, borderRadius: bySize.r,
        fontFamily: TS.fontSans, fontSize: bySize.fs, fontWeight: 500, lineHeight: 1,
        border: `1px solid ${byVar.bd}`, background: hover && !disabled ? byVar.bgH : byVar.bg,
        color: byVar.color, boxShadow: byVar.shadow, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1, transition: 'all 200ms', whiteSpace: 'nowrap',
      }}>
      {icon && <Icon name={icon} size={size === 'md' ? 14 : 12}/>}
      {label}
      {children}
      {hotKey && (
        <span style={{
          fontSize: 9, fontWeight: 600, padding: '2px 4px', borderRadius: 4,
          border: `1px solid ${variant === 'primary' ? 'rgba(255,255,255,.4)' : 'rgba(51,65,85,.25)'}`,
          background: variant === 'primary' ? 'rgba(255,255,255,.15)' : 'rgba(51,65,85,.1)',
          color: variant === 'primary' ? 'rgba(255,255,255,.85)' : 'rgba(51,65,85,.7)',
        }}>{hotKey}</span>
      )}
    </button>
  );
}

function IconButton({ icon, size = 'md', onClick, tooltip }) {
  const s = { sm: 24, md: 32, lg: 40 }[size];
  const iSize = { sm: 14, md: 16, lg: 20 }[size];
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} title={tooltip}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: s, height: s, border: 0, borderRadius: 9999,
        background: hover ? 'rgba(30,41,59,.05)' : 'transparent',
        color: TS.surface800, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 100ms',
      }}>
      <Icon name={icon} size={iSize}/>
    </button>
  );
}

function Tag({ children, color = TS.primary600 }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 9999,
      padding: '5px 10px', fontFamily: TS.fontSans, fontWeight: 500, fontSize: 11, lineHeight: 1,
      color, background: color + '0D',
    }}>{children}</span>
  );
}

function Avatar({ initials, size = 32, color = TS.primary600 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999, background: initials ? color : TS.surface100,
      color: '#fff', fontFamily: TS.fontSans, fontWeight: 600, fontSize: size * 0.4,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {initials || <Icon name="user" size={size * 0.5} color={TS.surface500}/>}
    </div>
  );
}

function Input({ value, placeholder, onChange, icon, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: 'relative', ...style }}>
      {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: TS.surface400 }}>
        <Icon name={icon} size={14}/>
      </span>}
      <input value={value || ''} placeholder={placeholder} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', height: 38, padding: icon ? '0 12px 0 36px' : '0 12px',
          border: `1px solid ${focus ? TS.primary300 : TS.surface300}`, borderRadius: 8,
          fontFamily: TS.fontSans, fontSize: 14, color: TS.surface900, background: '#fff',
          outline: 'none', boxShadow: focus ? '0 0 0 3px rgb(129 140 248 / .3)' : 'none',
          transition: 'all 200ms',
        }}/>
    </div>
  );
}

function Card({ children, style, shadow = 'sm', bordered = true }) {
  const shadowMap = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0/.05)',
    md: '0 4px 6px -1px rgb(0 0 0/.1),0 2px 4px -2px rgb(0 0 0/.1)',
  };
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: bordered ? `1px solid ${TS.surface200}` : 'none',
      boxShadow: shadowMap[shadow], ...style,
    }}>{children}</div>
  );
}

function Eyebrow({ children, style }) {
  return <span style={{
    fontFamily: TS.fontSans, fontWeight: 600, fontSize: 11, letterSpacing: '0.05em',
    textTransform: 'uppercase', color: TS.surface600, ...style,
  }}>{children}</span>;
}

Object.assign(window, { TS, Icon, Button, IconButton, Tag, Avatar, Input, Card, Eyebrow });
