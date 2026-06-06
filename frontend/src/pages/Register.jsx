import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const {register,loading}=useAuth(); const navigate=useNavigate();
  const [form,setForm]=useState({username:'',email:'',password:'',confirm:''});
  const [show,setShow]=useState(false); const [errors,setErrors]=useState({});
  const validate=()=>{ const e={}; if(!form.username) e.username='Required'; else if(form.username.length<3) e.username='Min 3 chars'; if(!form.email) e.email='Required'; else if(!/\S+@\S+\.\S+/.test(form.email)) e.email='Invalid email'; if(!form.password) e.password='Required'; else if(form.password.length<6) e.password='Min 6 chars'; if(form.password!==form.confirm) e.confirm='Passwords do not match'; return e; };
  const submit=async e=>{ e.preventDefault(); const errs=validate(); if(Object.keys(errs).length){setErrors(errs);return;} const res=await register(form.username,form.email,form.password); if(res.success) navigate('/'); };
  const set=(id,val)=>{ setForm(f=>({...f,[id]:val})); setErrors(e=>({...e,[id]:''})); };
  const s=()=>{ if(!form.password) return null; if(form.password.length<6) return{label:'Weak',c:'#b91c1c',w:'33%'}; if(form.password.length<10) return{label:'Fair',c:'#c2410c',w:'66%'}; return{label:'Strong',c:'#15803d',w:'100%'}; };
  const strength=s();
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 16px' }}>
      <div className="au" style={{ width:'100%', maxWidth:520, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:22 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 20px rgba(99,102,241,0.4)' }}><Zap size={20} color="white" fill="white"/></div>
            <span style={{ fontWeight:800, fontSize:21, color:'#1a1a2e' }}>Quiz<span className="g-text">Quest</span></span>
          </Link>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#1a1a2e', marginBottom:7, letterSpacing:'-0.5px' }}>Create your account</h1>
          <p style={{ color:'#9ca3af', fontSize:15 }}>Start testing your frontend skills today</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 188px', gap:20, alignItems:'start' }}>
          <div style={{ padding:32, borderRadius:24, background:'rgba(255,255,255,0.9)', border:'1.5px solid rgba(229,231,235,0.8)', backdropFilter:'blur(20px)', boxShadow:'0 16px 56px rgba(99,102,241,0.1)' }}>
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[{id:'username',label:'Username',icon:<User size={15}/>,type:'text',ph:'cooldev123'},{id:'email',label:'Email',icon:<Mail size={15}/>,type:'email',ph:'you@example.com'}].map(f=>(
                <div key={f.id}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>{f.label}</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}>{f.icon}</span>
                    <input type={f.type} placeholder={f.ph} value={form[f.id]} onChange={e=>set(f.id,e.target.value)} className={`input input-icon ${errors[f.id]?'err':''}`}/>
                  </div>
                  {errors[f.id]&&<p style={{ color:'#b91c1c', fontSize:12, marginTop:4 }}>{errors[f.id]}</p>}
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                  <input type={show?'text':'password'} placeholder="Min 6 characters" value={form.password} onChange={e=>set('password',e.target.value)} className={`input input-icon ${errors.password?'err':''}`} style={{ paddingRight:46 }}/>
                  <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4 }}>{show?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                </div>
                {strength&&<div style={{ marginTop:7 }}><div style={{ height:3, background:'rgba(229,231,235,0.7)', borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', borderRadius:99, width:strength.w, background:strength.c, transition:'all .4s' }}/></div><p style={{ fontSize:11, color:strength.c, marginTop:4 }}>{strength.label}</p></div>}
                {errors.password&&<p style={{ color:'#b91c1c', fontSize:12, marginTop:4 }}>{errors.password}</p>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Confirm Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                  <input type={show?'text':'password'} placeholder="Repeat password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} className={`input input-icon ${errors.confirm?'err':''}`}/>
                </div>
                {errors.confirm&&<p style={{ color:'#b91c1c', fontSize:12, marginTop:4 }}>{errors.confirm}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent:'center', marginTop:4, fontSize:14 }}>
                {loading?<div className="spin" style={{ width:17, height:17, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%' }}/>:<><ArrowRight size={16}/>Create Account</>}
              </button>
            </form>
          </div>
          <div style={{ padding:22, borderRadius:20, background:'rgba(255,255,255,0.82)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(14px)' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#d1d5db', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>You get</p>
            {['Track quiz history','Climb leaderboard','Detailed breakdowns','All categories free'].map((p,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9, marginBottom:13, fontSize:13, color:'#6b7280', lineHeight:1.4 }}>
                <CheckCircle size={14} color="#6366f1" style={{ flexShrink:0, marginTop:1 }}/>{p}
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign:'center', color:'#9ca3af', fontSize:14, marginTop:22 }}>Already have an account? <Link to="/login" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Sign in</Link></p>
      </div>
    </div>
  );
}
