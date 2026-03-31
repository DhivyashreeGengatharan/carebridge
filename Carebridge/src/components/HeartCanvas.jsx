import React, { useRef, useEffect } from 'react';

function HeartCanvas({ size=110 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0, id;
    const pts = [];
    for (let t = 0; t < Math.PI*2; t += 0.04) {
      pts.push({ x: 16*Math.pow(Math.sin(t),3), y: -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)) });
    }
    function draw() {
      ctx.clearRect(0,0,size,size);
      const scale = 3.6 + Math.sin(frame*0.06)*0.5;
      ctx.save();
      ctx.translate(size/2, size/2);
      ctx.beginPath();
      pts.forEach((p,i) => { const x=p.x*scale, y=p.y*scale; i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y); });
      ctx.closePath();
      const g = ctx.createRadialGradient(0,-6,2,0,0,55);
      g.addColorStop(0,'rgba(244,102,122,1)');
      g.addColorStop(1,'rgba(249,144,163,0.5)');
      ctx.fillStyle = g;
      ctx.shadowColor = 'rgba(244,102,122,0.4)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
      frame++; id = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(id);
  }, [size]);
  return <canvas ref={ref} width={size} height={size}/>;
}

export default HeartCanvas;
