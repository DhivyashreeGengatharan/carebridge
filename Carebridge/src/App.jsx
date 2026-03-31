import React, { useState, useRef, useEffect } from 'react';
import S from './utils/storage.js';
import V from './utils/validation.js';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import Sparkline from './components/Sparkline.jsx';
import Ring from './components/Ring.jsx';
import BarChart from './components/BarChart.jsx';
import DrawingPad from './components/DrawingPad.jsx';
import HeartCanvas from './components/HeartCanvas.jsx';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import Stat from './components/Stat.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import VitalsPage from './pages/VitalsPage.jsx';
import MedicationsPage from './pages/MedicationsPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };
const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const LBL = { fontSize:11,fontWeight:800,color:'var(--muted)',marginBottom:4,display:'block',letterSpacing:'0.5px',textTransform:'uppercase' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };
const BTN_G = { ...BTN1, background:'linear-gradient(135deg,#3ec98e,#52dba4)' };
const BTN_R = { ...BTN1, background:'linear-gradient(135deg,#f4667a,#f990a3)' };
const BTN2 = { background:'var(--accent-soft)',color:'var(--accent)',border:'none',borderRadius:10,padding:'8px 16px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

const badge = (color, txt) => (
  <span className="badge" style={{background:color+'22',color}}>{txt}</span>
);

const getFirstDoctorId = () => {
  const users = S.get('users') || [];
  return users.find(u => u.role === 'doctor')?.id || null;
};

function seedData() {
  if (S.get('seeded')) return;
  S.set('users', [
    { id:'d1', role:'doctor', name:'Dr. Priya Menon',  specialty:'Cardiology',  email:'priya@carebridge.in', password:'doctor123',   avatar:'PM' },
    { id:'d2', role:'doctor', name:'Dr. Arjun Nair',   specialty:'Neurology',   email:'arjun@carebridge.in', password:'doctor123',   avatar:'AN' },
    { id:'p1', role:'patient', name:'Ravi Kumar',      age:58, condition:'Post-CABG Recovery',    email:'ravi@mail.com',    password:'patient123', avatar:'RK', doctorId:'d1', dischargeDate:'2026-03-10', bloodGroup:'B+', phone:'9876543210' },
    { id:'p2', role:'patient', name:'Sunita Sharma',   age:45, condition:'Stroke Rehabilitation', email:'sunita@mail.com',  password:'patient123', avatar:'SS', doctorId:'d2', dischargeDate:'2026-03-15', bloodGroup:'O+', phone:'9123456780' },
  ]);
  S.set('vitals', {
    p1:[
      {date:'2026-03-10',bp:'145/90',pulse:88,spo2:96,weight:72,temp:98.6,pain:6},
      {date:'2026-03-15',bp:'138/85',pulse:82,spo2:97,weight:71.5,temp:98.4,pain:4},
      {date:'2026-03-20',bp:'132/82',pulse:78,spo2:98,weight:71,temp:98.2,pain:3},
      {date:'2026-03-25',bp:'128/80',pulse:75,spo2:98,weight:70.8,temp:98.0,pain:2},
      {date:'2026-03-29',bp:'122/76',pulse:70,spo2:99,weight:70.2,temp:97.8,pain:1},
    ],
    p2:[
      {date:'2026-03-15',bp:'150/95',pulse:92,spo2:95,weight:65,temp:99.1,pain:7},
      {date:'2026-03-20',bp:'142/90',pulse:86,spo2:96,weight:64.8,temp:98.8,pain:5},
      {date:'2026-03-25',bp:'136/88',pulse:80,spo2:97,weight:64.5,temp:98.5,pain:3},
      {date:'2026-03-29',bp:'130/84',pulse:76,spo2:98,weight:64.2,temp:98.2,pain:2},
    ],
  });
  S.set('medications', {
    p1:[
      {id:'m1',name:'Aspirin 75mg',       frequency:'Once daily',  time:'Morning',           status:'active',adherence:92},
      {id:'m2',name:'Atorvastatin 40mg',  frequency:'Once daily',  time:'Night',             status:'active',adherence:88},
      {id:'m3',name:'Metoprolol 25mg',    frequency:'Twice daily', time:'Morning & Evening', status:'active',adherence:95},
      {id:'m4',name:'Ramipril 5mg',       frequency:'Once daily',  time:'Morning',           status:'active',adherence:90},
    ],
    p2:[
      {id:'m5',name:'Clopidogrel 75mg',          frequency:'Once daily',  time:'Morning',           status:'active',adherence:85},
      {id:'m6',name:'Physiotherapy Exercises',    frequency:'Twice daily', time:'Morning & Evening', status:'active',adherence:78},
    ],
  });
  S.set('appointments',[
    {id:'a1',patientId:'p1',doctorId:'d1',date:'2026-04-05',time:'10:00',type:'Follow-up',           status:'confirmed',notes:'Routine post-surgery checkup'},
    {id:'a2',patientId:'p2',doctorId:'d2',date:'2026-04-08',time:'14:00',type:'Rehabilitation Review',status:'pending',  notes:'Assess motor skill progress'},
  ]);
  S.set('concerns',[
    {id:'c1',patientId:'p1',doctorId:'d1',message:'Experiencing mild chest tightness after evening walk. Should I be worried?', date:'2026-03-28',status:'open',   reply:'',priority:'medium'},
    {id:'c2',patientId:'p2',doctorId:'d2',message:'Left arm feels weaker than yesterday during exercises.',                      date:'2026-03-27',status:'replied',reply:'This is normal fluctuation. Continue exercises gently and rest if pain increases.',priority:'low'},
  ]);
  S.set('tasks',{
    p1:[
      {id:'t1',text:'Morning walk (20 min)',      done:true, date:'2026-03-29'},
      {id:'t2',text:'Take morning medications',   done:true, date:'2026-03-29'},
      {id:'t3',text:'Blood pressure check',       done:false,date:'2026-03-29'},
      {id:'t4',text:'Wound site inspection',      done:false,date:'2026-03-29'},
      {id:'t5',text:'Log today\'s diet',          done:false,date:'2026-03-29'},
    ],
    p2:[
      {id:'t6',text:'Morning physiotherapy session',done:true, date:'2026-03-29'},
      {id:'t7',text:'Take medications',            done:false,date:'2026-03-29'},
      {id:'t8',text:'Balance exercises (10 min)',  done:false,date:'2026-03-29'},
    ],
  });
  S.set('notes',{ p1:[], p2:[] });
  S.set('seeded', true);
}

const ARTICLES = [
  {title:'Post-Surgery Wound Care',icon:'🩹',cat:'Surgery Recovery',desc:'Essential guidelines for keeping your incision clean and preventing infection during recovery.',color:'var(--red)'},
  {title:'Heart-Healthy Diet Tips',icon:'🥗',cat:'Nutrition',desc:'Foods to embrace and avoid for optimal cardiac recovery and long-term heart health.',color:'var(--green)'},
  {title:'Safe Exercise After Discharge',icon:'🚶',cat:'Physical Activity',desc:'Gradually rebuilding strength — from walking routines to guided stretching.',color:'var(--accent)'},
  {title:'Managing Medications',icon:'💊',cat:'Medication',desc:'Stay consistent with your prescription schedule and avoid dangerous interactions.',color:'var(--purple)'},
  {title:'Recognizing Warning Signs',icon:'⚠️',cat:'Emergency',desc:'Know when to call your doctor immediately vs. when symptoms are normal.',color:'var(--orange)'},
  {title:'Mental Health & Recovery',icon:'🧠',cat:'Mental Wellness',desc:'Coping with post-hospitalization anxiety, depression, and the emotional journey.',color:'var(--teal)'},
  {title:'Sleep & Rest Guidelines',icon:'😴',cat:'Rest',desc:'Why sleep is your most powerful healing tool and how to optimize your rest.',color:'#b5a4f0'},
  {title:'Follow-up Care Schedule',icon:'📋',cat:'Planning',desc:'A complete guide to post-discharge appointments, tests, and check-ins.',color:'var(--orange)'},
];

function ConcernsPage({ user }) {
  const toast = useToast();
  const users = S.get('users')||[];
  const [concerns, setConcerns] = useState(()=>S.get('concerns')||[]);
  const [msg,  setMsg]  = useState('');
  const [pri,  setPri]  = useState('medium');
  const [rep,  setRep]  = useState({});
  const [msgErr, setMsgErr] = useState('');

  const mine = user.role==='patient'
    ? concerns.filter(c=>c.patientId===user.id)
    : concerns.filter(c=>c.doctorId===user.id);

  const save = all => { S.set('concerns',all); setConcerns(all); };

  const submit = () => {
    if (!V.msg(msg)) { setMsgErr('Message must be at least 10 characters.'); return; }
    setMsgErr('');
    const doctorId = user.doctorId || getFirstDoctorId();
    if (!doctorId) {
      toast('No doctor assigned. Please contact hospital admin.','error');
      return;
    }
    const nc = {
      id:'c'+Date.now(),
      patientId: user.id,
      doctorId,
      message: msg,
      date: new Date().toISOString().split('T')[0],
      status:'open',
      reply:'',
      priority:pri
    };
    save([...concerns,nc]);
    setMsg('');
    toast('Concern sent to your doctor!');
  };

  const reply = id => {
    const txt=rep[id];
    if (!txt || !txt.trim()) { toast('Reply cannot be empty','error'); return; }
    save(concerns.map(c=>c.id===id?{...c,reply:txt,status:'replied'}:c));
    setRep(r=>({...r,[id]:''})); toast('Reply sent!');
  };

  const del = id => { save(concerns.filter(c=>c.id!==id)); toast('Deleted','warn'); };
  const getName = id => users.find(u=>u.id===id)?.name||'Unknown';
  const priColor = p => p==='high'?'var(--red)':p==='medium'?'var(--orange)':'var(--green)';

  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{fontSize:22,fontWeight:900}}>💬 {user.role==='patient'?'Ask My Doctor':'Patient Concerns'}</h2>

      {user.role==='patient' && (
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>Send a Message to Your Doctor</div>
          {!user.doctorId && (
            <div style={{background:'#fff8ee',color:'var(--orange)',padding:'10px 14px',borderRadius:10,fontSize:13,marginBottom:12,fontWeight:700}}>
              ⚠️ No doctor is assigned to your account. Concerns may not be visible to a doctor.
            </div>
          )}
          <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
            {['low','medium','high'].map(p=>(
              <button key={p} onClick={()=>setPri(p)} className="btn-hover" style={{padding:'6px 16px',borderRadius:20,border:'none',cursor:'pointer',fontWeight:800,fontSize:12,fontFamily:'Nunito,sans-serif',
                background:pri===p?priColor(p):'var(--border)',color:pri===p?'#fff':'var(--muted)'}}>
                {p.toUpperCase()}
              </button>
            ))}
          </div>
          <textarea
            style={{...INP,height:90,resize:'vertical',borderColor:msgErr?'var(--red)':undefined}}
            value={msg}
            onChange={e=>{setMsg(e.target.value);setMsgErr('');}}
            placeholder="Describe your concern or question (min 10 characters)..."
          />
          {msgErr && <span className="field-error">{msgErr}</span>}
          <button onClick={submit} style={{...BTN1,marginTop:12}} className="btn-hover">Send to Doctor</button>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {mine.map(c=>(
          <div key={c.id} style={{...CARD,borderLeft:`4px solid ${priColor(c.priority)}`}}>
            <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:13}}>
                {user.role==='doctor'?`From: ${getName(c.patientId)}`:'Your concern'}
              </div>
              <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                {badge(priColor(c.priority),c.priority)}
                {badge(c.status==='replied'?'var(--green)':'var(--orange)',c.status)}
                <span style={{fontSize:11,color:'var(--muted)'}}>{c.date}</span>
                <button onClick={()=>del(c.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:13}}>🗑</button>
              </div>
            </div>
            <div style={{fontSize:13.5,color:'var(--text)',background:'var(--bg)',padding:'10px 14px',borderRadius:10}}>{c.message}</div>
            {c.reply && (
              <div style={{marginTop:10,background:'#edfbf5',borderRadius:10,padding:'10px 14px'}}>
                <div style={{fontSize:10,fontWeight:800,color:'var(--green)',marginBottom:4}}>DOCTOR'S REPLY</div>
                <div style={{fontSize:13.5}}>{c.reply}</div>
              </div>
            )}
            {user.role==='doctor'&&!c.reply && (
              <div style={{marginTop:10,display:'flex',gap:8}}>
                <input style={{...INP,flex:1}} value={rep[c.id]||''} onChange={e=>setRep(r=>({...r,[c.id]:e.target.value}))} placeholder="Type reply..." onKeyDown={e=>e.key==='Enter'&&reply(c.id)}/>
                <button onClick={()=>reply(c.id)} style={BTN_G} className="btn-hover">Reply</button>
              </div>
            )}
          </div>
        ))}
        {mine.length===0&&<div style={{...CARD,textAlign:'center',color:'var(--muted)',padding:32}}>No concerns yet.</div>}
      </div>
    </div>
  );
}

