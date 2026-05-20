// Traverse Studio — Workspace screen (index view)
// Mirrors the WorkspacesView / shell from apps/web/src/features/workspaces

function WorkspaceApp() {
  const [screen, setScreen] = React.useState('picker'); // picker | dashboard
  const [active, setActive] = React.useState(null);
  const [creating, setCreating] = React.useState(false);

  return (
    <div style={{ minHeight: '100vh', background: TS.surface50, fontFamily: TS.fontSans }}>
      {screen === 'picker' && (
        <WorkspacePicker
          onSelect={(ws) => { setActive(ws); setScreen('dashboard'); }}
          onCreate={() => setCreating(true)} />
      )}
      {screen === 'dashboard' && active && (
        <Dashboard workspace={active} onBack={() => setScreen('picker')} />
      )}
      {creating && <CreateWorkspaceModal onClose={() => setCreating(false)} />}
    </div>
  );
}

function AppHeader({ showBack, onBack, right }) {
  return (
    <div style={{
      height: 56, background: '#fff', borderBottom: `1px solid ${TS.surface200}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
    }}>
      {showBack && (
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent',
          color: TS.surface700, fontFamily: TS.fontSans, fontWeight: 600, fontSize: 11,
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', padding: 6,
        }}>
          <Icon name="arrow-left" size={14}/>BACK
        </button>
      )}
      <img src="../../assets/logos/studio_full_light.png" style={{ height: 22 }} alt="Traverse"/>
      <div style={{ flex: 1 }}/>
      {right}
    </div>
  );
}

function WorkspacePicker({ onSelect, onCreate }) {
  const workspaces = [
    { id: 1, name: 'Onboarding & Compliance', members: 12, color: TS.primary600, initials: 'OC' },
    { id: 2, name: 'Sales Enablement',        members: 8,  color: '#db2777', initials: 'SE' },
    { id: 3, name: 'Customer Support Academy', members: 23, color: '#16a34a', initials: 'CS' },
    { id: 4, name: 'Design Studio',           members: 4,  color: '#0d9488', initials: 'DS' },
  ];
  return (
    <div>
      <AppHeader right={<Avatar initials="JD"/>} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 120px' }}>
        <h1 style={{ font: `500 48px/1.1 ${TS.fontSans}`, color: TS.surface700, letterSpacing: '-0.01em', margin: 0 }}>
          Continue building.
        </h1>
        <p style={{ font: `400 14px/1.55 ${TS.fontSans}`, color: TS.surface700, marginTop: 16, maxWidth: 560 }}>
          Select the workspace where you would like to continue building simulated work experiences or create a new workspace below.
        </p>

        <Eyebrow style={{ display: 'block', marginTop: 56, marginBottom: 14 }}>Workspaces</Eyebrow>
        <Card shadow="md" bordered={false} style={{ padding: 8 }}>
          {workspaces.map((w, i) => (
            <div key={w.id} onClick={() => onSelect(w)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px',
              borderRadius: 8, cursor: 'pointer',
              borderBottom: i === workspaces.length - 1 ? 'none' : `1px solid ${TS.surface100}`,
            }}
            onMouseEnter={e => e.currentTarget.style.background = TS.surface50}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: w.color,
                color: '#fff', fontWeight: 700, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{w.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 16px/1.3 ${TS.fontSans}`, color: TS.surface800 }}>{w.name}</div>
                <div style={{ font: `500 13px/1.3 ${TS.fontSans}`, color: TS.surface500, marginTop: 2 }}>
                  {w.members} members
                </div>
              </div>
              <Icon name="arrow-right" size={16} color={TS.surface400}/>
            </div>
          ))}
        </Card>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Button icon="plus" label="Create workspace" onClick={onCreate}/>
        </div>
      </div>
    </div>
  );
}

function CreateWorkspaceModal({ onClose }) {
  const [name, setName] = React.useState('');
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <Card shadow="md" bordered={false} style={{ width: 480, padding: 28 }} >
        <div onClick={e => e.stopPropagation()}>
          <div style={{ font: `600 18px/1.3 ${TS.fontSans}`, color: TS.surface800 }}>New workspace</div>
          <div style={{ font: `400 13px/1.5 ${TS.fontSans}`, color: TS.surface500, marginTop: 4 }}>
            Workspaces group simulations, members, and settings.
          </div>
          <div style={{ marginTop: 20 }}>
            <label style={{ font: `500 12px ${TS.fontSans}`, color: TS.surface700, display: 'block', marginBottom: 6 }}>
              Workspace name
            </label>
            <Input value={name} placeholder="e.g. Sales Enablement" onChange={e => setName(e.target.value)}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <Button label="Cancel" variant="outline" onClick={onClose}/>
            <Button label="Create workspace" hotKey="⌘↵" disabled={!name} onClick={onClose}/>
          </div>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { WorkspaceApp, AppHeader, WorkspacePicker, CreateWorkspaceModal });
