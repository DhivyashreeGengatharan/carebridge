import React, { useRef, useEffect } from 'react';

function BarChart({ data=[], labels=[], color='#4f86c6', w=300, h=130 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!data.length) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,w,h);
    const max = Math.max(...data)*1.25||1;
    const barW = Math.max(8, (w-40)/data.length-6);
    data.forEach((v,i) => {
      const x = 20 + i*((w-40)/data.length) + 3;
      const bh = (v/max)*(h-35);
      const y = h-20-bh;
      const g = ctx.createLinearGradient(0,y,0,h-20);
      g.addColorStop(0, color); g.addColorStop(1, color+'66');
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x,y,barW,bh,4) : ctx.rect(x,y,barW,bh);
      ctx.fillStyle = g; ctx.fill();
      if (labels[i]) {
        ctx.fillStyle = '#7a8fa8'; ctx.font = '9px Nunito,sans-serif';
        ctx.textAlign = 'center'; ctx.fillText(labels[i], x+barW/2, h-6);
      }
      ctx.fillStyle = color; ctx.font = 'bold 10px Nunito,sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(v, x+barW/2, y-4);
    });
  }, [data, labels, color, w, h]);
  return <canvas ref={ref} width={w} height={h} style={{display:'block',maxWidth:'100%'}}/>;
}

export default BarChart;
