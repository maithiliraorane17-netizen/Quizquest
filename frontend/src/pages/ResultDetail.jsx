import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Target, RotateCcw, Home, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
const GR={ 'A+':{ c:'#15803d', bg:'rgba(21,128,61,0.08)', b:'rgba(21,128,61,0.2)', label:'Outstanding!', emoji:'🏆' }, 'A':{ c:'#15803d', bg:'rgba(21,128,61,0.08)', b:'rgba(21,128,61,0.2)', label:'Excellent!', emoji:'⭐' }, 'B':{ c:'#0e7490', bg:'rgba(14,116,144,0.08)', b:'rgba(14,116,144,0.2)', label:'Great Job!', emoji:'👍' }, 'C':{ c:'#b45309', bg:'rgba(180,83,9,0.08)', b:'rgba(180,83,9,0.2)', label:'Good Effort', emoji:'📚' }, 'D':{ c:'#c2410c', bg:'rgba(194,65,12,0.08)', b:'rgba(194,65,12,0.2)', label:'Keep Trying', emoji:'💪' }, 'F':{ c:'#b91c1c', bg:'rgba(185,28,28,0.08)', b:'rgba(185,28,28,0.2)', label:'Try Again', emoji:'📖' } };
function Confetti({ active }) {
  const ref=useRef(null);
  useEffect(()=>{ if(!active) return; const cont=ref.current; const cols=['#6366f1','#8b5cf6','#10b981','#06b6d4','#f97316','#eab308','#ec4899']; const els=[]; for(let i=0;i<90;i++){ const el=document.createElement('div'); el.className='confetti-p'; el.style.cssText=`left:${Math.random()*100}vw;width:${Math.random()*10+4}px;height:${Math.random()*10+4}px;background:${cols[~~(Math.random()*cols.length)]};border-radius:${Math.random()>.5?'50%':'3px'};animation-duration:${Math.random()*2+1.5}s;animation-delay:${Math.random()*.8}s;`; cont.appendChild(el); els.push(el); } const t=setTimeout(()=>els.forEach(e=>e.remove()),4200); return ()=>{ clearTimeout(t); els.forEach(e=>e.remove()); }; },[active]);
  return <div ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }}/>;
}
export default function ResultDetail() {
  const {id}=useParams();
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(true);
  const [showAns,setShowAns]=useState(false); const [confetti,setConfetti]=useState(false); const [animPct,setAnimPct]=useState(0);
  useEffect(()=>{
    api.get(`/results/${id}`).then(({data})=>{
      setResult(data.result);
      if(['A+','A','B'].includes(data.result.grade)) setTimeout(()=>setConfetti(true),700);
      const tgt=data.result.percentage; let cur=0; const step=tgt/60;
      const iv=setInterval(()=>{ cur=Math.min(cur+step,tgt); setAnimPct(Math.round(cur)); if(cur>=tgt)clearInterval(iv); },16);
      return ()=>clearInterval(iv);
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[id]);
  if(loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin" style={{ width:36, height:36, border:'2px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%' }}/></div>;
  if(!result) return null;
  const g=GR[result.grade]||GR['F'];
  const circ=2*Math.PI*52; const dash=circ*(1-result.percentage/100);
  return (
    <div style={{ paddingTop:100, paddingBottom:80, minHeight:'100vh' }}>
      <Confetti active={confetti}/>
      <div className="page" style={{ maxWidth:800, margin:'0 auto' }}>
        <div className="asi" style={{ textAlign:'center', padding:'60px 36px', borderRadius:28, marginBottom:28, background:`linear-gradient(135deg,${g.bg},rgba(255,255,255,0.9))`, border:`1.5px solid ${g.b}`, backdropFilter:'blur(20px)', boxShadow:`0 20px 72px ${g.c}18` }}>
          <div className="score-pop" style={{ position:'relative', width:156, height:156, margin:'0 auto 28px' }}>
            <svg style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(229,231,235,0.5)" strokeWidth="9"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke={g.c} strokeWidth="9" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" className="score-ring" style={{ filter:`drop-shadow(0 0 8px ${g.c}44)` }}/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:36, fontWeight:900, color:'#1a1a2e', letterSpacing:'-1px' }}>{animPct}%</span>
            </div>
          </div>
          <div style={{ fontSize:50, marginBottom:14 }}>{g.emoji}</div>
          <h1 style={{ fontSize:30, fontWeight:800, color:'#1a1a2e', marginBottom:8, letterSpacing:'-0.5px' }}>{g.label}</h1>
          <p style={{ color:'#6b7280', marginBottom:18, fontSize:15 }}>{result.quizTitle}</p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 22px', borderRadius:99, fontWeight:800, fontSize:17, background:g.bg, color:g.c, border:`1.5px solid ${g.b}` }}>Grade: {result.grade}</div>
        </div>
        <div className="au" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14, marginBottom:24 }}>
          {[{icon:<CheckCircle size={20}/>,label:'Correct',val:result.correctAnswers,c:'#15803d',bg:'rgba(21,128,61,0.1)'},{icon:<XCircle size={20}/>,label:'Incorrect',val:result.wrongAnswers,c:'#b91c1c',bg:'rgba(185,28,28,0.1)'},{icon:<Target size={20}/>,label:'Score',val:`${result.score}pts`,c:'#6366f1',bg:'rgba(99,102,241,0.1)'},{icon:<Clock size={20}/>,label:'Time',val:`${Math.floor(result.timeTaken/60)}m ${result.timeTaken%60}s`,c:'#0e7490',bg:'rgba(14,116,144,0.1)'}].map(s=>(
            <div key={s.label} style={{ padding:'22px 18px', textAlign:'center', borderRadius:18, background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(12px)' }}>
              <div style={{ width:42, height:42, borderRadius:13, background:s.bg, color:s.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:800, color:'#1a1a2e', marginBottom:4 }}>{s.val}</div>
              <div style={{ fontSize:12, color:'#9ca3af' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="au d1" style={{ borderRadius:22, overflow:'hidden', background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', marginBottom:24, backdropFilter:'blur(12px)' }}>
          <button onClick={()=>setShowAns(!showAns)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 26px', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', color:'#1a1a2e', fontSize:15.5, fontWeight:700, transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.04)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
            <span>📋 Answer Breakdown ({result.answers.length} questions)</span>
            {showAns?<ChevronUp size={18} style={{ opacity:.5 }}/>:<ChevronDown size={18} style={{ opacity:.5 }}/>}
          </button>
          {showAns&&(
            <div style={{ borderTop:'1px solid rgba(229,231,235,0.6)' }}>
              {result.answers.map((a,i)=>(
                <div key={i} style={{ display:'flex', gap:14, padding:'18px 26px', borderBottom:i<result.answers.length-1?'1px solid rgba(229,231,235,0.4)':'none', background:a.isCorrect?'rgba(21,128,61,0.03)':'rgba(239,68,68,0.03)' }}>
                  <div style={{ flexShrink:0, marginTop:2 }}>{a.isCorrect?<CheckCircle size={16} color="#15803d"/>:<XCircle size={16} color="#b91c1c"/>}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:'#1a1a2e', fontSize:13.5, fontWeight:600, marginBottom:7, fontFamily:'JetBrains Mono,monospace', lineHeight:1.55 }}>{a.question}</p>
                    {a.userAnswer?<p style={{ fontSize:12, color:a.isCorrect?'#15803d':'#b91c1c', marginBottom:a.isCorrect?0:5 }}>Your answer: <strong style={{ fontFamily:'JetBrains Mono,monospace' }}>{a.userAnswer}</strong></p>:<p style={{ fontSize:12, color:'#9ca3af', marginBottom:5 }}>Skipped / Timed out</p>}
                    {!a.isCorrect&&<p style={{ fontSize:12, color:'#15803d' }}>Correct: <strong style={{ fontFamily:'JetBrains Mono,monospace' }}>{a.correctAnswer}</strong></p>}
                  </div>
                  <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#9ca3af', flexShrink:0, marginTop:2 }}>Q{i+1}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="au d2" style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
          <Link to="/quizzes" className="btn btn-ghost" style={{ textDecoration:'none' }}><RotateCcw size={15}/> Try Another</Link>
          <Link to="/" className="btn btn-primary" style={{ textDecoration:'none' }}><Home size={15}/> Back to Home</Link>
          <Link to="/results" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 22px', borderRadius:12, border:'1.5px solid rgba(99,102,241,0.22)', color:'#6366f1', textDecoration:'none', fontSize:14, fontWeight:600, background:'rgba(99,102,241,0.06)', transition:'all .2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.12)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(99,102,241,0.06)'}><Trophy size={15}/> All Results</Link>
        </div>
      </div>
    </div>
  );
}
