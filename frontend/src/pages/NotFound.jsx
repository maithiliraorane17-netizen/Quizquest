import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ textAlign:'center' }}>
        <div className="au" style={{ fontSize:'clamp(80px,15vw,140px)', fontWeight:900, lineHeight:1, background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:24 }}>404</div>
        <h1 className="au d1" style={{ fontSize:26, fontWeight:700, color:'#1a1a2e', marginBottom:10 }}>Page not found</h1>
        <p className="au d2" style={{ color:'#9ca3af', fontSize:15, marginBottom:32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <div className="au d3" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
          <Link to="/" className="btn btn-primary" style={{ textDecoration:'none' }}>Go Home</Link>
          <Link to="/quizzes" className="btn btn-ghost" style={{ textDecoration:'none' }}>Browse Quizzes</Link>
        </div>
      </div>
    </div>
  );
}
