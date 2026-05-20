// Traverse Studio — Stepper chrome primitives
// Source: components/App/Stepper/* + components/App/AppPageTitle.vue

function PageTitle({ title, subtitle, end }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '20px 24px 12px', gap: 8,
    }}>
      <div>
        <h1 style={{ font: `700 30px/1.2 ${TS.fontSans}`, color: TS.surface900, margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ font: `400 14px/1.5 ${TS.fontSans}`, color: TS.surface500, margin: '8px 0 0', maxWidth: 720 }}>
            {subtitle}
          </p>
        )}
      </div>
      {end}
    </div>
  );
}

function StepperHeader({ steps, active, onStep }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
      {steps.map((label, i) => {
        const isActive = i === active;
        return (
          <React.Fragment key={label}>
            <div onClick={() => onStep(i)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: 8, cursor: 'pointer',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 9999, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: isActive ? TS.primary600 : '#9ca3af',
                color: '#fff', font: `400 14px ${TS.fontSans}`, transition: 'all 200ms',
              }}>{i + 1}</div>
              <span style={{
                font: `500 14px ${TS.fontSans}`,
                color: isActive ? TS.primary600 : '#9ca3af', transition: 'color 200ms',
              }}>{label}</span>
            </div>
            {i !== steps.length - 1 && (
              <hr style={{ flex: 1, border: 0, borderTop: '1px solid #f3f4f6', margin: 0 }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FormSection({ title, subtitle, headerRight, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h3 style={{ font: `600 18px/1.3 ${TS.fontSans}`, color: TS.surface900, margin: 0 }}>{title}</h3>
          {subtitle && <span style={{ font: `400 12px/1.4 ${TS.fontSans}`, color: '#4b5563' }}>{subtitle}</span>}
        </div>
        {headerRight}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>{children}</div>
    </div>
  );
}

function FormField({ label, description, tooltip, leftBottom, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '35% 1fr', gap: 32, alignItems: 'flex-start', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ font: `600 14px ${TS.fontSans}`, color: TS.surface800 }}>{label}</label>
            {tooltip && <Icon name="gear" size={12} color={TS.surface400}/>}
          </div>
          {description && <span style={{ font: `400 12px/1.4 ${TS.fontSans}`, color: TS.surface500 }}>{description}</span>}
        </div>
        {leftBottom && <div>{leftBottom}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>{children}</div>
    </div>
  );
}

function FormDivider() {
  return <div style={{ borderTop: `1px solid ${TS.surface200}`, width: '100%' }}/>;
}

function Switch({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <span onClick={() => onChange(!checked)} style={{
        width: 36, height: 20, borderRadius: 9999, position: 'relative',
        background: checked ? TS.primary600 : TS.surface300, transition: 'background 200ms',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: 9999, background: '#fff',
          transition: 'left 200ms', boxShadow: '0 1px 2px rgba(0,0,0,.2)',
        }}/>
      </span>
      {label && <span style={{ font: `500 13px ${TS.fontSans}`, color: TS.surface700 }}>{label}</span>}
    </label>
  );
}

function Textarea({ value, placeholder, onChange, rows = 4 }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea value={value || ''} placeholder={placeholder} onChange={onChange} rows={rows}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: 12,
        border: `1px solid ${focus ? TS.primary300 : TS.surface300}`, borderRadius: 8,
        fontFamily: TS.fontSans, fontSize: 14, lineHeight: 1.5, color: TS.surface900,
        background: '#fff', outline: 'none', resize: 'vertical',
        boxShadow: focus ? '0 0 0 3px rgb(129 140 248 / .3)' : 'none', transition: 'all 200ms',
      }}/>
  );
}

function Dropdown({ value, options, placeholder, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 38, padding: '0 12px', border: `1px solid ${TS.surface300}`, borderRadius: 8,
      background: '#fff', font: `400 14px ${TS.fontSans}`, color: value ? TS.surface900 : TS.surface400,
      cursor: 'pointer',
    }}>
      <span>{value ? (options.find(o => o.value === value)?.label ?? value) : placeholder}</span>
      <Icon name="chevron-down" size={14} color={TS.surface500}/>
    </div>
  );
}

function WordCount({ text = '', limit }) {
  const n = text.length;
  const over = n > limit;
  return (
    <span style={{
      font: `500 11px ${TS.fontSans}`,
      color: over ? TS.error500 : TS.surface400,
    }}>{n} / {limit} characters</span>
  );
}

function StepperShell({ steps, active, onStep, onPrev, onNext, onFinish, onClose, onSave, leftActions, children }) {
  const isLast = active === steps.length - 1;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, overflow: 'auto' }}>
        {children.header}
        <div style={{ padding: '0 20px' }}>
          <StepperHeader steps={steps} active={active} onStep={onStep}/>
        </div>
        <div style={{ padding: '16px 24px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {children.body}
        </div>
      </div>
      <div style={{
        height: 72, padding: '0 20px', borderTop: `1px solid ${TS.surface200}`, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="ghost" label="Close" onClick={onClose}/>
          {leftActions}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ font: `500 12px ${TS.fontSans}`, color: TS.surface400, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 9999, background: TS.success600 }}/>Saved
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {active > 0 && <Button variant="outline" label="Previous" onClick={onPrev}/>}
            {!isLast && <Button variant="primary" label="Next" onClick={onNext}/>}
            {isLast && <Button variant="primary" label="Finish" onClick={onFinish}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PageTitle, StepperHeader, FormSection, FormField, FormDivider,
  Switch, Textarea, Dropdown, WordCount, StepperShell,
});
