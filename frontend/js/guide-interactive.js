document.addEventListener('DOMContentLoaded', () => {
  const inputW = document.getElementById('inputW');
  const inputF = document.getElementById('inputF');
  const inputP = document.getElementById('inputP');

  const valW = document.getElementById('valW');
  const valF = document.getElementById('valF');
  const valP = document.getElementById('valP');

  const calcResult = document.getElementById('calcResult');
  const calcBadge = document.getElementById('calcBadge');

  function calculateDistance() {
    const W = parseFloat(inputW.value);
    const F = parseFloat(inputF.value);
    const P = parseFloat(inputP.value);

    valW.textContent = `${W.toFixed(1)} ແມັດ`;
    valF.textContent = `${F}`;
    valP.textContent = `${P} Pixels`;

    // ສູດ D = (W * F) / P
    const distance = (W * F) / P;
    calcResult.textContent = `${distance.toFixed(1)} ແມັດ`;

    if (distance < 30.0) {
      calcResult.style.color = 'var(--destructive)';
      calcBadge.textContent = '⚠️ ອັນຕະລາຍ (< 30m)';
      calcBadge.className = 'badge badge-danger';
    } else {
      calcResult.style.color = 'var(--safe)';
      calcBadge.textContent = '✅ ປອດໄພ (≥ 30m)';
      calcBadge.className = 'badge badge-safe';
    }
  }

  inputW?.addEventListener('input', calculateDistance);
  inputF?.addEventListener('input', calculateDistance);
  inputP?.addEventListener('input', calculateDistance);

  calculateDistance();
});