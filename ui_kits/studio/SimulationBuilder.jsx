// Traverse Studio — Simulation builder (3-step stepper)
// Source: components/Simulation/Stepper/SimulationStepper.vue

function SimulationBuilder({ onClose }) {
  const [step, setStep] = React.useState(0);
  const steps = ['Basic', 'Design', 'Content'];
  const [sim, setSim] = React.useState({
    title: 'Upset subscriber cancels mid-onboarding',
    type: 'chat', // chat | voice | emailReceive | emailCreate
    usePrimaryCharacter: true,
    characterId: 'c2',
    environmentId: 'e1',
    candidateInitiates: false,
    canBeRetried: true,
    purpose: "To test the user's ability to de-escalate a churn conversation and retain the subscriber without offering unauthorised discounts.",
    candidateObjective: 'To understand why the subscriber is leaving, address their concerns, and offer an appropriate retention path.',
    conversationTone: 'empathetic',
    tags: ['retention', 'support'],
    background: 'office-light',
    chatSkin: 'slack-light',
    stockChats: 3,
    outcomes: 3,
    agenda: 4,
  });
  const set = (k, v) => setSim({ ...sim, [k]: v });

  return (
    <StepperShell
      steps={steps} active={step} onStep={setStep}
      onPrev={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(Math.min(steps.length - 1, step + 1))}
      onFinish={onClose} onClose={onClose}
      leftActions={<Button variant="ghost" icon="x" label="Delete"/>}
    >
      {{
        header: <PageTitle title="Simulation"
                  subtitle="Create and configure your simulation scenario with characters, settings, and interactive elements."/>,
        body: (
          <>
            {step === 0 && <SimStepBasic sim={sim} set={set}/>}
            {step === 1 && <SimStepDesign sim={sim} set={set}/>}
            {step === 2 && <SimStepContent sim={sim} set={set}/>}
          </>
        ),
      }}
    </StepperShell>
  );
}

function SimStepBasic({ sim, set }) {
  const charOptions = [
    { value: 'c1', label: 'Alex Morgan — Subscriber' },
    { value: 'c2', label: 'Priya Rao — Churning customer' },
    { value: 'c3', label: 'Devon Lee — Skeptical buyer' },
  ];
  const envOptions = [
    { value: 'e1', label: 'Banana Jam Studios' },
    { value: 'e2', label: 'North Bay Credit Union' },
  ];
  const toneOptions = [
    { value: 'empathetic', label: 'Empathetic' },
    { value: 'assertive',  label: 'Assertive'  },
    { value: 'neutral',    label: 'Neutral'    },
  ];
  return (
    <FormSection title="Basic simulation information" subtitle="Overview of the simulation">
      <FormField label="Simulation Title" description="Give your simulation a title">
        <Input value={sim.title} onChange={e => set('title', e.target.value)} placeholder="Enter title"/>
      </FormField>
      <FormField label="Primary Character" description="Select the primary character">
        <Dropdown value={sim.characterId} options={charOptions} placeholder="Select a character"/>
      </FormField>
      <FormField label="Environment" description="Select the environment">
        <Dropdown value={sim.environmentId} options={envOptions} placeholder="Select an environment"/>
      </FormField>
      <FormField label="Candidate Initiates" description="Does the candidate initiate the conversation?">
        <Switch checked={sim.candidateInitiates} onChange={v => set('candidateInitiates', v)}/>
      </FormField>
      <FormField label="Can Be Retried" description="Can the simulation be attempted more than once?">
        <Switch checked={sim.canBeRetried} onChange={v => set('canBeRetried', v)}/>
      </FormField>
      <FormField label="Simulation Purpose" description="What is the goal of the simulation?"
        leftBottom={<WordCount text={sim.purpose} limit={250}/>}>
        <Textarea value={sim.purpose} onChange={e => set('purpose', e.target.value)}
          placeholder="To test the user's ability to..." rows={4}/>
      </FormField>
      <FormField label="Candidate Objective" description="What is the main goal of the candidate?"
        leftBottom={<WordCount text={sim.candidateObjective} limit={250}/>}>
        <Textarea value={sim.candidateObjective} onChange={e => set('candidateObjective', e.target.value)}
          placeholder="To engage with a colleague..." rows={3}/>
      </FormField>
      <FormField label="Conversation Tone" description="Select overall tone of the interaction">
        <Dropdown value={sim.conversationTone} options={toneOptions} placeholder="Select the conversation tone"/>
      </FormField>
      <FormField label="Tags" description="Add tags to this simulation">
        <div style={{
          minHeight: 38, padding: '6px 8px', border: `1px solid ${TS.surface300}`, borderRadius: 8,
          display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: '#fff',
        }}>
          {sim.tags.map(t => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 9999, background: TS.primary50,
              color: TS.primary700, font: `500 12px ${TS.fontSans}`,
            }}>
              {t}
              <Icon name="x" size={10}/>
            </span>
          ))}
          <span style={{ color: TS.surface400, font: `400 13px ${TS.fontSans}` }}>Select tags</span>
        </div>
      </FormField>
    </FormSection>
  );
}