function NotesPage({ user }) {
  const toast = useToast();
  const [notes,setNotes] = useState(()=>(S.get('notes')||{})[user.id]||[]);
  const [txt,setTxt] = useState('');
  const persist = n => { const all=S.get('notes')||{}; all[user.id]=n; S.set('notes',all); setNotes(n); };
  const saveDrawing = url => { persist([...notes,{id:'n'+Date.now(),type:'drawing',content:url,date:new Date().toLocaleDateString(),userId:user.id}]); toast('Drawing saved!'); };
  const saveText = () => { if (!txt.trim()) return; persist([...notes,{id:'n'+Date.now(),type:'text',content:txt,date:new Date().toLocaleDateString(),userId:user.id}]); setTxt(''); toast('Note saved!'); };
  const del = id => { persist(notes.filter(n=>n.id!==id)); toast('Note deleted','warn'); };
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{fontSize:22,fontWeight:900}}>📝 Drawing & Notes Pad</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>✏️ Drawing Canvas</div>
          <DrawingPad onSave={saveDrawing}/>
        </div>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>📄 Text Notes</div>
          <textarea style={{...INP,height:160,resize:'vertical'}} value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Write your note here — symptoms, questions for doctor, reminders..."/>
          <button onClick={saveText} style={{...BTN1,marginTop:10}} className="btn-hover">Save Note</button>
        </div>
      </div>
      {notes.length>0 && <>
        <div style={{fontWeight:800,fontSize:15}}>Saved Notes</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:12}}>
          {notes.map(n=>(
            <div key={n.id} style={{...CARD,padding:12,position:'relative'}} className="card-hover">
              <button onClick={()=>del(n.id)} style={{position:'absolute',top:8,right:8,background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:13}}>✕</button>
              <div style={{fontSize:10,color:'var(--muted)',marginBottom:6,fontWeight:700}}>{n.date}</div>
              {n.type==='drawing'
                ? <img src={n.content} style={{width:'100%',borderRadius:8,border:'1px solid var(--border)'}} alt="drawing"/>
                : <div style={{fontSize:12.5,color:'var(--text)',background:'var(--bg)',padding:8,borderRadius:8,whiteSpace:'pre-wrap'}}>{n.content}</div>}
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function EducationPage() {
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{fontSize:22,fontWeight:900}}>📚 Health Library</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
        {ARTICLES.map((a,i)=>(
          <div key={i} className="card-hover" style={{...CARD,borderTop:`4px solid ${a.color}`,cursor:'pointer'}}>
            <div style={{fontSize:28,marginBottom:10}}>{a.icon}</div>
            {badge(a.color,a.cat)}
            <div style={{fontWeight:800,fontSize:14,marginTop:8,marginBottom:6}}>{a.title}</div>
            <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.55}}>{a.desc}</div>
            <button style={{...BTN2,marginTop:12,fontSize:12}} className="btn-hover">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ user, onUpdate }) {
  const toast = useToast();
  const [form,setForm] = useState({...user});
  const [errs,setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (!V.name(form.name))  e.name  = 'Name must be 2–50 letters only';
    if (form.phone && !V.phone(form.phone)) e.phone = 'Enter valid 10-digit Indian mobile number';
    if (form.age   && !V.age(form.age))    e.age   = 'Age must be between 1–120';
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); toast('Please fix validation errors','error'); return; }
    setErrs({});
    const updated = form.password&&form.password.length>0 ? form : {...form,password:user.password};
    const all=(S.get('users')||[]).map(u=>u.id===user.id?{...u,...updated}:u);
    S.set('users',all); onUpdate({...user,...updated});
    toast('Profile updated!');
  };

  const patientFields = [['name','Full Name'],['email','Email'],['phone','Phone'],['bloodGroup','Blood Group'],['condition','Condition'],['age','Age'],['dischargeDate','Discharge Date'],['password','Change Password']];
  const doctorFields  = [['name','Full Name'],['email','Email'],['specialty','Specialty'],['password','Change Password']];
  const fields = user.role==='patient' ? patientFields : doctorFields;
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18,maxWidth:620}}>
      <h2 style={{fontSize:22,fontWeight:900}}>👤 My Profile</h2>
      <div style={CARD}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
          <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:20}}>{user.avatar}</div>
          <div>
            <div style={{fontSize:17,fontWeight:900}}>{user.name}</div>
            {badge('var(--accent)',user.role)}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {fields.map(([k,l])=>(
            <div key={k}>
              <label style={LBL}>{l}</label>
              <input
                style={{...INP,borderColor:errs[k]?'var(--red)':undefined}}
                type={k==='password'?'password':k==='dischargeDate'?'date':'text'}
                value={form[k]||''}
                onChange={e=>{setForm(f=>({...f,[k]:e.target.value}));setErrs(x=>({...x,[k]:''}));}}
                placeholder={k==='password'?'Leave blank to keep current':l}
              />
              {errs[k] && <span className="field-error">{errs[k]}</span>}
            </div>
          ))}
        </div>
        <button onClick={save} style={{...BTN1,marginTop:18}} className="btn-hover">Save Changes</button>
      </div>
    </div>
  );
}

