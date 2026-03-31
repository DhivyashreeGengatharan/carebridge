import React, { useState } from 'react';
import S from '../utils/storage.js';
import V from '../utils/validation.js';
import { useToast } from '../context/ToastContext.jsx';

const LBL = { fontSize:11,fontWeight:800,color:'var(--muted)',marginBottom:4,display:'block',letterSpacing:'0.5px',textTransform:'uppercase' };
const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };
const BTN2 = { background:'var(--accent-soft)',color:'var(--accent)',border:'none',borderRadius:10,padding:'8px 16px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

const getFirstDoctorId = () => {
  const users = S.get('users') || [];
  return users.find(u => u.role === 'doctor')?.id || null;
};

function Login({ onLogin }) {
  const [email,  setEmail]  = useState('');
  const [pass,   setPass]   = useState('');
  const [role,   setRole]   = useState('patient');
  const [err,    setErr]    = useState('');
  const toast = useToast();

  const doLogin = () => {
    if (!email.trim()) { setErr('Please enter your email address.'); return; }
    if (!V.email(email)) { setErr('Please enter a valid email address.'); return; }
    if (!pass.trim() || pass.length < 6) { setErr('Password must be at least 6 characters.'); return; }

    const users = S.get('users') || [];
    const user = users.find(u => u.email.toLowerCase()===email.trim().toLowerCase() && u.password===pass);
    if (user) {
      if (role !== user.role) { setErr(`This account is a ${user.role} account. Switch the tab to ${user.role}.`); return; }
      toast('Welcome back, ' + user.name + '!');
      onLogin(user);
    } else {
      const firstDoctorId = getFirstDoctorId();
      const newUser = {
        id: role[0]+Date.now(),
        role,
        name: email.trim().split('@')[0].replace(/[^a-zA-Z ]/g,' ').trim() || 'New User',
        email: email.trim(),
        password: pass,
        avatar: email.trim().slice(0,2).toUpperCase(),
        specialty: role==='doctor'?'General Medicine':'',
        condition: role==='patient'?'Post-Discharge Recovery':'',
        age: '',
        phone: '',
        bloodGroup: '',
        dischargeDate: new Date().toISOString().split('T')[0],
        doctorId: role==='patient' ? firstDoctorId : undefined,
      };
      const all = [...(S.get('users')||[]), newUser];
      S.set('users', all);
      if (role==='patient') {
        const v=S.get('vitals')||{}; v[newUser.id]=[]; S.set('vitals',v);
        const t=S.get('tasks')||{};  t[newUser.id]=[]; S.set('tasks',t);
        const m=S.get('medications')||{}; m[newUser.id]=[]; S.set('medications',m);
        const n=S.get('notes')||{};   n[newUser.id]=[]; S.set('notes',n);
      }
      toast('Account created! Welcome, ' + newUser.name);
      onLogin(newUser);
    }
  };

  const demo = (r) => {
    if (r==='patient') { setEmail('ravi@mail.com'); setPass('patient123'); setRole('patient'); }
    else { setEmail('priya@carebridge.in'); setPass('doctor123'); setRole('doctor'); }
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#e8f0fb 0%,#f0f4f8 55%,#e6faf2 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'Nunito,sans-serif'}}>
      <div style={{maxWidth:460,width:'100%'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:12,marginBottom:10}}>
            <div style={{width:52,height:52,borderRadius:16,background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:'0 8px 24px rgba(79,134,198,0.35)'}}>❤️‍🩺</div>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:28,fontWeight:900,color:'var(--text)',fontFamily:'Sora,sans-serif',lineHeight:1}}>CareBridge</div>
              <div style={{fontSize:12,color:'var(--muted)',fontWeight:600}}>Post Discharge Navigator</div>
            </div>
          </div>
          <p style={{color:'var(--muted)',fontSize:14}}>Your bridge between hospital and home recovery</p>
        </div>

        <div style={{...{background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)'},padding:32}}>
          <div style={{display:'flex',background:'var(--bg)',borderRadius:12,padding:4,marginBottom:26}}>
            {['patient','doctor'].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:'10px 0',border:'none',cursor:'pointer',borderRadius:9,fontWeight:800,fontSize:13,fontFamily:'Nunito,sans-serif',transition:'all .2s',
                background:role===r?'var(--accent)':'transparent',
                color:role===r?'#fff':'var(--muted)',
                boxShadow:role===r?'0 3px 10px rgba(79,134,198,0.35)':'none'}}>
                {r==='patient'?'👤 Patient':'👨‍⚕️ Doctor'}
              </button>
            ))}
          </div>

          <div style={{marginBottom:14}}>
            <label style={LBL}>Email Address</label>
            <input style={INP} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter email"/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={LBL}>Password</label>
            <input style={INP} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter password (min 6 chars)" onKeyDown={e=>e.key==='Enter'&&doLogin()}/>
          </div>

          {err && <div style={{background:'#fff0f2',color:'var(--red)',padding:'10px 14px',borderRadius:10,fontSize:13,marginBottom:14,fontWeight:700}}>{err}</div>}
          <div style={{marginBottom:8,fontSize:11,color:'var(--muted)',fontWeight:600}}>💡 New email? A new account is auto-created on first login.</div>

          <button onClick={doLogin} className="btn-hover" style={{...BTN1,width:'100%',padding:'13px 0',fontSize:15}}>
            Sign In / Register
          </button>

          <div style={{marginTop:18,display:'flex',gap:8}}>
            <button onClick={()=>demo('patient')} className="btn-hover" style={{...BTN2,flex:1,fontSize:12}}>Demo: Patient</button>
            <button onClick={()=>demo('doctor')} className="btn-hover" style={{...BTN2,flex:1,fontSize:12}}>Demo: Doctor</button>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:18,color:'var(--muted)',fontSize:11,fontWeight:600}}>🔒 Secure · Offline-first · Data stored locally</div>
      </div>
    </div>
  );
}

export default Login;
