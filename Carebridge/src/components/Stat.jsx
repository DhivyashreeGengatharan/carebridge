import React from 'react';
import Sparkline from './Sparkline.jsx';

const CARD = { background:'#fff',borderRadius:16,padding:20,border:'1px solid var(--border)',boxShadow:'0 2px 12px rgba(79,134,198,0.06)' };

function Stat({ icon, label, value, sub, grad, spark, sparkColor }) {
  return (
    <div className="card-hover" style={{...CARD, background:grad||'#fff', color:grad?'#fff':undefined, display:'flex',flexDirection:'column',gap:8,minWidth:0}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <div style={{fontSize:10,fontWeight:800,opacity:.7,textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</div>
          <div style={{fontSize:25,fontWeight:900,lineHeight:1.2,marginTop:2}}>{value}</div>
          {sub && <div style={{fontSize:11.5,opacity:.7,marginTop:2}}>{sub}</div>}
        </div>
        <span style={{fontSize:28,opacity:.85}}>{icon}</span>
      </div>
      {spark && <Sparkline data={spark} color={sparkColor||(grad?'#fff':'var(--accent)')} w={150} h={38}/>}
    </div>
  );
}

export default Stat;
