import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const {login,loading}=useAuth(); const navigate=useNavigate(); const location=useLocation();
  const from=location.state?.from?.pathname||'/';
  const [form,setForm]=useState({email:'',password:''}); const [show,setShow]=useState(false); const [errors,setErrors]=useState({});
  const validate=()=>{ const e={}; if(!form.email) e.email='Email required'; else if(!/\S+@\S+\.\S+/.test(form.email)) e.email='Invalid email'; if(!form.password) e.password='Password required'; return e; };
  const submit=async e=>{ e.preventDefault(); const errs=validate(); if(Object.keys(errs).length){setErrors(errs);return;} const res=await login(form.email,form.password); if(res.success) navigate(from,{replace:true}); };
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div className="au" style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:24 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 20px rgba(99,102,241,0.4)' }}><Zap size={20} color="white" fill="white"/></div>
            <span style={{ fontWeight:800, fontSize:21, color:'#1a1a2e' }}>Quiz<span className="g-text">Quest</span></span>
          </Link>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#1a1a2e', marginBottom:7, letterSpacing:'-0.5px' }}>Welcome back</h1>
          <p style={{ color:'#9ca3af', fontSize:15 }}>Sign in to continue your journey</p>
        </div>
        <div style={{ padding:36, borderRadius:26, background:'rgba(255,255,255,0.9)', border:'1.5px solid rgba(229,231,235,0.8)', backdropFilter:'blur(20px)', boxShadow:'0 16px 56px rgba(99,102,241,0.1)' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {[{id:'email',label:'Email',icon:<Mail size={15}/>,type:'email',placeholder:'you@example.com'}].map(f=>(
              <div key={f.id}>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:7 }}>{f.label}</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}>{f.icon}</span>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.id]} onChange={e=>{setForm(p=>({...p,[f.id]:e.target.value}));setErrors(p=>({...p,[f.id]:''}));}} className={`input input-icon ${errors[f.id]?'err':''}`}/>
                </div>
                {errors[f.id]&&<p style={{ color:'#b91c1c', fontSize:12, marginTop:5 }}>{errors[f.id]}</p>}
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:7 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                <input type={show?'text':'password'} placeholder="••••••••" value={form.password} onChange={e=>{setForm(p=>({...p,password:e.target.value}));setErrors(p=>({...p,password:''}));}} className={`input input-icon ${errors.password?'err':''}`} style={{ paddingRight:46 }}/>
                <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4 }}>{show?<EyeOff size={15}/>:<Eye size={15}/>}</button>
              </div>
              {errors.password&&<p style={{ color:'#b91c1c', fontSize:12, marginTop:5 }}>{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent:'center', marginTop:4, fontSize:15 }}>
              {loading?<div className="spin" style={{ width:18, height:18, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%' }}/>:<><ArrowRight size={17}/>Sign In</>}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center', color:'#9ca3af', fontSize:14, marginTop:22 }}>No account? <Link to="/register" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Create one free</Link></p>
      </div>
    </div>
  );
}
