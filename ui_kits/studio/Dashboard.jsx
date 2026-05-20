// Traverse Studio — Workspace dashboard (shell + simulation library)
// Mirrors structure from features/workspaces dashboard

function Dashboard({ workspace, onBack }) {
  const [nav, setNav] = React.useState('simulations');
  const [builder, setBuilder] = React.useState(null); // 'simulation' | 'environment' | 'assessment' | null
  const topLabel = {
    simulations: 'Simulations', environments: 'Environments', assessments: 'Assessments',
    dashboard: 'Dashboard', rubrics: 'Rubrics', members: 'Members',
  }[nav];
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: TS.surface50 }}>
      <Sidebar active={nav} onChange={setNav} workspace={workspace} onBack={onBack}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar workspace={workspace} label={topLabel}/>
        {nav === 'simulations'  && <SimulationLibrary  onNew={() => setBuilder('simulation')}/>}
        {nav === 'environments' && <EnvironmentLibrary onNew={() => setBuilder('environment')}/>}
        {nav === 'assessments'  && <AssessmentLibrary  onNew={() => setBuilder('assessment')}/>}
        {nav === 'dashboard'   && <PlaceholderPanel title="Dashboard"/>}
        {nav === 'rubrics'     && <PlaceholderPanel title="Rubrics" coming/>}
        {nav === 'members'     && <PlaceholderPanel title="Members"/>}
      </div>
      {builder && (
        <BuilderOverlay onClose={() => setBuilder(null)}>
          {builder === 'simulation'  && <SimulationBuilder  onClose={() => setBuilder(null)}/>}
          {builder === 'environment' && <EnvironmentBuilder onClose={() => setBuilder(null)}/>}
          {builder === 'assessment'  && <AssessmentBuilder  onClose={() => setBuilder(null)}/>}
        </BuilderOverlay>
      )}
    </div>
  );
}

function BuilderOverlay({ children, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,.35)', zIndex: 40,
      display: 'flex', alignItems: 'stretch', justifyContent: 'center', padding: 32,
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        flex: 1, maxWidth: 1120, background: '#fff', borderRadius: 12,
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / .25)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>{children}</div>
    </div>
  );
}

function Sidebar({ active, onChange, workspace, onBack }) {
  const items = [
    { id: 'dashboard',    label: 'Dashboard',    icon: 'tree-map'   },
    { id: 'simulations',  label: 'Simulations',  icon: 'film'       },
    { id: 'environments', label: 'Environments', icon: 'cube'       },
    { id: 'assessments',  label: 'Assessments',  icon: 'flask-vial' },
    { id: 'rubrics',      label: 'Rubrics',      icon: 'venn',      badge: 'COMING' },
    { id: 'members',      label: 'Members',      icon: 'person'     },
  ];
  return (
    <aside style={{
      width: 240, background: TS.surface100, borderRight: `1px solid ${TS.surface200}`,
      padding: 12, display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ padding: '6px 8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: TS.primary600, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12,
        }}>{workspace.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: `600 13px/1.2 ${TS.fontSans}`, color: TS.surface800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {workspace.name}
          </div>
        </div>
        <IconButton icon="chevron-down" size="sm"/>
      </div>
      <Eyebrow style={{ padding: '10px 8px 4px' }}>Summary</Eyebrow>
      {items.map(it => (
        <NavItem key={it.id} {...it} active={active === it.id} onClick={() => onChange(it.id)} />
      ))}
      <div style={{ flex: 1 }}/>
      <NavItem icon="gear"     label="Settings"/>
      <NavItem icon="sign-out" label="Sign out" onClick={onBack}/>
    </aside>
  );
}

function NavItem({ icon, label, active, badge, onClick }) {
  const [hover, setHover] = React.useState(false);
  const bg = active ? TS.primary400 : hover ? TS.primary100 : 'transparent';
  const color = active ? '#fff' : hover ? TS.primary700 : TS.surface700;
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: '28px 1fr auto', alignItems: 'center',
        padding: '6px 2px', borderRadius: 8, cursor: 'pointer',
        background: bg, color, transition: 'all 300ms',
      }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Icon name={icon} size={16} color={color}/>
      </div>
      <span style={{ fontFamily: TS.fontSans, fontWeight: 500, fontSize: 14 }}>{label}</span>
      {badge && (
        <span style={{
          background: TS.surface100, color: TS.surface300, padding: '2px 4px',
          borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginRight: 8,
        }}>{badge}</span>
      )}
      {hover && !badge && active !== true && (
        <span style={{
          width: 22, height: 22, borderRadius: 8, background: TS.primary200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4,
        }}><Icon name="arrow-right" size={10} color={TS.primary700}/></span>
      )}
    </div>
  );
}

