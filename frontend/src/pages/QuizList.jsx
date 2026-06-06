import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import api from '../utils/api';
const CATS=['All','HTML','CSS','JS','React','Mixed'];
const DIFFS=['All','easy','medium','hard','mixed'];
export default function QuizList() {
  const [sp]=useSearchParams();
  const [quizzes,setQuizzes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [cat,setCat]=useState(sp.get('category')||'All');
  const [diff,setDiff]=useState('All');
  useEffect(()=>{
    setLoading(true);
    const p=new URLSearchParams();
    if(cat!=='All')p.append('category',cat);
    if(diff!=='All')p.append('difficulty',diff);
    api.get(`/quizzes?${p}`).then(({data})=>setQuizzes(data.quizzes)).catch(()=>setQuizzes([])).finally(()=>setLoading(false));
  },[cat,diff]);
  console.log("QUIZZES STATE:", quizzes);
  const filtered=quizzes.filter(q=>q.title.toLowerCase().includes(search.toLowerCase())||q.description.toLowerCase().includes(search.toLowerCase()));
  const pill=(active,ac)=>({ padding:'9px 17px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', border:'1.5px solid', transition:'all .2s', background:active?`${ac}14`:'rgba(255,255,255,0.7)', borderColor:active?`${ac}44`:'rgba(229,231,235,0.7)', color:active?ac:'#6b7280', backdropFilter:'blur(8px)' });
  return (
    <div style={{ paddingTop:104, paddingBottom:88, minHeight:'100vh' }}>
      <div className="page">
        <div className="au" style={{ marginBottom:48 }}>
          <h1 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:900, color:'#1a1a2e', marginBottom:10, letterSpacing:'-1px' }}>All Quizzes</h1>
          <p style={{ color:'#9ca3af', fontSize:15 }}>{loading?'Loading...':`${filtered.length} quiz${filtered.length!==1?'zes':''} available`}</p>
        </div>
        <div className="au d1" style={{ padding:'22px 24px', background:'rgba(255,255,255,0.78)', border:'1.5px solid rgba(229,231,235,0.7)', borderRadius:20, marginBottom:40, display:'flex', flexWrap:'wrap', gap:14, alignItems:'center', backdropFilter:'blur(16px)' }}>
          <div style={{ position:'relative', minWidth:210, flex:1, maxWidth:300 }}>
            <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search quizzes..." className="input input-icon" style={{ paddingRight:search?44:16 }}/>
            {search&&<button onClick={()=>setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4, borderRadius:6 }}><X size={14}/></button>}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>{CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={pill(cat===c,'#6366f1')}>{c}</button>)}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {DIFFS.map(d=>{
              const dc=d==='easy'?'#15803d':d==='medium'?'#b45309':d==='hard'?'#b91c1c':d==='mixed'?'#7c3aed':'#6366f1';
              return <button key={d} onClick={()=>setDiff(d)} style={{ ...pill(diff===d,dc), textTransform:'capitalize' }}>{d}</button>;
            })}
          </div>
        </div>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:22 }}>{[...Array(6)].map((_,i)=><div key={i} className="skel" style={{ height:340 }}/>)}</div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:60, marginBottom:18 }}>🔍</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:10 }}>No quizzes found</h3>
            <button onClick={()=>{setSearch('');setCat('All');setDiff('All');}} style={{ padding:'11px 22px', borderRadius:11, border:'1.5px solid rgba(99,102,241,0.25)', background:'rgba(99,102,241,0.08)', color:'#6366f1', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', marginTop:8 }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:22 }}>{filtered.map((q,i)=><QuizCard key={q._id} quiz={q} delay={i}/>)}</div>
        )}
      </div>
    </div>
  );
}
