import React, { useState } from 'react';
import S from '../utils/storage.js';
import V from '../utils/validation.js';
import { useToast } from '../context/ToastContext.jsx';
import BarChart from '../components/BarChart.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };
const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const LBL = { fontSize:11,fontWeight:800,color:'var(--muted)',marginBottom:4,display:'block',letterSpacing:'0.5px',textTransform:'uppercase' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };
const BTN_G = { ...BTN1, background:'linear-gradient(135deg,#3ec98e,#52dba4)' };
const BTN2 = { background:'var(--accent-soft)',color:'var(--accent)',border:'none',borderRadius:10,padding:'8px 16px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

const badge = (color, txt) => (
  <span className="badge" style={{background:color+'22',color}}>{txt}</span>
);

function VitalsPage({ user }) {
  const toast = useToast();
  const [vitals, setVitals] = useState(() => (S.get('vitals')||{})[user.id]||[]);
  const [open,  setOpen]  = useState(false);
  const [form,  setForm]  = useState({date:new Date().toISOString().split('T')[0],bp:'',pulse:'',spo2:'',weight:'',temp:'',pain:''});
  const [errs, setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (!V.bp(form.bp))    e.bp    = 'Enter valid BP format (e.g. 120/80)';
    if (!V.pulse(form.pulse))  e.pulse  = 'Pulse must be between 30–200';
    if (form.spo2 && !V.spo2(form.spo2))   e.spo2  = 'SpO2 must be 70–100';
    if (form.temp && !V.temp(form.temp))   e.temp  = 'Temperature must be 90–110°F';
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); toast('Please fix validation errors','error'); return; }
    setErrs({});
    const entry = {...form,pulse:+form.pulse,spo2:+form.spo2,weight:+form.weight,temp:+form.temp,pain:+form.pain};
    const updated = [...vitals, entry];
    const all = S.get('vitals')||{}; all[user.id]=updated; S.set('vitals',all);
    setVitals(updated); setOpen(false);
    setForm({date:new Date().toISOString().split('T')[0],bp:'',pulse:'',spo2:'',weight:'',temp:'',pain:''});
    toast('Vitals logged successfully!');
  };

  const del = idx => {
    const updated = vitals.filter((_,i)=>i!==idx);
    const all = S.get('vitals')||{}; all[user.id]=updated; S.set('vitals',all);
    setVitals(updated); toast('Entry deleted','warn');
  };

  const lbl = vitals.map(v=>v.date.slice(5));
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <h2 style={{fontSize:22,fontWeight:900}}>💓 My Vitals</h2>
        <button onClick={()=>setOpen(true)} style={BTN1} className="btn-hover">+ Log Vitals</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
        {[['Pulse (bpm)',vitals.map(v=>v.pulse),'#f4667a'],['SpO2 (%)',vitals.map(v=>v.spo2),'#4f86c6'],
          ['Pain Score',vitals.map(v=>v.pain),'#f59e40'],['Weight (kg)',vitals.map(v=>v.weight),'#9b72cf']].map(([t,d,c])=>(
          <div key={t} style={CARD}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>{t}</div>
            <BarChart data={d} labels={lbl} color={c} w={260} h={120}/>
          </div>
        ))}
      </div>

      <div style={CARD}>
        <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>📋 Vitals History</div>
        <div style={{overflowX:'auto'}}>
          <table>
            <thead><tr>{['Date','BP','Pulse','SpO2','Weight','Temp','Pain',''].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {[...vitals].reverse().map((v,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:700}}>{v.date}</td>
                  <td>{v.bp}</td>
                  <td>{badge(v.pulse>100?'var(--red)':'var(--green)',v.pulse)}</td>
                  <td>{badge(v.spo2>=98?'var(--green)':'var(--orange)',v.spo2+'%')}</td>
                  <td>{v.weight} kg</td>
                  <td>{v.temp}°F</td>
                  <td>{badge(v.pain<=3?'var(--green)':v.pain<=6?'var(--orange)':'var(--red)',v.pain+'/10')}</td>
                  <td><button onClick={()=>del(vitals.length-1-i)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--red)',fontSize:14}}>🗑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setOpen(false)}>
          <div className="modal">
            <div style={{fontWeight:900,fontSize:18,marginBottom:18}}>Log Today's Vitals</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['date','Date','date'],['bp','Blood Pressure (e.g. 120/80)','text'],['pulse','Pulse (bpm)','number'],
                ['spo2','SpO2 (%)','number'],['weight','Weight (kg)','number'],['temp','Temperature (°F)','number'],['pain','Pain Score (0-10)','number']].map(([k,l,t])=>(
                <div key={k}>
                  <label style={LBL}>{l}</label>
                  <input style={{...INP,borderColor:errs[k]?'var(--red)':undefined}} type={t} value={form[k]} onChange={e=>{setForm(f=>({...f,[k]:e.target.value}));setErrs(x=>({...x,[k]:''}));}}/>
                  {errs[k] && <span className="field-error">{errs[k]}</span>}
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button onClick={save} style={BTN_G} className="btn-hover">Save Entry</button>
              <button onClick={()=>setOpen(false)} style={BTN2} className="btn-hover">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VitalsPage;
