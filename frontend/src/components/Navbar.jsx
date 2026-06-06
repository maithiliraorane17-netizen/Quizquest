import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Menu, X, User, Trophy, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const doLogout = () => { logout(); setDropOpen(false); setMobileOpen(false); navigate('/'); };

  const links = [
    { to:'/', label:'Home', end:true },
    { to:'/quizzes', label:'Quizzes' },
    { to:'/about', label:'About' },
    { to:'/contact', label:'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{ background: scrolled ? undefined : 'rgba(255,255,255,0.55)', backdropFilter: scrolled ? undefined : 'blur(16px)', WebkitBackdropFilter: scrolled ? undefined : 'blur(16px)', borderBottom: scrolled ? undefined : '1px solid rgba(255,255,255,0.7)' }}>
      <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>

        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
            <Zap size={17} color="white" fill="white" />
          </div>
          <span style={{ fontWeight:800, fontSize:19, color:'#1a1a2e' }}>
            Quiz<span className="g-text">Quest</span>
          </span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:2, position:'absolute', left:'50%', transform:'translateX(-50%)' }} className="desk-links">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              style={({ isActive }) => ({ padding:'8px 16px', borderRadius:10, textDecoration:'none', fontSize:14, fontWeight:500, transition:'all .2s', color: isActive ? '#6366f1' : '#6b7280', background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent' })}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }} className="desk-links">
          {isAuth ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:12, background:'rgba(255,255,255,0.8)', border:'1.5px solid rgba(229,231,235,0.8)', cursor:'pointer', color:'#1a1a2e', fontFamily:'inherit', fontSize:14, fontWeight:600, backdropFilter:'blur(8px)', transition:'all .2s' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'white', flexShrink:0 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                {user?.username}
                <ChevronDown size={13} style={{ opacity:.5, transition:'transform .2s', transform: dropOpen?'rotate(180deg)':'none' }} />
              </button>
              {dropOpen && (
                <div className="asi" style={{ position:'absolute', right:0, top:'calc(100% + 10px)', width:192, background:'rgba(255,255,255,0.96)', border:'1px solid rgba(229,231,235,0.8)', borderRadius:16, overflow:'hidden', boxShadow:'0 20px 56px rgba(99,102,241,0.18)', zIndex:200, padding:'6px 0', backdropFilter:'blur(16px)' }}>
                  {[{ to:'/profile', icon:<User size={14}/>, label:'Profile' }, { to:'/results', icon:<Trophy size={14}/>, label:'My Results' }].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)}
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', textDecoration:'none', color:'#6b7280', fontSize:14, fontWeight:500, transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.08)'; e.currentTarget.style.color='#1a1a2e'; }}
                      onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='#6b7280'; }}>
                      {item.icon}{item.label}
                    </Link>
                  ))}
                  <div style={{ margin:'4px 0', borderTop:'1px solid rgba(229,231,235,0.7)' }} />
                  <button onClick={doLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 16px', background:'none', border:'none', color:'#ef4444', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background='none'}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ padding:'8px 16px', borderRadius:10, textDecoration:'none', fontSize:14, fontWeight:500, color:'#6b7280', transition:'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color='#1a1a2e'} onMouseLeave={e => e.currentTarget.style.color='#6b7280'}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration:'none' }}>Get Started</Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="mob-btn"
          style={{ background:'none', border:'none', color:'#6b7280', cursor:'pointer', padding:8, borderRadius:8, display:'flex' }}>
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background:'rgba(255,255,255,0.95)', borderTop:'1px solid rgba(229,231,235,0.7)', padding:'16px 24px 24px', backdropFilter:'blur(24px)' }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({ display:'block', padding:'13px 16px', borderRadius:12, marginBottom:4, textDecoration:'none', fontSize:15, fontWeight:500, color: isActive?'#6366f1':'#6b7280', background: isActive?'rgba(99,102,241,0.08)':'transparent' })}>
              {l.label}
            </NavLink>
          ))}
          <div style={{ borderTop:'1px solid rgba(229,231,235,0.7)', margin:'12px 0' }} />
          {isAuth ? (
            <>
              <Link to="/profile" onClick={()=>setMobileOpen(false)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', color:'#6b7280', textDecoration:'none', fontSize:14, borderRadius:10 }}><User size={14}/>Profile</Link>
              <Link to="/results" onClick={()=>setMobileOpen(false)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', color:'#6b7280', textDecoration:'none', fontSize:14, borderRadius:10 }}><Trophy size={14}/>Results</Link>
              <button onClick={doLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'none', border:'none', color:'#ef4444', fontSize:14, cursor:'pointer', fontFamily:'inherit', borderRadius:10 }}><LogOut size={14}/>Sign Out</button>
            </>
          ) : (
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <Link to="/login" onClick={()=>setMobileOpen(false)} style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, border:'1.5px solid rgba(229,231,235,0.9)', color:'#6b7280', textDecoration:'none', fontSize:14, fontWeight:500 }}>Sign In</Link>
              <Link to="/register" onClick={()=>setMobileOpen(false)} style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', textDecoration:'none', fontSize:14, fontWeight:700 }}>Register</Link>
            </div>
          )}
        </div>
      )}
      <style>{`@media(min-width:769px){.mob-btn{display:none!important;}} @media(max-width:768px){.desk-links{display:none!important;}}`}</style>
    </nav>
  );
}
