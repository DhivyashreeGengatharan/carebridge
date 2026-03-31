import React, { useRef, useEffect } from 'react';

function Sparkline({ data=[], color='#4f86c6', w=180, h=48 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!data.length || data.length < 2) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,w,h);
    const min = Math.min(...data), max = Math.max(...data), range = max-min||1;
    const pts = data.map((v,i) => ({ x: 8+(i/(data.length-1))*(w-16), y: h-8-((v-min)/range)*(h-16) }));
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, color+'55'); g.addColorStop(1, color+'00');
    ctx.beginPath(); ctx.moveTo(pts[0].x, h);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, h); ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath();
    pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
    const lp = pts[pts.length-1];
    ctx.beginPath(); ctx.arc(lp.x,lp.y,4.5,0,Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
    ctx.beginPath(); ctx.arc(lp.x,lp.y,2,0,Math.PI*2);
    ctx.fillStyle = '#fff'; ctx.fill();
  }, [data, color, w, h]);
  return <canvas ref={ref} width={w} height={h} style={{display:'block'}}/>;
}

export default Sparkline;
