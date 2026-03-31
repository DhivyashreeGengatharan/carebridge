import React, { useState } from 'react';
import S from '../utils/storage.js';
import { useToast } from '../context/ToastContext.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };
const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const LBL = { fontSize:11,fontWeight:800,color:'var(--muted)',marginBottom:4,display:'block',letterSpacing:'0.5px',textTransform:'uppercase' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };
const BTN_R = { ...BTN1, background:'linear-gradient(135deg,#f4667a,#f990a3)' };
const BTN2 = { background:'var(--accent-soft)',color:'var(--accent)',border:'none',borderRadius:10,padding:'8px 16px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

const badge = (color, txt) => (
  <span className="badge" style={{background:color+'22',color}}>{txt}</span>
);

const getFirstDoctorId = () => {
  const users = S.get('users') || [];
  return users.find(u => u.role === 'doctor')?.id || null;
};

function AppointmentsPage({ user }) {
  const toast = useToast();
  const users = S.get('users')||[];
  const [appts, setAppts] = useState(()=>{
    const all = S.get('appointments')||[];
    return user.role==='patient' ? all.filter(a=>a.patientId===user.id) : all.filter(a=>a.doctorId===user.id);
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({date:'',time:'',type:'Follow-up',notes:''});

  const refresh = () => {
    const all=S.get('appointments')||[];
    setAppts(user.role==='patient'?all.filter(a=>a.patientId===user.id):all.filter(a=>a.doctorId===user.id));
  };

  const save = () => {
    if (!form.date||!form.time) { toast('Date and time required','error'); return; }
    const na = {
      id:'a'+Date.now(),
      patientId: user.role==='patient' ? user.id : '',
      doctorId:  user.role==='doctor'  ? user.id : (user.doctorId || getFirstDoctorId() || ''),
      ...form,
      status:'pending'
    };
    if (user.role==='patient' && !na.doctorId) {
      toast('No doctor assigned to your account. Contact support.','error'); return;
    }
    const all=[...(S.get('appointments')||[]),na];
    S.set('appointments',all);
    setOpen(false); setForm({date:'',time:'',type:'Follow-up',notes:''});
    refresh(); toast('Appointment requested!');
  };

  const updateStatus = (id,status) => {
    const all=(S.get('appointments')||[]).map(a=>a.id===id?{...a,status}:a);
    S.set('appointments',all); refresh();
    toast(status==='confirmed'?'Appointment confirmed!':'Appointment cancelled','warn');
  };

  const del = id => {
    const all=(S.get('appointments')||[]).filter(a=>a.id!==id);
    S.set('appointments',all); refresh(); toast('Appointment removed','warn');
  };

  const getName = id => users.find(u=>u.id===id)?.name||'Unknown';

  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <h2 style={{fontSize:22,fontWeight:900}}>📅 Appointments</h2>
        <button onClick={()=>setOpen(true)} style={BTN1} className="btn-hover">+ Book Appointment</button>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {appts.map(a=>(
          <div key={a.id} className="card-hover" style={{...CARD,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div style={{display:'flex',gap:14,alignItems:'center'}}>
              <div style={{width:46,height:46,borderRadius:12,background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>📅</div>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>{a.type}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>{a.date} · {a.time}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>
                  {user.role==='patient'?`Doctor: ${getName(a.doctorId)}`:`Patient: ${getName(a.patientId)}`}
                </div>
                {a.notes && <div style={{fontSize:11,color:'var(--accent)',marginTop:2}}>📝 {a.notes}</div>}
              </div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              {badge(a.status==='confirmed'?'var(--green)':a.status==='pending'?'var(--orange)':'var(--red)',a.status)}
              {user.role==='doctor'&&a.status==='pending'&&<>
                <button onClick={()=>updateStatus(a.id,'confirmed')} style={{...BTN1, background:'linear-gradient(135deg,#3ec98e,#52dba4)'}} className="btn-hover">Confirm</button>
                <button onClick={()=>updateStatus(a.id,'cancelled')} style={BTN_R} className="btn-hover">Cancel</button>
              </>}
              <button onClick={()=>del(a.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:15}}>🗑</button>
            </div>
          </div>
        ))}
        {appts.length===0 && <div style={{...CARD,textAlign:'center',color:'var(--muted)',padding:32}}>No appointments yet.</div>}
      </div>

      {open && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setOpen(false)}>
          <div className="modal">
            <div style={{fontWeight:900,fontSize:18,marginBottom:18}}>Book Appointment</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={LBL}>Date</label><input type="date" style={INP} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
              <div><label style={LBL}>Time</label><input type="time" style={INP} value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></div>
              <div><label style={LBL}>Type</label>
                <select style={INP} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {['Follow-up','Rehabilitation Review','Emergency','Lab Work','General Checkup','Specialist Consult'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={LBL}>Notes</label><input style={INP} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Optional notes"/></div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button onClick={save} style={BTN1} className="btn-hover">Confirm Booking</button>
              <button onClick={()=>setOpen(false)} style={BTN2} className="btn-hover">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
