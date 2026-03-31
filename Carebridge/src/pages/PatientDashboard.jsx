import React, { useState } from 'react';
import S from '../utils/storage.js';
import { useToast } from '../context/ToastContext.jsx';
import HeartCanvas from '../components/HeartCanvas.jsx';
import Sparkline from '../components/Sparkline.jsx';
import Ring from '../components/Ring.jsx';
import Stat from '../components/Stat.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };

const badge = (color, txt) => (
  <span className="badge" style={{background:color+'22',color}}>{txt}</span>
);

function PatientDashboard({ user }) {
  const [vitals]  = useState(() => (S.get('vitals')||{})[user.id]||[]);
  const [meds]    = useState(() => (S.get('medications')||{})[user.id]||[]);
  const [tasks]   = useState(() => (S.get('tasks')||{})[user.id]||[]);
  const concerns  = (S.get('concerns')||[]).filter(c=>c.patientId===user.id);
  const appts     = (S.get('appointments')||[]).filter(a=>a.patientId===user.id);
  const lv = vitals[vitals.length-1]||{};
  const done = tasks.filter(t=>t.done).length;
  const taskPct = tasks.length ? Math.round(done/tasks.length*100) : 0;
  const avgAdh = meds.length ? Math.round(meds.reduce((s,m)=>s+m.adherence,0)/meds.length) : 0;
  const days = user.dischargeDate ? Math.round((new Date()-new Date(user.dischargeDate))/86400000) : 0;
  const recov = Math.min(95,Math.round((days/60)*100));
  const pulseArr = vitals.map(v=>v.pulse);
  const bpArr = vitals.map(v=>parseInt(v.bp));

  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{...CARD,background:'linear-gradient(135deg,#4f86c6 0%,#3a72b8 100%)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,padding:'24px 28px'}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,fontFamily:'Sora,sans-serif'}}>Welcome back, {user.name.split(' ')[0]}! 👋</div>
          <div style={{opacity:.8,fontSize:13,marginTop:4}}>{user.condition} · Day {days} of Recovery</div>
          <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
            {[['🌡️',lv.temp||'N/A','°F'],['💓',lv.pulse||'--','bpm'],['🩺',lv.bp||'--',''],['🫁',(lv.spo2||'--')+'%','SpO2']].map(([ic,v,u])=>(
              <span key={ic} style={{background:'rgba(255,255,255,0.22)',borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:700}}>{ic} {v}{u}</span>
            ))}
          </div>
        </div>
        <HeartCanvas size={100}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(155px,1fr))',gap:12}}>
        <Stat icon="💓" label="Heart Rate" value={lv.pulse||'--'} sub="bpm" spark={pulseArr} sparkColor="#f4667a"/>
        <Stat icon="🩺" label="Blood Pressure" value={lv.bp||'--'} sub="mmHg" spark={bpArr} sparkColor="var(--accent)"/>
        <Stat icon="🫁" label="SpO2" value={(lv.spo2||'--')+'%'} sub="Oxygen" grad={lv.spo2>=98?'linear-gradient(135deg,#3ec98e,#52dba4)':'linear-gradient(135deg,#f59e40,#fbc16a)'}/>
        <Stat icon="⚖️" label="Weight" value={(lv.weight||'--')+' kg'} sub="Last recorded"/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:14}}>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>Recovery Progress</div>
          <div style={{display:'flex',gap:12,justifyContent:'space-around'}}>
            <Ring pct={recov} color="var(--accent)" label="Overall"/>
            <Ring pct={taskPct} color="var(--green)" label="Tasks"/>
            <Ring pct={avgAdh} color="var(--purple)" label="Meds"/>
          </div>
        </div>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>Today's Checklist</div>
          {tasks.slice(0,5).map(t=>(
            <div key={t.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <div style={{width:17,height:17,borderRadius:5,background:t.done?'var(--green)':'var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {t.done&&<span style={{color:'#fff',fontSize:10,fontWeight:900}}>✓</span>}
              </div>
              <span style={{fontSize:12.5,fontWeight:600,color:t.done?'var(--muted)':'var(--text)',textDecoration:t.done?'line-through':'none'}}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>📅 Upcoming Appointments</div>
          {appts.length===0 ? <p style={{color:'var(--muted)',fontSize:13}}>No appointments yet.</p> :
            appts.slice(0,3).map(a=>(
              <div key={a.id} style={{padding:'10px 12px',background:'var(--accent-soft)',borderRadius:10,marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:13}}>{a.type}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>{a.date} · {a.time}</div>
                {badge(a.status==='confirmed'?'var(--green)':'var(--orange)',a.status)}
              </div>
            ))}
        </div>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>💬 Recent Concerns</div>
          {concerns.length===0 ? <p style={{color:'var(--muted)',fontSize:13}}>No concerns raised yet.</p> :
            concerns.slice(0,3).map(c=>(
              <div key={c.id} style={{padding:'10px 12px',background:c.status==='replied'?'#edfbf5':'#fff8ee',borderRadius:10,marginBottom:8}}>
                <div style={{fontSize:12.5,fontWeight:600}}>{c.message.slice(0,55)}...</div>
                {c.reply ? <div style={{fontSize:11,color:'var(--green)',marginTop:3,fontWeight:700}}>✅ Doctor replied</div>
                          : <div style={{fontSize:11,color:'var(--orange)',marginTop:3,fontWeight:700}}>⏳ Awaiting reply</div>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
