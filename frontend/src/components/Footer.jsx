
import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(229,231,235,0.6)', background:'rgba(255,255,255,0.7)', backdropFilter:'blur(20px)', paddingTop:60, paddingBottom:36 }}>
      <div className="page">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:44, marginBottom:48 }}>
          <div style={{ gridColumn:'span 2' }}>
            <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:16 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}><Zap size={15} color="white" fill="white"/></div>
              <span style={{ fontWeight:800, fontSize:16, color:'#1a1a2e' }}>Quiz<span className="g-text">Quest</span></span>
            </Link>
            <p style={{ color:'#9ca3af', fontSize:13.5, lineHeight:1.7, maxWidth:260 }}>Master frontend development through engaging quizzes on HTML, CSS, JavaScript & React.</p>
            
          </div>
          {[
            { title:'Platform', links:[['/', 'Home'], ['/quizzes', 'All Quizzes'], ['/profile', 'My Profile'], ['/results', 'Results']] },
            { title:'Company', links:[['/about', 'About Us'], ['/contact', 'Contact']] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontWeight:700, fontSize:12, color:'#d1d5db', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>{col.title}</p>
              {col.links.map(([to,label]) => (
                <Link key={to} to={to} style={{ display:'block', color:'#9ca3af', textDecoration:'none', fontSize:14, marginBottom:10, transition:'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#6366f1'} onMouseLeave={e => e.currentTarget.style.color='#9ca3af'}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(229,231,235,0.6)', paddingTop:24, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <p style={{ color:'#d1d5db', fontSize:13 }}>© {new Date().getFullYear()} QuizQuest. All rights reserved.</p>
          <p style={{ color:'#d1d5db', fontSize:13, display:'flex', alignItems:'center', gap:5 }}>Made with <Heart size={12} fill="#ef4444" color="#ef4444"/> for frontend developers</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
