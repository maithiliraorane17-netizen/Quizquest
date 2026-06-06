import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ChevronRight, Trophy } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
const CATS = [
  { name:'HTML',  icon:'🌐', desc:'Tags, attributes & semantics', color:'#c2410c', bg:'rgba(249,115,22,0.08)', border:'rgba(249,115,22,0.2)', pill:'#fff0e6', q:'30+' },
  { name:'CSS',   icon:'🎨', desc:'Styling, layout & animations', color:'#7c3aed', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.2)', pill:'#f3eeff', q:'50+' },
  { name:'JS',    icon:'⚡', desc:'Logic, async & DOM APIs',      color:'#b45309', bg:'rgba(234,179,8,0.08)',  border:'rgba(234,179,8,0.2)',  pill:'#fffbeb', q:'60+' },
  { name:'React', icon:'⚛️', desc:'Hooks, state & components',    color:'#0e7490', bg:'rgba(6,182,212,0.08)',  border:'rgba(6,182,212,0.2)',  pill:'#f0fdff', q:'40+' },
];
export default function Home() {
  const { isAuth } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.get('/quizzes'), api.get('/users/leaderboard')])
      .then(([{data:q},{data:l}]) => { setFeatured(q.quizzes.slice(0,3)); setLeaderboard(l.leaderboard.slice(0,5)); })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);
  const card = (styles) => ({ ...styles, background:'rgba(255,255,255,0.78)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)' });
  return (
    <div>
      <section style={{ padding:'148px 0 96px', textAlign:'center' }}>
        <div className="page">
          <div className="au" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', borderRadius:99, background:'rgba(237,233,254,0.85)', border:'1px solid rgba(196,181,253,0.5)', color:'#5b5bd6', fontSize:12.5, fontWeight:700, marginBottom:28, backdropFilter:'blur(8px)' }}>
            <Zap size={12} fill="currentColor"/> Master Frontend Development <Zap size={12} fill="currentColor"/>
          </div>
          <h1 className="au d1" style={{ fontSize:'clamp(42px,7vw,82px)', fontWeight:900, color:'#1a1a2e', lineHeight:1.04, letterSpacing:'-2px', marginBottom:22 }}>Level Up Your<br/><span className="g-text">Dev Skills</span></h1>
          <p className="au d2" style={{ fontSize:18, color:'#6b7280', lineHeight:1.72, maxWidth:500, margin:'0 auto 44px' }}>Test yourself with 200+ curated questions on HTML, CSS, JavaScript & React — timed challenges, instant grades, full breakdowns.</p>
          <div className="au d3" style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:14 }}>
            <Link to="/quizzes" className="btn btn-primary" style={{ textDecoration:'none', fontSize:16, padding:'15px 32px' }}><Zap size={17} fill="white"/> Start Quizzing <ArrowRight size={16}/></Link>
            {!isAuth && <Link to="/register" className="btn btn-ghost" style={{ textDecoration:'none', fontSize:15, padding:'14px 28px' }}>Create Free Account <ChevronRight size={16}/></Link>}
          </div>
          <div className="au d4" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 52px', marginTop:68, paddingTop:48, borderTop:'1px solid rgba(99,102,241,0.12)' }}>
            {[['200+','Questions'],['4','Categories'],['9','Quizzes'],['3','Levels']].map(([v,l])=>(
              <div key={l} style={{ textAlign:'center' }}><div style={{ fontSize:30, fontWeight:900, color:'#1a1a2e', letterSpacing:'-0.5px' }}>{v}</div><div style={{ fontSize:12, color:'#9ca3af', marginTop:4 }}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="page">
          <div className="au" style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'#1a1a2e', marginBottom:10, letterSpacing:'-0.5px' }}>Browse by <span className="g-text">Category</span></h2>
            <p style={{ color:'#9ca3af', fontSize:15 }}>Four core frontend topics — hundreds of hand-crafted questions</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:18 }}>
            {CATS.map((cat,i)=>(
              <Link key={cat.name} to={`/quizzes?category=${cat.name}`} className={`au d${i+1}`}
                style={{ display:'block', padding:'30px 26px', borderRadius:22, textDecoration:'none', background:'rgba(255,255,255,0.78)', border:`1.5px solid ${cat.border}`, textAlign:'center', backdropFilter:'blur(14px)', transition:'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.boxShadow=`0 22px 50px ${cat.border}`; e.currentTarget.style.borderColor=`${cat.color}55`; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=cat.border; }}>
                <div style={{ fontSize:40, marginBottom:16, lineHeight:1 }}>{cat.icon}</div>
                <div style={{ fontWeight:800, fontSize:19, color:cat.color, marginBottom:7 }}>{cat.name}</div>
                <div style={{ color:'#9ca3af', fontSize:13, marginBottom:14, lineHeight:1.5 }}>{cat.desc}</div>
                <div style={{ display:'inline-block', fontSize:11, fontWeight:700, padding:'4px 13px', borderRadius:99, background:cat.pill, color:cat.color }}>{cat.q} questions</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background:'rgba(255,255,255,0.45)', borderTop:'1px solid rgba(229,231,235,0.5)', borderBottom:'1px solid rgba(229,231,235,0.5)', backdropFilter:'blur(8px)' }}>
        <div className="page">
          <div className="au" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:44 }}>
            <div>
              <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'#1a1a2e', marginBottom:8, letterSpacing:'-0.5px' }}>Featured <span className="g-text">Quizzes</span></h2>
              <p style={{ color:'#9ca3af', fontSize:15 }}>Hand-picked challenges to sharpen your skills</p>
            </div>
            <Link to="/quizzes" style={{ display:'flex', alignItems:'center', gap:6, color:'#6366f1', textDecoration:'none', fontSize:14, fontWeight:600, transition:'gap .2s' }} onMouseEnter={e=>e.currentTarget.style.gap='10px'} onMouseLeave={e=>e.currentTarget.style.gap='6px'}>View All <ArrowRight size={15}/></Link>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:22 }}>{[1,2,3].map(i=><div key={i} className="skel" style={{ height:340 }}/>)}</div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:22 }}>{featured.map((q,i)=><QuizCard key={q._id} quiz={q} delay={i}/>)}</div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="page">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:48 }}>
            <div className="au">
              <h2 style={{ fontSize:24, fontWeight:800, color:'#1a1a2e', marginBottom:6 }}>🏆 Leaderboard</h2>
              <p style={{ color:'#9ca3af', fontSize:14, marginBottom:24 }}>Top performers of all time</p>
              <div style={{ background:'rgba(255,255,255,0.82)', border:'1px solid rgba(229,231,235,0.7)', borderRadius:20, overflow:'hidden', backdropFilter:'blur(14px)' }}>
                {leaderboard.length===0 ? <div style={{ padding:44, textAlign:'center', color:'#9ca3af', fontSize:14 }}>Be the first on the leaderboard!</div>
                : leaderboard.map((e,i)=>(
                  <div key={e._id} style={{ display:'flex', alignItems:'center', gap:14, padding:'15px 22px', borderBottom:i<leaderboard.length-1?'1px solid rgba(229,231,235,0.5)':'none', transition:'background .2s' }}
                    onMouseEnter={el=>el.currentTarget.style.background='rgba(99,102,241,0.04)'} onMouseLeave={el=>el.currentTarget.style.background='transparent'}>
                    <div style={{ width:30, height:30, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'white', flexShrink:0 }}>{e.username[0].toUpperCase()}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:'#1a1a2e' }}>{e.username}</div>
                      <div style={{ fontSize:12, color:'#9ca3af' }}>{e.totalQuizzesTaken} quizzes</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:'#b45309' }}>{e.totalScore.toLocaleString()}</div>
                      <div style={{ fontSize:11, color:'#9ca3af' }}>pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="au d2">
              <h2 style={{ fontSize:24, fontWeight:800, color:'#1a1a2e', marginBottom:6 }}>⚡ How It Works</h2>
              <p style={{ color:'#9ca3af', fontSize:14, marginBottom:24 }}>Three simple steps to mastery</p>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { num:'01', title:'Choose a Quiz', desc:'Browse by category, difficulty, or topic — find your perfect challenge.', icon:'🎯', color:'#6366f1' },
                  { num:'02', title:'Answer Fast', desc:'Multiple-choice with a countdown timer — think sharp and answer quick!', icon:'⏱️', color:'#10b981' },
                  { num:'03', title:'Get Your Grade', desc:'Instant A+→F grading with full answer review. Track your progress over time.', icon:'🏆', color:'#b45309' },
                ].map(item=>(
                  <div key={item.num} style={{ display:'flex', gap:18, padding:'22px 24px', borderRadius:18, background:'rgba(255,255,255,0.78)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(12px)', transition:'all .25s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform='translateX(5px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.2)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='translateX(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(229,231,235,0.7)'; }}>
                    <div style={{ fontSize:26, flexShrink:0, lineHeight:1.2 }}>{item.icon}</div>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', fontWeight:700, color:item.color }}>{item.num}</span>
                        <span style={{ fontWeight:700, fontSize:15, color:'#1a1a2e' }}>{item.title}</span>
                      </div>
                      <p style={{ color:'#9ca3af', fontSize:13.5, lineHeight:1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {!isAuth && (
        <section className="section">
          <div className="page">
            <div className="au" style={{ textAlign:'center', padding:'72px 40px', borderRadius:28, position:'relative', overflow:'hidden', background:'rgba(255,255,255,0.75)', border:'1.5px solid rgba(99,102,241,0.18)', backdropFilter:'blur(20px)', boxShadow:'0 20px 64px rgba(99,102,241,0.12)' }}>
              <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:500, height:200, background:'radial-gradient(ellipse,rgba(99,102,241,0.1),transparent 70%)', pointerEvents:'none' }}/>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:52, marginBottom:18 }}>🚀</div>
                <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#1a1a2e', marginBottom:14, letterSpacing:'-0.5px' }}>Ready to Test Your Skills?</h2>
                <p style={{ color:'#6b7280', fontSize:16, lineHeight:1.7, maxWidth:440, margin:'0 auto 32px' }}>Join thousands of developers sharpening their frontend knowledge every single day.</p>
                <Link to="/register" className="btn btn-primary" style={{ textDecoration:'none', fontSize:16, padding:'15px 36px' }}><Zap size={17} fill="white"/> Get Started Free</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
