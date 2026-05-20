// Traverse Studio — Assessment builder (4-step stepper)
// Source: components/Assessment/Stepper/AssessmentStepper.vue

function AssessmentBuilder({ onClose }) {
  const [step, setStep] = React.useState(0);
  const steps = ['Basic', 'Tests', 'Grading', 'Confirm'];
  const [a, setA] = React.useState({
    title: 'Customer-facing communication — Q4 baseline',
    requiresEmailConfirmation: true,
    requiresIntegrityPledge: false,
    objective: 'Measure baseline written and verbal communication across support scenarios; identify coaching priorities for the next quarter.',
    completionTrigger: 'onSubmit',
    gradingType: 'rubric',
    useNumericalScoring: true,
    categoryScoreAllocation: 'equal',
    categoryScoreWeighting: 'average',
    isPublished: false,
    rubric: [
      { name: 'Empathy',       color: '#db2777' },
      { name: 'Accuracy',       color: TS.primary600 },
      { name: 'Resolution path', color: '#0d9488' },
      { name: 'Tone',           color: '#0284c7' },
    ],
    tests: [
      { title: 'Upset subscriber cancels mid-onboarding', type: 'Chat',  scenes: 4 },
      { title: 'Security incident: tailgating report',    type: 'Email', scenes: 2 },
      { title: 'Objection handling — annual plan',         type: 'Call',  scenes: 6 },
    ],
  });
  const set = (k, v) => setA({ ...a, [k]: v });

  return (
    <StepperShell
      steps={steps} active={step} onStep={setStep}
      onPrev={() => setStep(Math.max(0, step - 1))}
      onNext={() => setStep(Math.min(steps.length - 1, step + 1))}
      onFinish={onClose} onClose={onClose}
    >
      {{
        header: <PageTitle title="Assessment"
                  subtitle="Create comprehensive assessments to evaluate skills, knowledge, and performance."/>,
        body: (
          <>
            {step === 0 && <AssessStepBasic a={a} set={set}/>}
            {step === 1 && <AssessStepTests a={a}/>}
            {step === 2 && <AssessStepGrading a={a} set={set}/>}
            {step === 3 && <AssessStepConfirm a={a} set={set}/>}
          </>
        ),
      }}
    </StepperShell>
  );
}

function AssessStepBasic({ a, set }) {
  const triggerOptions = [
    { value: 'onSubmit',   label: 'On submit' },
    { value: 'onTimeout',  label: 'On timeout' },
    { value: 'manual',     label: 'Manual (reviewer)' },
  ];
  const gradingTypeOptions = [
    { value: 'rubric',      label: 'Rubric' },
    { value: 'pass-fail',   label: 'Pass / fail' },
    { value: 'numerical',   label: 'Numerical score' },
  ];
  return (
    <FormSection title="Assessment Settings" subtitle="Basic settings for the assessment">
      <FormField label="Title" description="The title of the assessment">
        <Input value={a.title} onChange={e => set('title', e.target.value)} placeholder="Enter title"/>
      </FormField>

      <FormDivider/>

      <FormField label="Miscellaneous settings" description="Miscellaneous settings for the assessment">
        <Switch checked={a.requiresEmailConfirmation} onChange={v => set('requiresEmailConfirmation', v)} label="Email confirmation"/>
        <Switch checked={a.requiresIntegrityPledge}   onChange={v => set('requiresIntegrityPledge', v)}   label="Integrity pledge"/>
      </FormField>

      <FormDivider/>

      <FormField label="Assessment Objective" description="The objective of the assessment"
        leftBottom={<WordCount text={a.objective} limit={500}/>}>
        <Textarea value={a.objective} onChange={e => set('objective', e.target.value)} rows={4}
          placeholder="Enter assessment objective"/>
      </FormField>

      <FormDivider/>

      <FormField label="Assessment trigger" description="When will the assessment grading be triggered?">
        <Dropdown value={a.completionTrigger} options={triggerOptions} placeholder="Select a trigger"/>
      </FormField>

      <FormDivider/>

      <FormField label="What is being graded?" description="Set the grading type of the assessment">
        <Dropdown value={a.gradingType} options={gradingTypeOptions} placeholder="Select a grading type"/>
      </FormField>

      <FormDivider/>

      <FormField label="Grading categories" description="Setup the assessment's grading categories"
        leftBottom={<span style={{ font: `500 11px ${TS.fontSans}`, color: TS.surface400 }}>{a.rubric.length} / 10 categories</span>}>
        <CategoryList items={a.rubric}/>
      </FormField>
    </FormSection>
  );
}

function CategoryList({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {items.map((c, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
          border: `1px solid ${TS.surface200}`, borderRadius: 10, background: '#fff',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 9999, background: c.color }}/>
          <span style={{ flex: 1, font: `500 13px ${TS.fontSans}`, color: TS.surface800 }}>{c.name}</span>
          <IconButton icon="ellipsis" size="sm"/>
        </div>
      ))}
      <button style={{
        padding: '10px 12px', border: `1px dashed ${TS.surface300}`, borderRadius: 10,
        background: 'transparent', color: TS.surface500, cursor: 'pointer',
        font: `500 13px ${TS.fontSans}`, textAlign: 'left',
      }}>+ Add Category</button>
    </div>
  );
}

