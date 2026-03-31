/* ═══════════════════════════════════════════════
   STORAGE UTILITIES
═══════════════════════════════════════════════ */
const S = {
  get: k => { try { return JSON.parse(localStorage.getItem('cb_'+k)); } catch { return null; } },
  set: (k,v) => localStorage.setItem('cb_'+k, JSON.stringify(v)),
  del: k => localStorage.removeItem('cb_'+k),
};

export default S;
