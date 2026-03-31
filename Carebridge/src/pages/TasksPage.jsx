import React, { useState } from 'react';
import S from '../utils/storage.js';
import { useToast } from '../context/ToastContext.jsx';
import Ring from '../components/Ring.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };
const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const LBL = { fontSize:11,fontWeight:800,color:'var(--muted)',marginBottom:4,display:'block',letterSpacing:'0.5px',textTransform:'uppercase' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

function TasksPage({ user }) {
  const toast = useToast();
  const pid = user.id;
  const [tasks, setTasks] = useState(()=>(S.get('tasks')||{})[pid]||[]);
  const [txt, setTxt] = useState('');
  const [due, setDue] = useState(new Date().toISOString().split('T')[0]);

  const persist = t => { const all=S.get('tasks')||{}; all[pid]=t; S.set('tasks',all); setTasks(t); };
  const toggle = id => persist(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));
  const del    = id => { persist(tasks.filter(t=>t.id!==id)); toast('Task removed','warn'); };
  const add    = () => { if (!txt.trim()) return; persist([...tasks,{id:'t'+Date.now(),text:txt,done:false,date:due}]); setTxt(''); toast('Task added!'); };

  const done = tasks.filter(t=>t.done).length;
  const pct  = tasks.length ? Math.round(done/tasks.length*100) : 0;

  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{fontSize:22,fontWeight:900}}>✅ Recovery Tasks</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:14}}>
        <div style={{...CARD,textAlign:'center'}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>Today's Progress</div>
          <Ring pct={pct} color="var(--green)" size={120}/>
          <div style={{marginTop:10,fontSize:13,color:'var(--muted)',fontWeight:700}}>{done}/{tasks.length} tasks done</div>
        </div>
        <div style={CARD}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>All Tasks</div>
          <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
            <input style={{...INP,flex:1,minWidth:120}} value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Add new task..." onKeyDown={e=>e.key==='Enter'&&add()}/>
            <input type="date" style={{...INP,width:150}} value={due} onChange={e=>setDue(e.target.value)}/>
            <button onClick={add} style={BTN1} className="btn-hover">Add</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflowY:'auto'}}>
            {tasks.map(t=>(
              <div key={t.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:t.done?'#edfbf5':'var(--bg)',borderRadius:10,border:`1px solid ${t.done?'#3ec98e44':'var(--border)'}`}}>
                <button onClick={()=>toggle(t.id)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${t.done?'var(--green)':'var(--border)'}`,background:t.done?'var(--green)':'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#fff',fontWeight:900,fontSize:12,fontFamily:'Nunito,sans-serif'}}>
                  {t.done?'✓':''}
                </button>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,textDecoration:t.done?'line-through':'none',color:t.done?'var(--muted)':'var(--text)'}}>{t.text}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>Due: {t.date}</div>
                </div>
                <button onClick={()=>del(t.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14}}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