function AssessStepTests({ a }) {
  return (
    <FormSection title="Test Blocks" subtitle="Link tests to this assessment">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {a.tests.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 14,
            border: `1px solid ${TS.surface200}`, borderRadius: 10, background: '#fff',
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8, background: TS.primary50, color: TS.primary700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: `600 12px ${TS.fontSans}`, flexShrink: 0,
            }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ font: `600 14px ${TS.fontSans}`, color: TS.surface800 }}>{t.title}</div>
              <div style={{ font: `400 12px ${TS.fontSans}`, color: TS.surface500, marginTop: 2 }}>
                {t.type} · {t.scenes} scenes
              </div>
            </div>
            <IconButton icon="ellipsis" size="sm"/>
          </div>
        ))}
        <button style={{
          padding: '10px 12px', border: `1px dashed ${TS.surface300}`, borderRadius: 10,
          background: 'transparent', color: TS.primary700, cursor: 'pointer',
          font: `600 13px ${TS.fontSans}`, textAlign: 'left',
        }}>+ Add Test</button>
      </div>
    </FormSection>
  );
}

function AssessStepGrading({ a, set }) {
  const allocOpts = [
    { value: 'equal',    label: 'Equal allocation' },
    { value: 'weighted', label: 'Weighted allocation' },
  ];
  const weightOpts = [
    { value: 'average', label: 'Average of categories' },
    { value: 'sum',     label: 'Sum of categories' },
  ];
  return (
    <>
      <FormSection title="Grading settings" subtitle="Define how the assessment will be graded">
        <FormField label="Numerical scoring" description="Use numerical scoring for grading">
          <Switch checked={a.useNumericalScoring} onChange={v => set('useNumericalScoring', v)}/>
        </FormField>
        <FormField label="Category score allocation" description="How will the category scores be allocated?">
          <Dropdown value={a.categoryScoreAllocation} options={allocOpts} placeholder="Select a score allocation"/>
        </FormField>
        <FormField label="Category score weighting" description="How will the category scores be weighted?">
          <Dropdown value={a.categoryScoreWeighting} options={weightOpts} placeholder="Select a score weighting"/>
        </FormField>
      </FormSection>

      <FormDivider/>

      <FormSection title="Grading rubric" subtitle="Define the grading rubric for the assessment">
        <RubricMatrix categories={a.rubric}/>
      </FormSection>
    </>
  );
}

function RubricMatrix({ categories }) {
  const levels = ['Emerging', 'Developing', 'Proficient', 'Excellent'];
  const sample = {
    Empathy: ['Acknowledges feelings only if prompted.', 'Acknowledges feelings once; moves on.', 'Names and validates the specific concern.', 'Validates and reflects the subtext back.'],
    Accuracy: ['Multiple factual errors.', 'One minor factual error.', 'Facts correct; sources inferrable.', 'Facts correct; sources cited.'],
    'Resolution path': ['No clear path offered.', 'Generic path; no next step.', 'Clear path with a next step.', 'Path + owner + deadline.'],
    Tone: ['Off-register; reads defensive.', 'Neutral but flat.', 'Matches subscriber register.', 'Mirrors tone and de-escalates.'],
  };
  return (
    <div style={{
      width: '100%', border: `1px solid ${TS.surface200}`, borderRadius: 10,
      overflow: 'hidden', background: '#fff',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `160px repeat(${levels.length}, 1fr)`,
        background: TS.surface50, borderBottom: `1px solid ${TS.surface200}`,
      }}>
        <div style={{ padding: '10px 12px', font: `600 11px ${TS.fontSans}`, letterSpacing: '.05em', textTransform: 'uppercase', color: TS.surface500 }}>Category</div>
        {levels.map(l => (
          <div key={l} style={{ padding: '10px 12px', font: `600 11px ${TS.fontSans}`, letterSpacing: '.05em', textTransform: 'uppercase', color: TS.surface500, borderLeft: `1px solid ${TS.surface200}` }}>{l}</div>
        ))}
      </div>
      {categories.map((c, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: `160px repeat(${levels.length}, 1fr)`,
          borderBottom: i === categories.length - 1 ? 'none' : `1px solid ${TS.surface100}`,
        }}>
          <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: c.color }}/>
            <span style={{ font: `600 13px ${TS.fontSans}`, color: TS.surface800 }}>{c.name}</span>
          </div>
          {levels.map((l, j) => (
            <div key={j} style={{
              padding: 12, borderLeft: `1px solid ${TS.surface100}`,
              font: `400 12px/1.45 ${TS.fontSans}`, color: TS.surface600,
            }}>{sample[c.name]?.[j] ?? '—'}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AssessStepConfirm({ a, set }) {
  return (
    <FormSection title="Summary">
      <FormField label="Tests" description="Status of the tests connected to the assessment">
        <div style={{ display: 'flex', gap: 6 }}>
          <Tag color={TS.success600}>{a.tests.length} tests linked</Tag>
          <Tag color={TS.surface500}>All reachable</Tag>
        </div>
      </FormField>
      <FormField label="Grading categories" description="Status of the grading categories in the assessment">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {a.rubric.map((c, i) => (
            <Tag key={i} color={c.color}>{c.name}</Tag>
          ))}
        </div>
      </FormField>
      <FormDivider/>
      <FormField label="Publish" description="Publish the assessment">
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant={a.isPublished ? 'outline' : 'primary'} label="Draft" onClick={() => set('isPublished', false)}/>
          <Button variant={a.isPublished ? 'primary' : 'outline'} label="Published" onClick={() => set('isPublished', true)}/>
        </div>
      </FormField>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Button variant="primary" label="Preview Assessment" disabled/>
      </div>
    </FormSection>
  );
}

Object.assign(window, { AssessmentBuilder });
