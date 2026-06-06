import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import api from '../utils/api';
const GC={ 'A+':'#15803d','A':'#15803d','B':'#0e7490','C':'#b45309','D':'#c2410c','F':'#b91c1c' };
export default function ResultPage() {
  const [results,setResults]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.get('/results').then(({data})=>setResults(data.results)).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  return (
    <div style={{ paddingTop:100, paddingBottom:80, minHeight:'100vh' }}>
      <div className="page" style={{ maxWidth:800, margin:'0 auto' }}>
        <div className="au" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:48 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'rgba(180,83,9,0.1)', border:'1px solid rgba(180,83,9,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}><Trophy size={22} color="#b45309"/></div>
          <div>
            <h1 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:800, color:'#1a1a2e', letterSpacing:'-0.5px' }}>My Results</h1>
            <p style={{ color:'#9ca3af', fontSize:14, marginTop:4 }}>{results.length} quiz{results.length!==1?'zes':''} completed</p>
          </div>
        </div>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>{[1,2,3].map(i=><div key={i} className="skel" style={{ height:88, borderRadius:18 }}/>)}</div>
        ) : results.length===0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:60, marginBottom:18 }}>📝</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:10 }}>No results yet</h3>
            <p style={{ color:'#9ca3af', marginBottom:24 }}>Take a quiz to see your results here!</p>
            <Link to="/quizzes" className="btn btn-primary" style={{ textDecoration:'none' }}><Zap size={15}/>Browse Quizzes</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {results.map((r,i)=>{ const gc=GC[r.grade]||'#6366f1'; return (
              <Link key={r._id} to={`/results/${r._id}`} className={`au d${Math.min(i+1,6)}`}
                style={{ display:'flex', alignItems:'center', gap:18, padding:'20px 26px', borderRadius:18, background:'rgba(255,255,255,0.85)', border:'1.5px solid rgba(229,231,235,0.7)', textDecoration:'none', transition:'all .25s', position:'relative', overflow:'hidden', backdropFilter:'blur(12px)' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.96)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 36px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.2)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.85)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(229,231,235,0.7)'; }}>
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:gc, borderRadius:'18px 0 0 18px' }}/>
                <div style={{ width:50, height:50, borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:19, background:`${gc}12`, color:gc, border:`1.5px solid ${gc}25`, flexShrink:0 }}>{r.grade}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={{ fontWeight:700, color:'#1a1a2e', fontSize:15, marginBottom:5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.quizTitle}</h3>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:14, fontSize:12, color:'#9ca3af' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><CheckCircle size={12} color="#15803d"/>{r.correctAnswers} correct</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><XCircle size={12} color="#b91c1c"/>{r.wrongAnswers} wrong</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={12}/>{new Date(r.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}><div style={{ fontSize:25, fontWeight:900, color:gc, letterSpacing:'-0.5px' }}>{r.percentage}%</div><div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>{r.score} pts</div></div>
                <ChevronRight size={15} style={{ color:'#d1d5db', flexShrink:0 }}/>
              </Link>
            ); })}
          </div>
        )}
      </div>
    </div>
  );
}
