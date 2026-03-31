/* ═══════════════════════════════════════════════
   VALIDATION HELPERS
═══════════════════════════════════════════════ */
const V = {
  name:  v => /^[a-zA-Z\s]{2,50}$/.test((v||'').trim()),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').trim()),
  phone: v => /^[6-9]\d{9}$/.test((v||'').replace(/\s/g,'')),
  age:   v => { const n=+v; return Number.isInteger(n)&&n>=1&&n<=120; },
  bp:    v => /^\d{2,3}\/\d{2,3}$/.test((v||'').trim()),
  pulse: v => { const n=+v; return n>=30&&n<=200; },
  spo2:  v => { const n=+v; return n>=70&&n<=100; },
  temp:  v => { const n=+v; return n>=90&&n<=110; },
  msg:   v => (v||'').trim().length>=10,
};

export default V;
