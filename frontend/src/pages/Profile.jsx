import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Target, Zap, BookOpen, ChevronRight, Calendar, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
const GC={ 'A+':'#15803d','A':'#15803d','B':'#0e7490','C':'#b45309','D':'#c2410c','F':'#b91c1c' };
export default function Profile() {
  const {user}=useAuth(); const [stats,setStats]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.get('/users/profile').then(({data})=>setStats(data.stats)).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  return (
    <div style={{ paddingTop:100, paddingBottom:80, minHeight:'100vh' }}>
      <div className="page">
        <div style={{ display:'flex', alignItems:'center', gap:22, marginBottom:48 }}>
          <div style={{ width:76, height:76, borderRadius:22, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:900, color:'white', boxShadow:'0 8px 28px rgba(99,102,241,0.35)', flexShrink:0 }}>{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <h1 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#1a1a2e', letterSpacing:'-0.5px' }}>{user?.username}</h1>
            <p style={{ color:'#9ca3af', fontSize:14, marginTop:4 }}>{user?.email}</p>
            <p style={{ color:'#d1d5db', fontSize:12, marginTop:5, display:'flex', alignItems:'center', gap:5 }}><Calendar size={11}/> Member since {new Date(user?.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</p>
          </div>
        </div>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:36 }}>{[1,2,3,4].map(i=><div key={i} className="skel" style={{ height:110 }}/>)}</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:36 }}>
            {[{icon:<BookOpen size={20}/>,label:'Quizzes Taken',val:stats?.totalQuizzes||0,c:'#6366f1',bg:'rgba(99,102,241,0.1)'},{icon:<Trophy size={20}/>,label:'Total Score',val:(stats?.totalScore||0).toLocaleString(),c:'#b45309',bg:'rgba(180,83,9,0.1)'},{icon:<Target size={20}/>,label:'Avg Score',val:`${stats?.averageScore||0}%`,c:'#15803d',bg:'rgba(21,128,61,0.1)'},{icon:<Award size={20}/>,label:'Best Score',val:`${stats?.bestScore||0}%`,c:'#0e7490',bg:'rgba(14,116,144,0.1)'}].map(s=>(
              <div key={s.label} style={{ padding:'22px 18px', textAlign:'center', borderRadius:18, background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(12px)' }}>
                <div style={{ width:42, height:42, borderRadius:13, background:s.bg, color:s.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:800, color:'#1a1a2e', marginBottom:4 }}>{s.val}</div>
                <div style={{ fontSize:12, color:'#9ca3af' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ borderRadius:22, overflow:'hidden', background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 26px', borderBottom:'1px solid rgba(229,231,235,0.5)' }}>
            <h2 style={{ fontWeight:700, color:'#1a1a2e', fontSize:17 }}>Recent Quizzes</h2>
            <Link to="/results" style={{ color:'#6366f1', textDecoration:'none', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>View all <ChevronRight size={14}/></Link>
          </div>
          {!stats?.recentResults?.length ? (
            <div style={{ padding:'48px 20px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:14 }}>🎯</div>
              <p style={{ color:'#6b7280', fontWeight:500, marginBottom:10 }}>No quizzes taken yet</p>
              <Link to="/quizzes" style={{ display:'inline-flex', alignItems:'center', gap:7, marginTop:4, padding:'10px 20px', fontSize:13, borderRadius:11, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.18)', color:'#6366f1', textDecoration:'none', fontWeight:600 }}><Zap size={13}/>Start a Quiz</Link>
            </div>
          ) : stats.recentResults.map(r=>(
            <Link key={r._id} to={`/results/${r._id}`} style={{ display:'flex', alignItems:'center', gap:14, padding:'15px 26px', borderBottom:'1px solid rgba(229,231,235,0.4)', textDecoration:'none', transition:'background .2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.04)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, background:`${GC[r.grade]||'#6366f1'}12`, color:GC[r.grade]||'#6366f1', border:`1px solid ${GC[r.grade]||'#6366f1'}22`, flexShrink:0 }}>{r.grade}</div>
              <div style={{ flex:1, minWidth:0 }}><p style={{ fontWeight:700, color:'#1a1a2e', fontSize:14, marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.quizTitle}</p><p style={{ fontSize:12, color:'#9ca3af' }}>{new Date(r.completedAt).toLocaleDateString()}</p></div>
              <div style={{ textAlign:'right', flexShrink:0 }}><p style={{ fontWeight:800, fontSize:15, color:GC[r.grade]||'#6366f1' }}>{r.percentage}%</p><p style={{ fontSize:11, color:'#9ca3af' }}>{r.score} pts</p></div>
              <ChevronRight size={14} style={{ color:'#d1d5db', flexShrink:0 }}/>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
