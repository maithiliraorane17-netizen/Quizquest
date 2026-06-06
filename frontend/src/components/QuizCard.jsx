import { Link } from 'react-router-dom';
import { Zap, Clock, Users, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const C = {
  HTML:  { color:'#c2410c', bg:'rgba(249,115,22,0.08)', border:'rgba(249,115,22,0.2)', pill:'#fff0e6', shadow:'rgba(249,115,22,0.15)' },
  CSS:   { color:'#7c3aed', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.2)', pill:'#f3eeff', shadow:'rgba(139,92,246,0.15)' },
  JS:    { color:'#b45309', bg:'rgba(234,179,8,0.08)',  border:'rgba(234,179,8,0.2)',  pill:'#fffbeb', shadow:'rgba(234,179,8,0.15)' },
  React: { color:'#0e7490', bg:'rgba(6,182,212,0.08)',  border:'rgba(6,182,212,0.2)',  pill:'#f0fdff', shadow:'rgba(6,182,212,0.15)' },
  Mixed: { color:'#166534', bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.2)', pill:'#f0fdf4', shadow:'rgba(16,185,129,0.15)' },
};
const D = {
  easy:   { label:'Easy',   bg:'#f0fdf4', color:'#15803d' },
  medium: { label:'Medium', bg:'#fefce8', color:'#b45309' },
  hard:   { label:'Hard',   bg:'#fef2f2', color:'#b91c1c' },
  mixed:  { label:'Mixed',  bg:'#faf5ff', color:'#7c3aed' },
};

export default function QuizCard({ quiz, delay = 0 }) {
  const { isAuth } = useAuth();
  const c = C[quiz.category] || C.Mixed;
  const d = D[quiz.difficulty] || D.mixed;

  return (
    <div className={`au d${Math.min(delay + 1, 6)}`}
      style={{ background:'rgba(255,255,255,0.82)', border:`1.5px solid ${c.border}`, borderRadius:22, padding:26, display:'flex', flexDirection:'column', gap:0, backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', transition:'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .3s', cursor:'default', position:'relative', overflow:'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 20px 52px ${c.shadow}`; e.currentTarget.style.borderColor=c.color+'55'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=c.border; }}>

      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${c.color}66, transparent)` }} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
        <div style={{ width:54, height:54, borderRadius:16, background:c.bg, border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
          {quiz.icon}
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
          <span className="badge" style={{ background:c.bg, color:c.color, borderColor:c.border }}>{quiz.category}</span>
          <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:d.bg, color:d.color }}>{d.label}</span>
        </div>
      </div>

      {/* Title & desc */}
      <div style={{ flex:1 }}>
        <h3 style={{ fontWeight:800, fontSize:16.5, color:'#1a1a2e', marginBottom:9, lineHeight:1.35 }}>{quiz.title}</h3>
        <p style={{ color:'#9ca3af', fontSize:13.5, lineHeight:1.65, marginBottom:18, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{quiz.description}</p>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:18, paddingTop:14, borderTop:'1px solid rgba(229,231,235,0.6)', marginBottom:16 }}>
        {[{ icon:<Zap size={12}/>, text:`${quiz.totalQuestions}q`, col:'#b45309' }, { icon:<Clock size={12}/>, text:`${quiz.timeLimit}s`, col:'#0e7490' }, { icon:<Users size={12}/>, text:`${quiz.totalAttempts}`, col:'#7c3aed' }].map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#9ca3af' }}>
            <span style={{ color:s.col }}>{s.icon}</span>{s.text}
          </div>
        ))}
      </div>

      {/* Avg bar */}
      {quiz.averageScore > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:6 }}>
            <span style={{ color:'#9ca3af' }}>Avg Score</span>
            <span style={{ color:c.color, fontWeight:700 }}>{quiz.averageScore}%</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width:`${quiz.averageScore}%`, background:`linear-gradient(90deg,${c.color}66,${c.color})` }} />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display:'flex', gap:9 }}>
        <Link to={`/quizzes/${quiz._id}`} style={{ flex:1, textAlign:'center', padding:'10px 0', borderRadius:11, border:`1.5px solid ${c.border}`, color:c.color, textDecoration:'none', fontSize:13, fontWeight:700, background:'transparent', transition:'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background=c.bg} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          Details
        </Link>
        <Link to={isAuth ? `/quiz/${quiz._id}/play` : '/login'} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 20px', borderRadius:11, textDecoration:'none', fontSize:13, fontWeight:700, color:'white', background:`linear-gradient(135deg,${c.color}dd,${c.color})`, boxShadow:`0 4px 14px ${c.shadow}`, transition:'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; }} onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}>
          {isAuth ? <><Zap size={13} fill="white"/>Play</> : <><Lock size={13}/>Play</>}
        </Link>
      </div>
    </div>
  );
}
