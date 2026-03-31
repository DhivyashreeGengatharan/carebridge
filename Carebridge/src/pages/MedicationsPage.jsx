import React, { useEffect, useState } from 'react';
import S from '../utils/storage.js';
import { useToast } from '../context/ToastContext.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };
const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const LBL = { fontSize:11,fontWeight:800,color:'var(--muted)',marginBottom:4,display:'block',letterSpacing:'0.5px',textTransform:'uppercase' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };
const BTN_G = { ...BTN1, background:'linear-gradient(135deg,#3ec98e,#52dba4)' };
const BTN2 = { background:'var(--accent-soft)',color:'var(--accent)',border:'none',borderRadius:10,padding:'8px 16px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

const badge = (color, txt) => (
  <span className="badge" style={{background:color+'22',color}}>{txt}</span>
);

function MedicationsPage({ user }) {
  const toast = useToast();
  const pid = user.role==='patient' ? user.id : null;
  const [selPat, setSelPat] = useState(pid || (()=>{ const u=S.get('users')||[]; return u.find(x=>x.role==='patient'&&x.doctorId===user.id)?.id||''; })());
  const myPatients = user.role==='doctor' ? (S.get('users')||[]).filter(u=>u.role==='patient'&&u.doctorId===user.id) : [];

  const getMeds = id => (S.get('medications')||{})[id]||[];
  const [meds, setMeds] = useState(()=>getMeds(pid||selPat));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({name:'',frequency:'Once daily',time:'Morning',adherence:100,notes:''});
  const [edit, setEdit] = useState(null);

  useEffect(()=>{ setMeds(getMeds(selPat)); },[selPat]);

  const save = () => {
    if (!form.name) { toast('Medication name required','error'); return; }
    const uid = pid||selPat;
    let updated;
    if (edit) {
      updated = meds.map(m=>m.id===edit ? {...m,...form,adherence:+form.adherence} : m);
    } else {
      updated = [...meds, {...form,id:'m'+Date.now(),status:'active',adherence:+form.adherence}];
    }
    const all=S.get('medications')||{}; all[uid]=updated; S.set('medications',all);
    setMeds(updated); setOpen(false); setEdit(null);
    setForm({name:'',frequency:'Once daily',time:'Morning',adherence:100,notes:''});
    toast(edit?'Medication updated!':'Medication added!');
  };

  const del = id => {
    const uid=pid||selPat;
    const updated = meds.filter(m=>m.id!==id);
    const all=S.get('medications')||{}; all[uid]=updated; S.set('medications',all);
    setMeds(updated); toast('Removed','warn');
  };

  const startEdit = m => { setEdit(m.id); setForm({name:m.name,frequency:m.frequency,time:m.time,adherence:m.adherence,notes:m.notes||''}); setOpen(true); };

  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <h2 style={{fontSize:22,fontWeight:900}}>💊 Medications</h2>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          {user.role==='doctor' && myPatients.length>0 && (
            <select style={{...INP,width:180}} value={selPat} onChange={e=>{setSelPat(e.target.value);}}>
              {myPatients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          {user.role==='doctor' && myPatients.length===0 && (
            <span style={{fontSize:12,color:'var(--muted)'}}>No patients assigned yet.</span>
          )}
          <button onClick={()=>{setEdit(null);setForm({name:'',frequency:'Once daily',time:'Morning',adherence:100,notes:''});setOpen(true);}} style={BTN1} className="btn-hover">+ Add Medication</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:14}}>
        {meds.map(m=>(
          <div key={m.id} className="card-hover" style={{...CARD,borderLeft:'4px solid var(--purple)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>💊 {m.name}</div>
                <div style={{fontSize:12,color:'var(--muted)',marginTop:3}}>{m.frequency} · {m.time}</div>
                {m.notes && <div style={{fontSize:11,color:'var(--accent)',marginTop:3}}>{m.notes}</div>}
              </div>
              <div style={{display:'flex',gap:6}}>
                <button onClick={()=>startEdit(m)} style={{background:'none',border:'none',cursor:'pointer',fontSize:15}}>✏️</button>
                <button onClick={()=>del(m.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--red)',fontSize:15}}>🗑</button>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:12,fontWeight:700}}>
                <span>Adherence</span>
                <span style={{color:m.adherence>=90?'var(--green)':m.adherence>=70?'var(--orange)':'var(--red)'}}>{m.adherence}%</span>
              </div>
              <div style={{height:7,background:'var(--border)',borderRadius:4}}>
                <div style={{height:'100%',width:m.adherence+'%',background:m.adherence>=90?'var(--green)':m.adherence>=70?'var(--orange)':'var(--red)',borderRadius:4,transition:'width .5s'}}/>
              </div>
            </div>
            {badge(m.status==='active'?'var(--green)':'var(--muted)',m.status)}
          </div>
        ))}
        {meds.length===0 && <p style={{color:'var(--muted)',fontSize:13}}>No medications added yet.</p>}
      </div>

      {open && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setOpen(false)}>
          <div className="modal">
            <div style={{fontWeight:900,fontSize:18,marginBottom:18}}>{edit?'Edit':'Add'} Medication</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}><label style={LBL}>Medication Name</label><input style={INP} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
              <div><label style={LBL}>Frequency</label>
                <select style={INP} value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))}>
                  {['Once daily','Twice daily','Three times daily','As needed','Weekly'].map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
              <div><label style={LBL}>Time of Day</label>
                <select style={INP} value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}>
                  {['Morning','Evening','Night','Morning & Evening','With meals','Before bed'].map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
              <div><label style={LBL}>Adherence %</label><input style={INP} type="number" min={0} max={100} value={form.adherence} onChange={e=>setForm(f=>({...f,adherence:e.target.value}))}/></div>
              <div><label style={LBL}>Notes</label><input style={INP} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Optional notes"/></div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button onClick={save} style={BTN_G} className="btn-hover">Save</button>
              <button onClick={()=>setOpen(false)} style={BTN2} className="btn-hover">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationsPage;