function TopBar({ workspace, label = 'Simulations' }) {
  return (
    <div style={{
      height: 56, background: '#fff', borderBottom: `1px solid ${TS.surface200}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
    }}>
      <div style={{ font: `600 14px ${TS.fontSans}`, color: TS.surface800 }}>{label}</div>
      <Tag color={TS.surface500}>{workspace.members} members</Tag>
      <div style={{ flex: 1 }}/>
      <Input icon="search" placeholder="Search" style={{ width: 240 }}/>
      <IconButton icon="bell"/>
      <Avatar initials="JD"/>
    </div>
  );
}

function SimulationLibrary({ onNew }) {
  const sims = [
    { title: 'Upset subscriber cancels mid-onboarding', type: 'Chat',  status: 'Published', scenes: 4, color: TS.primary600 },
    { title: 'Security incident: tailgating report',    type: 'Email', status: 'Draft',     scenes: 2, color: '#0284c7' },
    { title: 'Objection handling — annual plan',         type: 'Call',  status: 'Published', scenes: 6, color: '#db2777' },
    { title: 'New hire day one: tooling walkthrough',    type: 'AI',    status: 'Draft',     scenes: 3, color: '#16a34a' },
    { title: 'GDPR data request — respond in 72h',       type: 'Email', status: 'Published', scenes: 2, color: '#0284c7' },
    { title: 'Team sync: performance conversation',      type: 'Call',  status: 'Archived',  scenes: 5, color: '#db2777' },
  ];
  const icons = { Chat: 'chat', Email: 'envelope', Call: 'phone', AI: 'sparkles' };
  return (
    <div style={{ padding: 32, flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ font: `600 30px/1.2 ${TS.fontSans}`, color: TS.surface800, letterSpacing: '-0.01em', margin: 0 }}>
            Simulations
          </h2>
          <p style={{ font: `400 14px/1.55 ${TS.fontSans}`, color: TS.surface500, margin: '4px 0 0' }}>
            Build simulated work experiences for your learners.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" icon="filter" label="Filter" size="sm"/>
          <Button icon="plus" label="New simulation" onClick={onNew}/>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {sims.map((s, i) => (
          <Card key={i} shadow="sm" style={{ padding: 16, cursor: 'pointer', transition: 'box-shadow 200ms' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0/.1),0 2px 4px -2px rgb(0 0 0/.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0/.05)'}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: s.color + '14',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name={icons[s.type]} size={18} color={s.color}/></div>
              <StatusBadge status={s.status}/>
            </div>
            <div style={{ font: `600 15px/1.35 ${TS.fontSans}`, color: TS.surface800, minHeight: 40 }}>
              {s.title}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginTop: 12,
              font: `500 12px ${TS.fontSans}`, color: TS.surface500,
            }}>
              <span>{s.type}</span>
              <span style={{ width: 3, height: 3, borderRadius: 3, background: TS.surface300 }}/>
              <span>{s.scenes} scenes</span>
              <span style={{ flex: 1 }}/>
              <IconButton icon="ellipsis" size="sm"/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Published: { bg: '#dcfce7', color: '#039855' },
    Draft:     { bg: '#fef3c7', color: '#cc8925' },
    Archived:  { bg: '#fee2e2', color: '#D92D20' },
  }[status] || { bg: TS.surface100, color: TS.surface500 };
  return (
    <span style={{
      background: map.bg, color: map.color, padding: '3px 7px', borderRadius: 6,
      font: `600 10px/1 ${TS.fontSans}`, letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>{status}</span>
  );
}

function PlaceholderPanel({ title, coming }) {
  return (
    <div style={{ padding: 32, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: TS.surface500 }}>
      <Icon name="cube" size={40} color={TS.surface300}/>
      <div style={{ font: `600 18px ${TS.fontSans}`, color: TS.surface700, marginTop: 14 }}>{title}</div>
      <div style={{ font: `400 13px ${TS.fontSans}`, marginTop: 4 }}>
        {coming ? 'Coming soon.' : 'This area is empty in the kit.'}
      </div>
    </div>
  );
}

function EnvironmentLibrary({ onNew }) {
  const envs = [
    { name: 'Banana Jam Studios',   industry: 'Software development',       chars: 5, color: TS.primary600, initials: 'BJ' },
    { name: 'North Bay Credit Union', industry: 'Retail banking',           chars: 7, color: '#0d9488',      initials: 'NB' },
    { name: 'Westfield Hospital',    industry: 'Healthcare',                 chars: 9, color: '#db2777',      initials: 'WH' },
    { name: 'Mercer & Hale LLP',     industry: 'Legal services',             chars: 4, color: '#0284c7',      initials: 'MH' },
  ];
  return (
    <div style={{ padding: 32, flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ font: `600 30px/1.2 ${TS.fontSans}`, color: TS.surface800, letterSpacing: '-0.01em', margin: 0 }}>Environments</h2>
          <p style={{ font: `400 14px/1.55 ${TS.fontSans}`, color: TS.surface500, margin: '4px 0 0' }}>
            Workplaces, characters, and candidate relationships reused across simulations.
          </p>
        </div>
        <Button icon="plus" label="New environment" onClick={onNew}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {envs.map((e, i) => (
          <Card key={i} shadow="sm" style={{ padding: 16, cursor: 'pointer' }} onClick={onNew}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 9, background: e.color,
                color: '#fff', font: `700 14px ${TS.fontSans}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{e.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `600 15px/1.3 ${TS.fontSans}`, color: TS.surface800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
                <div style={{ font: `500 12px/1.3 ${TS.fontSans}`, color: TS.surface500, marginTop: 2 }}>{e.industry}</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginTop: 14,
              paddingTop: 12, borderTop: `1px solid ${TS.surface100}`,
              font: `500 12px ${TS.fontSans}`, color: TS.surface500,
            }}>
              <Icon name="person" size={12} color={TS.surface400}/>
              <span>{e.chars} characters</span>
              <span style={{ flex: 1 }}/>
              <IconButton icon="ellipsis" size="sm"/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AssessmentLibrary({ onNew }) {
  const items = [
    { title: 'Q4 customer-facing communication baseline', tests: 3, categories: 4, status: 'Published' },
    { title: 'New-hire onboarding readiness',              tests: 5, categories: 3, status: 'Draft'     },
    { title: 'Mid-year support agent review',              tests: 4, categories: 5, status: 'Published' },
  ];
  return (
    <div style={{ padding: 32, flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ font: `600 30px/1.2 ${TS.fontSans}`, color: TS.surface800, letterSpacing: '-0.01em', margin: 0 }}>Assessments</h2>
          <p style={{ font: `400 14px/1.55 ${TS.fontSans}`, color: TS.surface500, margin: '4px 0 0' }}>
            Group tests and rubrics into scored experiences.
          </p>
        </div>
        <Button icon="plus" label="New assessment" onClick={onNew}/>
      </div>
      <Card shadow="sm" style={{ padding: 0, overflow: 'hidden' }}>
        {items.map((a, i) => (
          <div key={i} onClick={onNew} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
            borderBottom: i === items.length - 1 ? 'none' : `1px solid ${TS.surface100}`,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: TS.primary50,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><Icon name="flask-vial" size={16} color={TS.primary700}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ font: `600 15px/1.3 ${TS.fontSans}`, color: TS.surface800 }}>{a.title}</div>
              <div style={{ font: `500 12px ${TS.fontSans}`, color: TS.surface500, marginTop: 4 }}>
                {a.tests} tests · {a.categories} categories
              </div>
            </div>
            <StatusBadge status={a.status}/>
            <IconButton icon="ellipsis" size="sm"/>
          </div>
        ))}
      </Card>
    </div>
  );
}

Object.assign(window, {
  Dashboard, Sidebar, NavItem, TopBar, SimulationLibrary, StatusBadge, PlaceholderPanel,
  EnvironmentLibrary, AssessmentLibrary, BuilderOverlay,
});
