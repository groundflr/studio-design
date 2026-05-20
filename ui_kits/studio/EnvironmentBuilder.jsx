// Traverse Studio — Environment builder
// Source: pages/[workspaceId]/environments/[environmentId].vue
// Single-page form (NOT a stepper): Environment settings + Workplace settings + Candidate + Relationships

function EnvironmentBuilder({ onClose }) {
  const [env, setEnv] = React.useState({
    environmentName: 'Project Management Experience',
    workplaceName: 'Banana Jam Studios',
    industryDescription: 'Software development and digital product design',
    workplaceAtmosphere: 'Fast-paced startup with a collaborative culture and flexible work hours. Async-heavy, with written-first norms and occasional bursts of real-time chat.',
    frequentlyUsedTerms: ['sprint', 'stand-up', 'retro', 'OKR'],
    values: ['Ship the work', 'Default to writing', 'Treat the customer seriously'],
    exclusions: ['No all-hands during Friday afternoons'],
    candidateRole: 'Intern Software Engineer',
    additionalCandidateContext: 'The candidate is new to this type of workplace environment and culture and has limited prior exposure to agile tooling.',
    relationships: [
      { character: 'Priya Rao',  role: 'Engineering Manager',  relation: 'Direct manager, 1:1 weekly' },
      { character: 'Devon Lee',  role: 'Senior Designer',      relation: 'Cross-functional partner' },
      { character: 'Alex Morgan', role: 'Product Lead',        relation: 'Skip-level; reviews milestones' },
    ],
  });
  const set = (k, v) => setEnv({ ...env, [k]: v });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <PageTitle title="Edit Environment"
          subtitle="Setup the workplace environment used in simulations and describe the relationships between the candidate and characters."/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '16px 24px 32px' }}>

          <FormSection title="Environment settings" subtitle="Setup the environment">
            <FormField label="Environment Name" description="Give the environment a name">
              <Input value={env.environmentName} onChange={e => set('environmentName', e.target.value)}
                placeholder="Project Management Experience"/>
            </FormField>
          </FormSection>

          <FormDivider/>

          <FormSection title="Workplace settings" subtitle="Describe the workplace environment used in simulations">
            <FormField label="Workplace Name" description="Give the workplace a name">
              <Input value={env.workplaceName} onChange={e => set('workplaceName', e.target.value)} placeholder="Banana Jam Studios"/>
            </FormField>
            <FormField label="Workplace Logo" description="Upload a logo image for the workplace">
              <UploadDropzone/>
            </FormField>
            <FormField label="Industry description" description="What industry is the workplace focused in?">
              <Input value={env.industryDescription} onChange={e => set('industryDescription', e.target.value)}
                placeholder="Software development and digital product design"/>
            </FormField>
            <FormField label="Working atmosphere" description="In just a few words, what is it like to work here?"
              leftBottom={<WordCount text={env.workplaceAtmosphere} limit={250}/>}>
              <Textarea value={env.workplaceAtmosphere} onChange={e => set('workplaceAtmosphere', e.target.value)}
                placeholder="Fast-paced startup with a collaborative culture..." rows={3}/>
            </FormField>
            <FormField label="Frequently used terms" description="What terms are often used, especially industry-specific terms?">
              <TextList items={env.frequentlyUsedTerms} buttonLabel="+ Add Term"/>
            </FormField>
            <FormField label="Values" description="Specific values to promote">
              <TextList items={env.values} buttonLabel="+ Add Value"/>
            </FormField>
            <FormField label="Exclusions" description="What should be excluded">
              <TextList items={env.exclusions} buttonLabel="+ Add Exclusion"/>
            </FormField>
          </FormSection>

          <FormDivider/>

          <FormSection title="Candidate" subtitle="Describe the candidate of this environment">
            <FormField label="Candidate Role" description="Describe the role of the candidate in the workplace">
              <Input value={env.candidateRole} onChange={e => set('candidateRole', e.target.value)} placeholder="Intern Software Engineer"/>
            </FormField>
            <FormField label="Additional Candidate Context" description="Any additional information about the candidate">
              <Textarea value={env.additionalCandidateContext} onChange={e => set('additionalCandidateContext', e.target.value)} rows={3}/>
            </FormField>
          </FormSection>

          <FormDivider/>

          <FormSection title="Candidate-Character relationships"
            subtitle="Describe the relationships between characters and candidate of this environment">
            <RelationshipList items={env.relationships}/>
          </FormSection>
        </div>
      </div>

      <div style={{
        height: 72, padding: '0 20px', borderTop: `1px solid ${TS.surface200}`, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <Button variant="ghost" icon="x" label="Delete environment"/>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" label="Cancel" onClick={onClose}/>
          <Button variant="primary" label="Save &amp; Close" onClick={onClose}/>
        </div>
      </div>
    </div>
  );
}

function UploadDropzone() {
  return (
    <div style={{
      border: `1px dashed ${TS.surface300}`, borderRadius: 10, padding: '24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      background: TS.surface50, cursor: 'pointer',
    }}>
      <Icon name="plus" size={18} color={TS.surface500}/>
      <span style={{ font: `500 13px ${TS.fontSans}`, color: TS.surface700 }}>Upload logo</span>
      <span style={{ font: `400 12px ${TS.fontSans}`, color: TS.surface400 }}>PNG or SVG · Up to 2MB</span>
    </div>
  );
}

function TextList({ items, buttonLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {items.map((t, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
          background: TS.surface50, border: `1px solid ${TS.surface200}`, borderRadius: 8,
        }}>
          <span style={{ flex: 1, font: `400 13px ${TS.fontSans}`, color: TS.surface800 }}>{t}</span>
          <IconButton icon="x" size="sm"/>
        </div>
      ))}
      <button style={{
        padding: '8px 10px', border: 0, background: 'transparent', color: TS.primary700,
        cursor: 'pointer', font: `600 13px ${TS.fontSans}`, textAlign: 'left',
      }}>{buttonLabel}</button>
    </div>
  );
}

function RelationshipList({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {items.map((r, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 12,
          border: `1px solid ${TS.surface200}`, borderRadius: 10, background: '#fff',
        }}>
          <Avatar initials={r.character.split(' ').map(x => x[0]).join('')} color={['#db2777', '#0d9488', TS.primary600][i % 3]}/>
          <div style={{ flex: 1 }}>
            <div style={{ font: `600 14px ${TS.fontSans}`, color: TS.surface800 }}>{r.character}</div>
            <div style={{ font: `400 12px ${TS.fontSans}`, color: TS.surface500 }}>{r.role} · {r.relation}</div>
          </div>
          <IconButton icon="ellipsis" size="sm"/>
        </div>
      ))}
      <button style={{
        padding: '10px 12px', border: `1px dashed ${TS.surface300}`, borderRadius: 10,
        background: 'transparent', color: TS.surface500, cursor: 'pointer',
        font: `500 13px ${TS.fontSans}`, textAlign: 'left',
      }}>+ Add Relationship</button>
    </div>
  );
}

Object.assign(window, { EnvironmentBuilder });