function SimStepDesign({ sim, set }) {
  const bgOpts = [
    { value: 'office-light', label: 'Office (light)' },
    { value: 'office-dark',  label: 'Office (dark)'  },
    { value: 'cafe',         label: 'Cafe'           },
  ];
  const skinOpts = [
    { value: 'slack-light', label: 'Slack — Light' },
    { value: 'slack-dark',  label: 'Slack — Dark'  },
    { value: 'teams',       label: 'Microsoft Teams' },
    { value: 'imessage',    label: 'iMessage' },
  ];
  return (
    <FormSection title="Simulation Template Design" subtitle="Setup the simulation style and stock content">
      <FormField label="Background" description="Select a background from the options provided">
        <Dropdown value={sim.background} options={bgOpts} placeholder="Select a background"/>
      </FormField>
      <FormField label="Skin" description="Select a skin from the options provided">
        <Dropdown value={sim.chatSkin} options={skinOpts} placeholder="Select a skin"/>
      </FormField>
      <FormDivider/>
      <FormField label="Stock Chats" description="These will be shown as unclickable read chats">
        <StockChats count={sim.stockChats}/>
      </FormField>
    </FormSection>
  );
}

function StockChats({ count }) {
  const rows = [
    { name: 'Priya Rao',  preview: 'Hey — got a sec? Something came up with the renewal.', time: '10:42', color: '#db2777' },
    { name: 'Devon Lee',  preview: 'Following up on yesterday\'s thread.',                 time: '09:15', color: '#0d9488' },
    { name: 'Support #',  preview: 'Ticket #4821 assigned to you.',                         time: 'Yest', color: TS.primary600 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {rows.slice(0, count).map((r, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
          border: `1px solid ${TS.surface200}`, borderRadius: 10, background: '#fff',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9999, background: r.color,
            color: '#fff', font: `600 12px ${TS.fontSans}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{r.name.split(' ').map(x => x[0]).join('')}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: `600 13px ${TS.fontSans}`, color: TS.surface800 }}>{r.name}</div>
            <div style={{ font: `400 12px ${TS.fontSans}`, color: TS.surface500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.preview}</div>
          </div>
          <span style={{ font: `500 11px ${TS.fontSans}`, color: TS.surface400 }}>{r.time}</span>
          <IconButton icon="ellipsis" size="sm"/>
        </div>
      ))}
      <button style={{
        padding: '10px 12px', border: `1px dashed ${TS.surface300}`, borderRadius: 10,
        background: 'transparent', color: TS.surface500, cursor: 'pointer',
        font: `500 13px ${TS.fontSans}`, textAlign: 'left',
      }}>+ Add Stock Chat</button>
    </div>
  );
}

function SimStepContent({ sim }) {
  return (
    <>
      <FormSection title="Simulation Outcomes" subtitle="Possible resolutions to the simulation">
        <OutcomeList/>
      </FormSection>
      <FormDivider/>
      <FormSection title="Simulation Agenda" subtitle="Instructions for how the character should follow the simulation">
        <AgendaList/>
      </FormSection>
    </>
  );
}

function OutcomeList() {
  const items = [
    { title: 'Subscriber retained with existing plan',    type: 'success', desc: 'Candidate acknowledges concerns, clarifies value, confirms to stay.' },
    { title: 'Offered supported downgrade',              type: 'partial', desc: 'Candidate moves subscriber to a lower tier rather than cancel.' },
    { title: 'Subscriber cancels',                        type: 'failure', desc: 'Candidate fails to de-escalate; cancellation is processed.' },
  ];
  const color = { success: TS.success600, partial: TS.warn500, failure: TS.error500 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14,
          border: `1px solid ${TS.surface200}`, borderRadius: 10, background: '#fff',
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: 9999, background: color[it.type],
            marginTop: 5, flexShrink: 0,
          }}/>
          <div style={{ flex: 1 }}>
            <div style={{ font: `600 14px ${TS.fontSans}`, color: TS.surface800 }}>{it.title}</div>
            <div style={{ font: `400 12px/1.4 ${TS.fontSans}`, color: TS.surface500, marginTop: 2 }}>{it.desc}</div>
          </div>
          <IconButton icon="ellipsis" size="sm"/>
        </div>
      ))}
      <button style={{
        padding: '10px 12px', border: `1px dashed ${TS.surface300}`, borderRadius: 10,
        background: 'transparent', color: TS.surface500, cursor: 'pointer',
        font: `500 13px ${TS.fontSans}`, textAlign: 'left',
      }}>+ Add Outcome</button>
    </div>
  );
}

function AgendaList() {
  const items = [
    'Open with frustration but stay civil.',
    'Reveal the real reason for cancelling only if pressed.',
    'Ask about competitors if the candidate pushes on price.',
    'Agree to stay only if offered a concrete next step.',
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {items.map((t, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          border: `1px solid ${TS.surface200}`, borderRadius: 10, background: TS.surface50,
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: 9999, background: TS.primary100, color: TS.primary700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: `600 11px ${TS.fontSans}`, flexShrink: 0,
          }}>{i + 1}</span>
          <span style={{ flex: 1, font: `400 13px ${TS.fontSans}`, color: TS.surface700 }}>{t}</span>
          <IconButton icon="ellipsis" size="sm"/>
        </div>
      ))}
      <button style={{
        padding: '10px 12px', border: `1px dashed ${TS.surface300}`, borderRadius: 10,
        background: 'transparent', color: TS.surface500, cursor: 'pointer',
        font: `500 13px ${TS.fontSans}`, textAlign: 'left',
      }}>+ Add Agenda Action</button>
    </div>
  );
}

Object.assign(window, { SimulationBuilder });
