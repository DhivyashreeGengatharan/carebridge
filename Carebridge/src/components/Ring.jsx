import React, { useRef, useEffect } from 'react';

function Ring({ pct=0, color='#4f86c6', label='', size=90 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,size,size);
    const cx=size/2, cy=size/2, r=size/2-10;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle = color+'25'; ctx.lineWidth = 9; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(pct/100)*Math.PI*2);
    ctx.strokeStyle = color; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = `bold ${size<80?13:16}px Nunito,sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(pct+'%', cx, cy);
  }, [pct, color, size]);
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
      <canvas ref={ref} width={size} height={size}/>
      {label && <span style={{fontSize:11,color:'var(--muted)',fontWeight:700}}>{label}</span>}
    </div>
  );
}

export default Ring;
