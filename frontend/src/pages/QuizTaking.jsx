import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CC={ HTML:'#c2410c', CSS:'#7c3aed', JS:'#b45309', React:'#0e7490', Mixed:'#166534' };
const CB={ HTML:'rgba(249,115,22,0.1)', CSS:'rgba(139,92,246,0.1)', JS:'rgba(234,179,8,0.1)', React:'rgba(6,182,212,0.1)', Mixed:'rgba(16,185,129,0.1)' };
const LABS=['A','B','C','D'];
export default function QuizTaking() {
  const {id}=useParams(); const navigate=useNavigate();
  const [quiz,setQuiz]=useState(null); const [qs,setQs]=useState([]);
  const [loading,setLoading]=useState(true); const [cur,setCur]=useState(0);
  const [sel,setSel]=useState(null); const [done,setDone]=useState(false);
  const [answers,setAnswers]=useState([]); const [timeLeft,setTimeLeft]=useState(30);
  const [submitting,setSubmitting]=useState(false);
  const timer=useRef(null); const t0=useRef(Date.now());
  useEffect(()=>{
    api.get(`/quizzes/${id}/questions`).then(({data})=>{ setQuiz(data.quiz); setQs(data.questions); setTimeLeft(data.quiz.timeLimit); }).catch(()=>{ toast.error('Failed to load quiz'); navigate('/quizzes'); }).finally(()=>setLoading(false));
    return ()=>clearInterval(timer.current);
  },[id]);
  useEffect(()=>{
    if(!quiz||done||loading) return;
    timer.current=setInterval(()=>{ setTimeLeft(t=>{ if(t<=1){ clearInterval(timer.current); onTimeout(); return 0; } return t-1; }); },1000);
    return ()=>clearInterval(timer.current);
  },[cur,done,quiz,loading]);
  const onTimeout=useCallback(()=>{ if(done) return; setDone(true); setAnswers(p=>[...p,{questionId:qs[cur]?.questionId,userAnswer:''}]); },[done,qs,cur]);
  const onSelect=opt=>{ if(done) return; clearInterval(timer.current); setSel(opt); setDone(true); setAnswers(p=>[...p,{questionId:qs[cur].questionId,userAnswer:opt}]); };
  const onNext=()=>{ if(cur+1>=qs.length){ submit(); return; } setCur(c=>c+1); setSel(null); setDone(false); setTimeLeft(quiz.timeLimit); };
  const submit=async()=>{
    setSubmitting(true);
    const timeTaken=Math.floor((Date.now()-t0.current)/1000);
    try {
      const final=[...answers];
      qs.forEach(q=>{ if(!final.find(a=>a.questionId===q.questionId)) final.push({questionId:q.questionId,userAnswer:''}); });
      const {data}=await api.post(`/quizzes/${id}/submit`,{answers:final,timeTaken});
      navigate(`/results/${data.result._id}`);
    } catch { toast.error('Submit failed'); setSubmitting(false); }
  };
  if(loading||!quiz) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, background:'#f4f3ff' }}><div className="spin" style={{ width:44, height:44, border:'2px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%' }}/><p style={{ color:'#9ca3af', fontSize:14 }}>Loading quiz...</p></div>;
  if(submitting) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, background:'#f4f3ff' }}><div className="spin" style={{ width:52, height:52, border:'2px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%' }}/><div style={{ textAlign:'center' }}><p style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:6 }}>Submitting...</p><p style={{ color:'#9ca3af', fontSize:14 }}>Calculating your results</p></div></div>;
  const q=qs[cur];
  const color=CC[quiz.category]||'#6366f1';
  const cbg=CB[quiz.category]||'rgba(99,102,241,0.1)';
  const progress=((cur+(done?1:0))/qs.length)*100;
  const tPct=(timeLeft/quiz.timeLimit)*100;
  const tColor=timeLeft<=5?'#b91c1c':timeLeft<=10?'#c2410c':'#15803d';
  const circ=87.96;
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#faf9ff,#f0eeff 40%,#e8f4ff 80%,#f0fff8)', display:'flex', flexDirection:'column', paddingTop:68 }}>
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(229,231,235,0.7)', padding:'13px 0', boxShadow:'0 2px 16px rgba(99,102,241,0.08)' }}>
        <div className="page" style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#9ca3af', marginBottom:7 }}>
              <span style={{ fontWeight:600, color:'#6b7280' }}>Question {cur+1}<span style={{ opacity:.5 }}> / {qs.length}</span></span>
              <span style={{ fontWeight:700, color }}>{Math.round(progress)}%</span>
            </div>
            <div className="prog-track"><div className="prog-fill" style={{ width:`${progress}%`, background:`linear-gradient(90deg,${color}66,${color})` }}/></div>
          </div>
          <div style={{ position:'relative', width:44, height:44, flexShrink:0 }}>
            <svg style={{ width:44, height:44, transform:'rotate(-90deg)' }} viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(229,231,235,0.8)" strokeWidth="3"/>
              <circle cx="18" cy="18" r="14" fill="none" stroke={tColor} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={circ*(1-tPct/100)} strokeLinecap="round" className="timer-ring" style={{ filter:`drop-shadow(0 0 3px ${tColor}44)` }}/>
            </svg>
            <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:tColor, fontFamily:'JetBrains Mono,monospace' }}>{timeLeft}</span>
          </div>
          <button onClick={()=>{ if(window.confirm('Quit? Progress will be lost.')) navigate(`/quizzes/${id}`); }}
            style={{ width:36, height:36, borderRadius:10, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#ef4444', transition:'all .2s', flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.12)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.06)'}>
            <X size={15}/>
          </button>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'36px 16px 88px' }}>
        <div style={{ width:'100%', maxWidth:640 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:26 }}>
            <span className="badge" style={{ background:cbg, color, borderColor:`${color}30` }}>{q?.category}</span>
            <span style={{ fontSize:12, color:'#9ca3af', textTransform:'capitalize' }}>{q?.difficulty}</span>
          </div>
          <div style={{ padding:34, borderRadius:22, background:'rgba(255,255,255,0.92)', border:'1.5px solid rgba(229,231,235,0.8)', marginBottom:22, boxShadow:'0 6px 32px rgba(99,102,241,0.08)', backdropFilter:'blur(14px)' }}>
            <p style={{ fontSize:18, fontWeight:600, color:'#1a1a2e', lineHeight:1.65, fontFamily:'JetBrains Mono,monospace' }}>{q?.question}</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {q?.options.map((opt,i)=>{
              const picked=sel===opt;
              return (
                <button key={opt} onClick={()=>onSelect(opt)} disabled={done} className={`opt-btn ${picked?'picked':''}`}
                  style={{ borderColor:picked?`${color}55`:'rgba(229,231,235,0.8)', background:picked?cbg:'rgba(255,255,255,0.78)', color:done?(picked?color:'#d1d5db'):'#6b7280' }}>
                  <span style={{ width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0, background:picked?cbg:'rgba(243,244,246,0.8)', color:picked?color:'#9ca3af', transition:'all .18s' }}>{LABS[i]}</span>
                  <span style={{ fontSize:14.5, fontFamily:'JetBrains Mono,monospace', fontWeight:500, lineHeight:1.5 }}>{opt}</span>
                  {picked&&<div style={{ marginLeft:'auto', width:20, height:20, borderRadius:'50%', background:cbg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><div style={{ width:9, height:9, borderRadius:'50%', background:color }}/></div>}
                </button>
              );
            })}
          </div>
          {done&&!sel&&<div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10, padding:'13px 17px', borderRadius:13, background:'rgba(254,242,242,0.9)', border:'1px solid rgba(239,68,68,0.2)', color:'#b91c1c', fontSize:14 }}><AlertCircle size={16}/> Time's up! This question was skipped.</div>}
          {done&&<button onClick={onNext} style={{ marginTop:20, width:'100%', padding:'15px', borderRadius:14, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:16, fontWeight:700, color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:`linear-gradient(135deg,${color}dd,${color})`, boxShadow:`0 8px 26px ${color}25`, transition:'transform .2s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            {cur+1>=qs.length?'🏁 Submit Quiz':<>Next Question <ChevronRight size={20}/></>}
          </button>}
        </div>
      </div>
      <div style={{ position:'fixed', bottom:24, left:0, right:0, display:'flex', justifyContent:'center', gap:5 }}>
        {qs.map((_,i)=><div key={i} style={{ borderRadius:99, transition:'all .3s', background:answers[i]!==undefined?color:i===cur?color:'rgba(209,213,219,0.6)', width:i===cur?22:6, height:6, opacity:i===cur?1:answers[i]!==undefined?0.8:0.4 }}/>)}
      </div>
    </div>
  );
}
