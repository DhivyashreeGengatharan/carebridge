import React, { useRef, useState } from 'react';

const INP = { border:'1.5px solid var(--border)',borderRadius:9,padding:'8px 12px',fontFamily:'Nunito,sans-serif',fontSize:13,color:'var(--text)',background:'#fafbff',width:'100%',display:'block' };
const BTN1 = { background:'linear-gradient(135deg,#4f86c6,#6fa3de)',color:'#fff',border:'none',borderRadius:10,padding:'8px 18px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };
const BTN2 = { background:'var(--accent-soft)',color:'var(--accent)',border:'none',borderRadius:10,padding:'8px 16px',fontWeight:800,cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif' };

function DrawingPad({ onSave }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [color, setColor] = useState('#4f86c6');
  const [sz, setSz] = useState(4);
  const [tool, setTool] = useState('pen');

  const pos = e => {
    const r = ref.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX-r.left, y: src.clientY-r.top };
  };
  const start = e => { drawing.current=true; last.current=pos(e); };
  const move = e => {
    if (!drawing.current) return;
    const p = pos(e);
    const ctx = ref.current.getContext('2d');
    if (tool==='eraser') { ctx.clearRect(p.x-sz*2,p.y-sz*2,sz*4,sz*4); }
    else {
      ctx.beginPath(); ctx.moveTo(last.current.x,last.current.y); ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=color; ctx.lineWidth=sz; ctx.lineCap='round'; ctx.stroke();
    }
    last.current = p;
  };
  const stop = () => { drawing.current=false; };
  const clear = () => { const ctx=ref.current.getContext('2d'); ctx.clearRect(0,0,560,200); };

  const COLORS = ['#4f86c6','#3ec98e','#f4667a','#f59e40','#9b72cf','#38bcd4','#1a2744','#ffffff'];
  return (
    <div>
      <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
        {COLORS.map(c=>(
          <button key={c} onClick={()=>setColor(c)} style={{width:22,height:22,borderRadius:'50%',background:c,border:color===c?'3px solid #1a2744':'2px solid #ddd',cursor:'pointer'}}/>
        ))}
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:26,height:26,borderRadius:'50%',border:'none',cursor:'pointer',padding:0}}/>
        <select value={sz} onChange={e=>setSz(+e.target.value)} style={{...INP,width:90,padding:'5px 8px'}}>
          <option value={2}>Thin</option><option value={4}>Medium</option><option value={8}>Thick</option>
        </select>
        <select value={tool} onChange={e=>setTool(e.target.value)} style={{...INP,width:110,padding:'5px 8px'}}>
          <option value="pen">✏️ Pen</option><option value="eraser">🧹 Eraser</option>
        </select>
        <button onClick={clear} style={BTN2}>Clear</button>
        {onSave && <button onClick={()=>onSave(ref.current.toDataURL())} style={BTN1}>💾 Save Note</button>}
      </div>
      <canvas id="drawingCanvas" ref={ref} width={560} height={200}
        style={{border:'2px dashed var(--border)',borderRadius:12,background:'#fafbff',display:'block',maxWidth:'100%'}}
        onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
      />
    </div>
  );
}

export default DrawingPad;
