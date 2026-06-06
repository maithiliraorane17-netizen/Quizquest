import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronLeft, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
const CC={ HTML:'#c2410c', CSS:'#7c3aed', JS:'#b45309', React:'#0e7490', Mixed:'#166534' };
const CB={ HTML:'rgba(249,115,22,0.12)', CSS:'rgba(139,92,246,0.12)', JS:'rgba(234,179,8,0.12)', React:'rgba(6,182,212,0.12)', Mixed:'rgba(16,185,129,0.12)' };
export default function QuizDetail() {
  const {id}=useParams(); const {isAuth}=useAuth(); const navigate=useNavigate();
  const [quiz,setQuiz]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.get(`/quizzes/${id}`).then(({data})=>setQuiz(data.quiz)).catch(()=>navigate('/404')).finally(()=>setLoading(false)); },[id]);
  if(loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin" style={{ width:36, height:36, border:'2px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%' }}/></div>;
  if(!quiz) return null;
  const color=CC[quiz.category]||'#6366f1';
  const cbg=CB[quiz.category]||'rgba(99,102,241,0.1)';
  const rules=[`Each question has 4 options — only 1 correct.`,`You have ${quiz.timeLimit} seconds per question.`,'Once selected, answer cannot be changed.','Unanswered questions count as wrong.','Results are saved to your profile automatically.'];
  return (
    <div style={{ paddingTop:104, paddingBottom:88, minHeight:'100vh' }}>
      <div className="page">
        <Link to="/quizzes" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#9ca3af', textDecoration:'none', fontSize:14, fontWeight:500, marginBottom:40, transition:'color .2s' }}
          onMouseEnter={e=>e.currentTarget.style.color='#6366f1'} onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}>
          <ChevronLeft size={16}/> Back to Quizzes
        </Link>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:32, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
            <div className="au" style={{ padding:40, borderRadius:24, background:`linear-gradient(135deg,${cbg},rgba(255,255,255,0.85))`, border:`1.5px solid ${color}22`, backdropFilter:'blur(16px)' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:22 }}>
                <div style={{ width:70, height:70, borderRadius:20, background:cbg, border:`1.5px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0 }}>{quiz.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
                    <span className="badge" style={{ background:cbg, color, borderColor:`${color}30` }}>{quiz.category}</span>
                    <span className="badge" style={{ background:'rgba(229,231,235,0.6)', color:'#6b7280', borderColor:'rgba(229,231,235,0.8)', textTransform:'capitalize' }}>{quiz.difficulty}</span>
                  </div>
                  <h1 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, color:'#1a1a2e', marginBottom:12, letterSpacing:'-0.4px' }}>{quiz.title}</h1>
                  <p style={{ color:'#6b7280', lineHeight:1.72, fontSize:15 }}>{quiz.description}</p>
                </div>
              </div>
            </div>
            <div className="au d1" style={{ padding:34, borderRadius:22, background:'rgba(255,255,255,0.82)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(14px)' }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#1a1a2e', marginBottom:22 }}>📋 Quiz Rules</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {rules.map((r,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <CheckCircle size={16} style={{ color:'#6366f1', flexShrink:0, marginTop:2 }}/>
                    <p style={{ color:'#6b7280', fontSize:14.5, lineHeight:1.65 }}>{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:18, position:'sticky', top:90 }}>
            <div className="au d1" style={{ padding:26, borderRadius:22, background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(14px)' }}>
              <h3 style={{ fontWeight:700, color:'#1a1a2e', marginBottom:18, fontSize:15 }}>Quiz Info</h3>
              {[{icon:'⚡',label:'Questions',val:quiz.totalQuestions},{icon:'⏱️',label:'Time per Q',val:`${quiz.timeLimit}s`},{icon:'👥',label:'Attempts',val:quiz.totalAttempts},{icon:'🎯',label:'Avg Score',val:quiz.averageScore>0?`${quiz.averageScore}%`:'N/A'},{icon:'⭐',label:'Max Score',val:`${quiz.totalQuestions*10} pts`}].map(item=>(
                <div key={item.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(229,231,235,0.5)' }}>
                  <span style={{ color:'#9ca3af', fontSize:13.5, display:'flex', alignItems:'center', gap:7 }}>{item.icon} {item.label}</span>
                  <span style={{ color:'#1a1a2e', fontWeight:700, fontSize:14 }}>{item.val}</span>
                </div>
              ))}
            </div>
            <div className="au d2" style={{ padding:22, borderRadius:18, background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(14px)' }}>
              <h3 style={{ fontWeight:700, color:'#1a1a2e', marginBottom:14, fontSize:14 }}>Grading Scale</h3>
              {[['A+','95–100%','#15803d'],['A','85–94%','#15803d'],['B','70–84%','#0e7490'],['C','55–69%','#b45309'],['D','40–54%','#c2410c'],['F','0–39%','#b91c1c']].map(([g,r,c])=>(
                <div key={g} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ fontWeight:800, fontSize:14, color:c, width:24 }}>{g}</span>
                  <div style={{ flex:1, height:3, borderRadius:99, background:'rgba(229,231,235,0.7)', overflow:'hidden' }}><div style={{ height:'100%', borderRadius:99, background:c, width:g==='A+'?'100%':g==='A'?'90%':g==='B'?'77%':g==='C'?'62%':g==='D'?'47%':'20%' }}/></div>
                  <span style={{ color:'#9ca3af', fontSize:11, minWidth:55, textAlign:'right' }}>{r}</span>
                </div>
              ))}
            </div>
            <div className="au d3">
              {isAuth ? (
                <Link to={`/quiz/${id}/play`} className="btn btn-primary" style={{ textDecoration:'none', width:'100%', justifyContent:'center', fontSize:16, padding:'15px', background:`linear-gradient(135deg,${color}dd,${color})`, boxShadow:`0 8px 28px ${color}25` }}>
                  <Zap size={17} fill="white"/> Start Quiz Now
                </Link>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <Link to="/login" className="btn btn-primary" style={{ textDecoration:'none', width:'100%', justifyContent:'center', fontSize:15, padding:'14px' }}><Lock size={15}/> Sign In to Play</Link>
                  <p style={{ textAlign:'center', color:'#9ca3af', fontSize:13 }}>No account? <Link to="/register" style={{ color:'#6366f1', textDecoration:'none', fontWeight:700 }}>Register free</Link></p>
                </div>
              )}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:820px){.quiz-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </div>
  );
}
