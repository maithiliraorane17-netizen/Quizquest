import { useState } from 'react';
import { Mail, MessageSquare, User, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
export default function Contact() {
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''}); const [sent,setSent]=useState(false);
  const submit=e=>{ e.preventDefault(); if(!form.name||!form.email||!form.message){toast.error('Please fill required fields');return;} setTimeout(()=>{setSent(true);toast.success('Message sent! 🎉');},400); };
  return (
    <div style={{ paddingTop:100, paddingBottom:80, minHeight:'100vh' }}>
      <div className="page">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <h1 className="au" style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:900, color:'#1a1a2e', marginBottom:12, letterSpacing:'-1px' }}>Get in <span className="g-text">Touch</span></h1>
          <p className="au d1" style={{ color:'#9ca3af', fontSize:16 }}>Have a question or suggestion? We'd love to hear from you.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:28, alignItems:'start' }}>
          <div className="au" style={{ padding:36, borderRadius:24, background:'rgba(255,255,255,0.88)', border:'1.5px solid rgba(229,231,235,0.8)', backdropFilter:'blur(20px)', boxShadow:'0 12px 48px rgba(99,102,241,0.1)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'44px 20px' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(21,128,61,0.1)', border:'1px solid rgba(21,128,61,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}><CheckCircle size={28} color="#15803d"/></div>
                <h3 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', marginBottom:8 }}>Message Sent!</h3>
                <p style={{ color:'#9ca3af' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                {[{id:'name',label:'Your Name *',icon:<User size={15}/>,type:'text',ph:'John Doe'},{id:'email',label:'Email *',icon:<Mail size={15}/>,type:'email',ph:'you@example.com'},{id:'subject',label:'Subject',icon:<MessageSquare size={15}/>,type:'text',ph:'Question about...'}].map(f=>(
                  <div key={f.id}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>{f.label}</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}>{f.icon}</span>
                      <input type={f.type} placeholder={f.ph} value={form[f.id]} onChange={e=>setForm(p=>({...p,[f.id]:e.target.value}))} className="input input-icon"/>
                    </div>
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Message *</label>
                  <textarea rows={4} placeholder="Your message..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} className="input" style={{ resize:'none', lineHeight:1.6 }}/>
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent:'center', fontSize:15 }}><Send size={16}/> Send Message</button>
              </form>
            )}
          </div>
          <div className="au d1" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[{icon:<Mail size={18}/>,label:'Email',val:'hello@quizquest.dev',c:'#6366f1',bg:'rgba(99,102,241,0.08)',border:'rgba(99,102,241,0.15)'},{icon:<MessageSquare size={18}/>,label:'Support',val:'Available 24/7',c:'#15803d',bg:'rgba(21,128,61,0.08)',border:'rgba(21,128,61,0.15)'}].map(item=>(
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 20px', borderRadius:18, background:'rgba(255,255,255,0.85)', border:`1px solid ${item.border}`, backdropFilter:'blur(12px)' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:item.bg, color:item.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{item.icon}</div>
                <div><p style={{ color:'#9ca3af', fontSize:12 }}>{item.label}</p><p style={{ color:'#1a1a2e', fontWeight:600, fontSize:14 }}>{item.val}</p></div>
              </div>
            ))}
            <div style={{ padding:'20px 22px', borderRadius:18, background:'rgba(255,255,255,0.85)', border:'1px solid rgba(229,231,235,0.7)', backdropFilter:'blur(12px)' }}>
              <h3 style={{ fontWeight:700, color:'#1a1a2e', marginBottom:14, fontSize:14 }}>FAQ</h3>
              {[['Is it free?','Yes, completely free!'],['Suggest questions?','Absolutely, email us.'],['How is score calculated?','10 points per correct answer.']].map(([q,a])=>(
                <div key={q} style={{ marginBottom:11 }}><p style={{ color:'#1a1a2e', fontSize:13, fontWeight:600 }}>{q}</p><p style={{ color:'#9ca3af', fontSize:12, marginTop:2 }}>{a}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
