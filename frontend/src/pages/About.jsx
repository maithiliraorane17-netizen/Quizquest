export default function About() {
  const topics=[{name:'HTML',icon:'🌐',role:'Structure & Semantics',color:'#c2410c',bg:'rgba(249,115,22,0.08)',border:'rgba(249,115,22,0.2)'},{name:'CSS',icon:'🎨',role:'Styling & Animations',color:'#7c3aed',bg:'rgba(139,92,246,0.08)',border:'rgba(139,92,246,0.2)'},{name:'JavaScript',icon:'⚡',role:'Logic & Interactivity',color:'#b45309',bg:'rgba(234,179,8,0.08)',border:'rgba(234,179,8,0.2)'},{name:'React',icon:'⚛️',role:'Components & Hooks',color:'#0e7490',bg:'rgba(6,182,212,0.08)',border:'rgba(6,182,212,0.2)'}];
  return (
    <div style={{ paddingTop:100, paddingBottom:80, minHeight:'100vh' }}>
      <div className="page">
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <h1 className="au" style={{ fontSize:'clamp(34px,5vw,56px)', fontWeight:900, color:'#1a1a2e', marginBottom:16, letterSpacing:'-1px' }}>About <span className="g-text">QuizQuest</span></h1>
          <p className="au d1" style={{ color:'#6b7280', fontSize:17, maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>A platform built for developers who want to sharpen their frontend skills through interactive, timed quizzes.</p>
        </div>
        <div className="au d1" style={{ padding:'36px 40px', borderRadius:24, background:'rgba(255,255,255,0.82)', border:'1.5px solid rgba(99,102,241,0.15)', backdropFilter:'blur(16px)', marginBottom:28, boxShadow:'0 8px 32px rgba(99,102,241,0.08)' }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:14 }}>Our Mission</h2>
          <p style={{ color:'#6b7280', lineHeight:1.75, fontSize:15 }}>We believe the best way to learn is through practice. QuizQuest lets developers of all levels test their knowledge, identify knowledge gaps, and grow their skills with immediate, actionable feedback.</p>
        </div>
        <div className="au d2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14, marginBottom:48 }}>
          {[['200+','Questions','#6366f1'],['4','Categories','#10b981'],['9','Quizzes','#0e7490'],['3','Levels','#b45309']].map(([v,l,c])=>(
            <div key={l} style={{ padding:'22px 16px', textAlign:'center', borderRadius:18, background:'rgba(255,255,255,0.82)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(12px)' }}>
              <div style={{ fontSize:28, fontWeight:900, color:c, letterSpacing:'-0.5px', marginBottom:5 }}>{v}</div>
              <div style={{ fontSize:13, color:'#9ca3af' }}>{l}</div>
            </div>
          ))}
        </div>
        <h2 className="au" style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:22 }}>What We Cover</h2>
        <div className="au d1" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:48 }}>
          {topics.map(t=>(
            <div key={t.name} style={{ padding:'26px 22px', borderRadius:20, textAlign:'center', background:'rgba(255,255,255,0.82)', border:`1.5px solid ${t.border}`, backdropFilter:'blur(12px)', transition:'transform .25s, box-shadow .25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 16px 40px ${t.border}`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ fontSize:36, marginBottom:14 }}>{t.icon}</div>
              <h3 style={{ fontWeight:700, color:t.color, marginBottom:6 }}>{t.name}</h3>
              <p style={{ color:'#9ca3af', fontSize:13 }}>{t.role}</p>
            </div>
          ))}
        </div>
        <div className="au d2" style={{ padding:'36px 40px', borderRadius:24, background:'rgba(255,255,255,0.82)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(14px)' }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:28 }}>Why QuizQuest?</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:28 }}>
            {[{emoji:'🎯',title:'Curated Questions',desc:'Every question tests real-world knowledge — not trivial details.'},{emoji:'⏱️',title:'Timed Challenges',desc:'Practice under pressure with per-question countdowns.'},{emoji:'📊',title:'Instant Feedback',desc:'Full A+→F grading with complete answer breakdowns.'}].map(item=>(
              <div key={item.title}>
                <div style={{ fontSize:30, marginBottom:12 }}>{item.emoji}</div>
                <h3 style={{ fontWeight:700, color:'#1a1a2e', marginBottom:8, fontSize:15 }}>{item.title}</h3>
                <p style={{ color:'#9ca3af', fontSize:13.5, lineHeight:1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
