import React from 'react';

function Sidebar({ user, active, setActive, onLogout }) {
  const patientNav = [
    {id:'dashboard',icon:'🏠',label:'Dashboard'},
    {id:'vitals',icon:'💓',label:'My Vitals'},
    {id:'medications',icon:'💊',label:'Medications'},
    {id:'appointments',icon:'📅',label:'Appointments'},
    {id:'tasks',icon:'✅',label:'Recovery Tasks'},
    {id:'concerns',icon:'💬',label:'Ask My Doctor'},
    {id:'notes',icon:'📝',label:'Drawing Notes'},
    {id:'education',icon:'📚',label:'Health Library'},
    {id:'profile',icon:'👤',label:'My Profile'},
  ];
  const doctorNav = [
    {id:'dashboard',icon:'🏠',label:'Dashboard'},
    {id:'patients',icon:'🧑‍⚕️',label:'My Patients'},
    {id:'appointments',icon:'📅',label:'Appointments'},
    {id:'concerns',icon:'💬',label:'Patient Concerns'},
    {id:'vitals',icon:'📊',label:'Vitals Monitor'},
    {id:'medications',icon:'💊',label:'Prescriptions'},
    {id:'notes',icon:'📝',label:'Clinical Notes'},
    {id:'reports',icon:'📈',label:'Reports'},
    {id:'profile',icon:'👤',label:'My Profile'},
  ];
  const nav = user.role==='patient' ? patientNav : doctorNav;
  return (
    <div className="sidebar" style={{width:220,minHeight:'100vh',display:'flex',flexDirection:'column',flexShrink:0,boxShadow:'4px 0 20px rgba(26,39,68,0.18)',position:'sticky',top:0,alignSelf:'flex-start',height:'100vh',overflowY:'auto'}}>
      <div style={{padding:'22px 18px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>❤️‍🩺</div>
          <div>
            <div style={{color:'#fff',fontWeight:900,fontSize:15,fontFamily:'Sora,sans-serif',lineHeight:1}}>CareBridge</div>
            <div style={{color:'rgba(255,255,255,0.38)',fontSize:10,fontWeight:600}}>Post Discharge</div>
          </div>
        </div>
      </div>
      <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.07)',marginBottom:6}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#4f86c6,#6fa3de)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:12,flexShrink:0}}>{user.avatar}</div>
          <div style={{minWidth:0}}>
            <div style={{color:'#fff',fontWeight:800,fontSize:13,lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
            <div style={{color:'rgba(255,255,255,0.38)',fontSize:10,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.role==='doctor'?user.specialty:user.condition}</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'0 10px'}}>
        {nav.map(item=>(
          <button key={item.id} onClick={()=>setActive(item.id)}
            className={`nav-item ${active===item.id?'nav-active':'nav-inactive'}`}
            style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:10,border:'none',cursor:'pointer',marginBottom:1,fontSize:12.5,fontFamily:'Nunito,sans-serif',fontWeight:600,background:'transparent',textAlign:'left'}}>
            <span style={{fontSize:14}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div style={{padding:'0 10px 10px'}}>
        <button onClick={onLogout} className="nav-item" style={{width:'100%',padding:'9px 10px',borderRadius:10,border:'none',cursor:'pointer',background:'rgba(244,102,122,0.14)',color:'#f4667a',fontWeight:800,fontSize:12.5,fontFamily:'Nunito,sans-serif',display:'flex',alignItems:'center',gap:8}}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
