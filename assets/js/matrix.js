/* ============================================================
   matrix.js — общий matrix-дождь (используется index и breach)
   ============================================================ */
(function () {
  'use strict';
  const mcv = document.getElementById('matrixCanvas');
  if (!mcv) return;
  const mc = mcv.getContext('2d');
  const GLYPHS = 'アカサタナハマヤラワエケセテネヘメレヲン0123456789ABCDEFX$#@%喰種'.split('');
  let mcols = [];
  function mInit() {
    mcv.width = innerWidth; mcv.height = innerHeight;
    const fs = 15, n = Math.ceil(innerWidth / fs);
    mcols = Array.from({ length: n }, () => Math.random() * mcv.height);
  }
  mInit(); addEventListener('resize', mInit);
  (function mLoop() {
    requestAnimationFrame(mLoop);
    mc.fillStyle = 'rgba(7,7,11,0.08)';
    mc.fillRect(0, 0, mcv.width, mcv.height);
    mc.font = '15px "Noto Sans JP", monospace';
    const fs = 15;
    mcols.forEach((y, i) => {
      const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      const x = i * fs;
      mc.fillStyle = Math.random() > 0.975 ? '#eaffef' : '#123f24';
      mc.fillText(ch, x, y);
      mcols[i] = y > mcv.height + Math.random() * 500 ? 0 : y + fs;
    });
  })();
})();