function DoctorDashboard({ user }) {
  const users    = S.get('users')||[];
  const myPats   = users.filter(u=>u.role==='patient'&&u.doctorId===user.id);
  const allV     = S.get('vitals')||{};
  const concerns = (S.get('concerns')||[]).filter(c=>c.doctorId===user.id);
  const appts    = (S.get('appointments')||[]).filter(a=>a.doctorId===user.id);
  const open     = concerns.filter(c=>c.status==='open');
  const pending  = appts.filter(a=>a.status==='pending');

  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{...CARD,background:'linear-gradient(135deg,#1a2744 0%,#243358 100%)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,padding:'24px 28px'}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,fontFamily:'Sora,sans-serif'}}>Good day, {user.name} 👨‍⚕️</div>
          <div style={{opacity:.7,fontSize:13,marginTop:4}}>{user.specialty||'Doctor'} · CareBridge Dashboard</div>
          <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
            <span style={{background:'rgba(255,255,255,0.14)',borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:700}}>👥 {myPats.length} Patients</span>
            <span style={{background:'rgba(244,102,122,0.35)',borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:700}}>⚠️ {open.length} Open Concerns</span>
            <span style={{background:'rgba(245,158,64,0.35)',borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:700}}>📅 {pending.length} Pending Appts</span>
          </div>
        </div>
        <span style={{fontSize:60}}>🏥</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(155px,1fr))',gap:12}}>
        <Stat icon="👥" label="Total Patients" value={myPats.length} sub="Under your care" grad="linear-gradient(135deg,#4f86c6,#6fa3de)"/>
        <Stat icon="💬" label="Open Concerns" value={open.length} sub="Need reply" grad={open.length>0?'linear-gradient(135deg,#f4667a,#f990a3)':'linear-gradient(135deg,#3ec98e,#52dba4)'}/>
        <Stat icon="📅" label="Appointments" value={appts.length} sub={`${pending.length} pending`} grad="linear-gradient(135deg,#f59e40,#fbc16a)"/>
        <Stat icon="✅" label="Replied" value={concerns.filter(c=>c.status==='replied').length} sub="Concerns resolved"/>
      </div>

      <div style={{fontWeight:800,fontSize:15}}>Patient Overview</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:14}}>
        {myPats.map(p=>{
          const lv = (allV[p.id]||[]).slice(-1)[0]||{};
          const pc = (S.get('concerns')||[]).filter(c=>c.patientId===p.id&&c.status==='open');
          const pa = (S.get('appointments')||[]).filter(a=>a.patientId===p.id);
          const pulse = (allV[p.id]||[]).map(v=>v.pulse);
          const days = p.dischargeDate?Math.round((new Date()-new Date(p.dischargeDate))/86400000):0;
          return (
            <div key={p.id} className="card-hover" style={{...CARD,borderTop:'4px solid var(--accent)'}}>
              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:15,flexShrink:0}}>{p.avatar}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:14}}>{p.name}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>{p.condition}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
                {[['BP',lv.bp||'--'],['Pulse',`${lv.pulse||'--'} bpm`],['SpO2',`${lv.spo2||'--'}%`],['Pain',`${lv.pain||'--'}/10`]].map(([k,v])=>(
                  <div key={k} style={{background:'var(--bg)',borderRadius:7,padding:'6px 9px'}}>
                    <div style={{fontSize:9,fontWeight:800,color:'var(--muted)'}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:900}}>{v}</div>
                  </div>
                ))}
              </div>
              {pulse.length>1 && <Sparkline data={pulse} color="var(--accent)" w={220} h={38}/>}
              <div style={{marginTop:8,display:'flex',gap:5,flexWrap:'wrap'}}>
                {pc.length>0 && badge('var(--red)',`⚠️ ${pc.length} concern${pc.length>1?'s':''}`)}
                {pa.length>0 && badge('var(--orange)',`📅 ${pa.length} appt${pa.length>1?'s':''}`)}
                {badge('var(--green)',`Day ${days}`)}
              </div>
            </div>
          );
        })}
        {myPats.length===0 && <p style={{color:'var(--muted)',fontSize:13}}>No patients yet. Register patients from the My Patients panel.</p>}
      </div>

      {open.length>0 && (
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>🔴 Urgent Concerns Needing Reply</div>
          {open.map(c=>{
            const pt = users.find(u=>u.id===c.patientId);
            return (
              <div key={c.id} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)',alignItems:'center'}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#f4667a,#f990a3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:12,flexShrink:0}}>{pt?.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{pt?.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{c.message.slice(0,70)}...</div>
                </div>
                {badge(c.priority==='high'?'var(--red)':'var(--orange)',c.priority)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PatientsPage({ user }) {
  const toast = useToast();
  const [allUsers,setAllUsers] = useState(()=>S.get('users')||[]);
  const myPats = allUsers.filter(u=>u.role==='patient'&&u.doctorId===user.id);
  const [open,setOpen] = useState(false);
  const [form,setForm] = useState({name:'',age:'',condition:'',email:'',phone:'',bloodGroup:'',dischargeDate:'',password:'patient123'});
  const [errs,setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (!V.name(form.name))  e.name  = 'Name must be 2–50 letters';
    if (!V.email(form.email)) e.email = 'Enter valid email address';
    if (form.phone && !V.phone(form.phone)) e.phone = '10-digit Indian mobile (starts 6–9)';
    if (form.age   && !V.age(form.age))    e.age   = 'Age must be 1–120';
    return e;
  };

  const add = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); toast('Please fix form errors','error'); return; }
    setErrs({});
    if (allUsers.find(u=>u.email.toLowerCase()===form.email.toLowerCase())) {
      toast('An account with this email already exists','error'); return;
    }
    const np = {
      id:'p'+Date.now(),
      role:'patient',
      avatar:form.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2),
      doctorId: user.id,
      ...form,
      age:+form.age
    };
    const updated = [...allUsers,np];
    S.set('users',updated); setAllUsers(updated);
    const v=S.get('vitals')||{};v[np.id]=[]; S.set('vitals',v);
    const t=S.get('tasks')||{};t[np.id]=[]; S.set('tasks',t);
    const m=S.get('medications')||{};m[np.id]=[]; S.set('medications',m);
    const n=S.get('notes')||{};n[np.id]=[]; S.set('notes',n);
    setOpen(false);
    setForm({name:'',age:'',condition:'',email:'',phone:'',bloodGroup:'',dischargeDate:'',password:'patient123'});
    toast('Patient registered!');
  };

  const del = id => {
    const updated=allUsers.filter(u=>u.id!==id);
    S.set('users',updated); setAllUsers(updated); toast('Patient removed','warn');
  };

  const allV = S.get('vitals')||{};
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <h2 style={{fontSize:22,fontWeight:900}}>🧑‍⚕️ My Patients</h2>
        <button onClick={()=>setOpen(true)} style={BTN1} className="btn-hover">+ Register Patient</button>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {myPats.map(p=>{
          const lv=(allV[p.id]||[]).slice(-1)[0]||{};
          return (
            <div key={p.id} className="card-hover" style={{...CARD,display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
              <div style={{width:50,height:50,borderRadius:'50%',background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:18,flexShrink:0}}>{p.avatar}</div>
              <div style={{flex:1,minWidth:160}}>
                <div style={{fontWeight:800,fontSize:15}}>{p.name}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>Age {p.age} · {p.condition} · {p.bloodGroup}</div>
                <div style={{fontSize:11,color:'var(--muted)'}}>📞 {p.phone} · ✉️ {p.email}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
                {[['BP',lv.bp||'--'],['Pulse',lv.pulse||'--'],['SpO2',(lv.spo2||'--')+'%'],['Pain',(lv.pain||'--')+'/10']].map(([k,v])=>(
                  <div key={k} style={{textAlign:'center',background:'var(--bg)',borderRadius:8,padding:'6px 10px'}}>
                    <div style={{fontSize:9,fontWeight:800,color:'var(--muted)'}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:900}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {badge('var(--green)','Active')}
                <button onClick={()=>del(p.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:15}}>🗑</button>
              </div>
            </div>
          );
        })}
        {myPats.length===0 && <div style={{...CARD,textAlign:'center',color:'var(--muted)',padding:32}}>No patients registered yet.</div>}
      </div>

      {open && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setOpen(false)}>
          <div className="modal">
            <div style={{fontWeight:900,fontSize:18,marginBottom:18}}>Register New Patient</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['name','Full Name'],['age','Age'],['condition','Condition'],['email','Email'],['phone','Phone'],['bloodGroup','Blood Group'],['dischargeDate','Discharge Date'],['password','Temp Password']].map(([k,l])=>(
                <div key={k}>
                  <label style={LBL}>{l}</label>
                  <input
                    style={{...INP,borderColor:errs[k]?'var(--red)':undefined}}
                    type={k==='dischargeDate'?'date':'text'}
                    value={form[k]}
                    onChange={e=>{setForm(f=>({...f,[k]:e.target.value}));setErrs(x=>({...x,[k]:''}));}}
                  />
                  {errs[k] && <span className="field-error">{errs[k]}</span>}
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button onClick={add} style={BTN_G} className="btn-hover">Register</button>
              <button onClick={()=>{setOpen(false);setErrs({});}} style={BTN2} className="btn-hover">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorVitals({ user }) {
  const users = S.get('users')||[];
  const myPats = users.filter(u=>u.role==='patient'&&u.doctorId===user.id);
  const [sel,setSel] = useState(myPats[0]?.id||'');
  const [vitals, setVitals] = useState(()=>(S.get('vitals')||{})[myPats[0]?.id||'']||[]);

  useEffect(()=>{
    if (sel) setVitals((S.get('vitals')||{})[sel]||[]);
  },[sel]);

  const lbl = vitals.map(v=>v.date.slice(5));
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <h2 style={{fontSize:22,fontWeight:900}}>📊 Vitals Monitor</h2>
        {myPats.length > 0
          ? <select style={{...INP,width:220}} value={sel} onChange={e=>setSel(e.target.value)}>
              {myPats.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          : <span style={{fontSize:13,color:'var(--muted)'}}>No patients assigned yet.</span>
        }
      </div>
      {sel && vitals.length > 0 ? <>
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
          <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>Full Vitals Log</div>
          <div style={{overflowX:'auto'}}>
            <table>
              <thead><tr>{['Date','BP','Pulse','SpO2','Weight','Temp','Pain'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {[...vitals].reverse().map((v,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:700}}>{v.date}</td><td>{v.bp}</td>
                    <td>{badge(v.pulse>100?'var(--red)':'var(--green)',v.pulse)}</td>
                    <td>{badge(v.spo2>=98?'var(--green)':'var(--orange)',v.spo2+'%')}</td>
                    <td>{v.weight} kg</td><td>{v.temp}°F</td>
                    <td>{badge(v.pain<=3?'var(--green)':v.pain<=6?'var(--orange)':'var(--red)',v.pain+'/10')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </> : sel ? (
        <div style={{...CARD,textAlign:'center',color:'var(--muted)',padding:32}}>No vitals logged for this patient yet.</div>
      ) : null}
      {myPats.length===0 && <p style={{color:'var(--muted)'}}>No patients assigned yet.</p>}
    </div>
  );
}

function ReportsPage({ user }) {
  const users = S.get('users')||[];
  const myPats = users.filter(u=>u.role==='patient'&&u.doctorId===user.id);
  const allV=S.get('vitals')||{}, allM=S.get('medications')||{}, allT=S.get('tasks')||{};
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{fontSize:22,fontWeight:900}}>📈 Recovery Reports</h2>
      {myPats.length===0 && <p style={{color:'var(--muted)'}}>No patients to report on.</p>}
      {myPats.map(p=>{
        const v=allV[p.id]||[], m=allM[p.id]||[], t=allT[p.id]||[];
        const adh=m.length?Math.round(m.reduce((s,x)=>s+x.adherence,0)/m.length):0;
        const td=t.filter(x=>x.done).length;
        const days=p.dischargeDate?Math.round((new Date()-new Date(p.dischargeDate))/86400000):0;
        const rec=Math.min(95,Math.round((days/60)*100));
        const pulse=v.map(x=>x.pulse);
        return (
          <div key={p.id} style={CARD}>
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
              <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:15}}>{p.avatar}</div>
              <div>
                <div style={{fontWeight:800,fontSize:15}}>{p.name}</div>
                <div style={{fontSize:12,color:'var(--muted)'}}>{p.condition} · Day {days}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:18,alignItems:'center',flexWrap:'wrap'}}>
              <Ring pct={rec} color="var(--accent)" label="Recovery" size={80}/>
              <Ring pct={adh} color="var(--purple)" label="Med Adher." size={80}/>
              <Ring pct={t.length?Math.round(td/t.length*100):0} color="var(--green)" label="Tasks" size={80}/>
              {pulse.length>1 && <div><div style={{fontSize:10,fontWeight:800,color:'var(--muted)',marginBottom:4}}>PULSE TREND</div><Sparkline data={pulse} color="var(--red)" w={180} h={48}/></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  seedData();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    if (user.role==='patient') {
      const map = {
        dashboard:<PatientDashboard user={user}/>,
        vitals:<VitalsPage user={user}/>,
        medications:<MedicationsPage user={user}/>,
        appointments:<AppointmentsPage user={user}/>,
        tasks:<TasksPage user={user}/>,
        concerns:<ConcernsPage user={user}/>,
        notes:<NotesPage user={user}/>,
        education:<EducationPage/>,
        profile:<ProfilePage user={user} onUpdate={setUser}/>,
      };
      return map[page]||map.dashboard;
    } else {
      const map = {
        dashboard:<DoctorDashboard user={user}/>,
        patients:<PatientsPage user={user}/>,
        appointments:<AppointmentsPage user={user}/>,
        concerns:<ConcernsPage user={user}/>,
        vitals:<DoctorVitals user={user}/>,
        medications:<MedicationsPage user={user}/>,
        notes:<NotesPage user={user}/>,
        reports:<ReportsPage user={user}/>,
        profile:<ProfilePage user={user} onUpdate={setUser}/>,
      };
      return map[page]||map.dashboard;
    }
  };

  return (
    <ToastProvider>
      {!user
        ? <Login onLogin={u=>{setUser(u);setPage('dashboard');}}/>
        : (
          <div style={{display:'flex',minHeight:'100vh'}}>
            <Sidebar user={user} active={page} setActive={setPage} onLogout={()=>{setUser(null);setPage('dashboard');}}/>
            <div style={{flex:1,overflowY:'auto',padding:24,minHeight:'100vh'}}>
              <div style={{maxWidth:1100,margin:'0 auto'}}>
                {renderPage()}
              </div>
            </div>
          </div>
        )
      }
    </ToastProvider>
  );
}

export default App;
