export class ThreadVisualizer {
  constructor(canvasId, soundSynth, onStatusCallback) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.soundSynth = soundSynth;
    this.onStatusCallback = onStatusCallback;

    this.useThreading = true;
    this.autoSound = true;
    this.distance = 22.0;
    this.cooldownSec = 2.5;

    this.carX = 60;
    this.lastAlertTime = 0;
    this.soundActiveUntil = 0;
    this.videoFrozenUntil = 0;
  }

  start() {
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  triggerSoundAlert(now) {
    this.lastAlertTime = now;
    this.soundActiveUntil = now + 450; // ສຽງດັງຍາວ 450ms

    if (this.autoSound) {
      this.soundSynth.playBeep();
    }

    // ຖ້າບໍ່ໃຊ້ Threading ພາບວິດີໂອຈະຄ້າງຕະຫຼອດເວລາທີ່ສຽງກຳລັງດັງ!
    if (!this.useThreading) {
      this.videoFrozenUntil = now + 450;
    }
  }

  update() {
    const now = performance.now();
    const isDanger = this.distance < 30.0;
    const elapsedSinceAlert = (now - this.lastAlertTime) / 1000;

    // ກວດສອບເງື່ອນໄຂການປ່ອຍສຽງເຕືອນ (< 30m ແລະ พ้นໄລຍະ Cooldown)
    if (isDanger && elapsedSinceAlert >= this.cooldownSec) {
      this.triggerSoundAlert(now);
    }

    const isFrozen = now < this.videoFrozenUntil;
    const isSoundPlaying = now < this.soundActiveUntil;

    // ຖ້າວິດີໂອບໍ່ຄ້າງ ລົດຈຳລອງຈະແລ່ນຢ່າງລື່ນໄຫຼ
    if (!isFrozen) {
      this.carX += 3.5;
      if (this.carX > this.canvas.width - 80) {
        this.carX = 60;
      }
    }

    const cooldownRemaining = Math.max(0, this.cooldownSec - ((now - this.lastAlertTime) / 1000));
    const progressPercent = Math.min(100, ((this.cooldownSec - cooldownRemaining) / this.cooldownSec) * 100);

    this.onStatusCallback({
      fps: isFrozen ? 4 : 60,
      isFrozen,
      isSoundPlaying,
      cooldownRemaining,
      progressPercent
    });
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const now = performance.now();
    const isFrozen = now < this.videoFrozenUntil;
    const isSoundPlaying = now < this.soundActiveUntil;

    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, w, h);

    // 1. ແຕ້ມແຖບທີ 1: Main Video Thread (OpenCV Frame Loop)
    ctx.fillStyle = '#121215';
    ctx.fillRect(25, 25, w - 50, 115);
    ctx.strokeStyle = isFrozen ? '#ef4444' : '#27272a';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, w - 50, 115);

    ctx.fillStyle = '#fafafa';
    ctx.font = 'bold 13px Inter, Noto Sans Lao';
    ctx.fillText('1. Main Thread (OpenCV Video Loop - ການສະແດງພາບກ້ອງ)', 40, 50);

    // ແຕ້ມລົດທີ່ກຳລັງແລ່ນເທິງຈໍເພື່ອທົດສອບຄວາມລື່ນ
    const carColor = this.distance < 30.0 ? '#ef4444' : '#22c55e';
    ctx.fillStyle = carColor;
    ctx.fillRect(this.carX, 75, 65, 36);
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 11px Inter';
    ctx.fillText(`${this.distance.toFixed(1)}m`, this.carX + 12, 97);

    if (isFrozen) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillRect(w / 2 - 130, 68, 260, 44);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, Noto Sans Lao';
      ctx.fillText('⚠️ ພາບກ້ອງຄ້າງ! (Blocked by Sound)', w / 2 - 110, 95);
    }

    // 2. ແຕ້ມແຖບທີ 2: Audio Thread (Background Sound Worker)
    ctx.fillStyle = '#121215';
    ctx.fillRect(25, 165, w - 50, 110);
    ctx.strokeStyle = isSoundPlaying ? '#38bdf8' : '#27272a';
    ctx.strokeRect(25, 165, w - 50, 110);

    const threadTitle = this.useThreading
      ? '2. Audio Thread (ແຍກ Thread ສຽງອອກມາເຮັດວຽກເບື້ອງຫຼັງ - ພາບບໍ່ຄ້າງ)'
      : '2. ບໍ່ໄດ້ແຍກ Thread (ສຽງແຊກແຊງໃນ Main Thread ເຮັດໃຫ້ກ້ອງຄ້າງ)';
    ctx.fillStyle = '#fafafa';
    ctx.font = 'bold 13px Inter, Noto Sans Lao';
    ctx.fillText(threadTitle, 40, 190);

    // ແຕ້ມຄື້ນສຽງເມື່ອສຽງກຳລັງດັງ
    if (isSoundPlaying) {
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 24; i++) {
        const barH = 12 + Math.sin(now * 0.04 + i) * 18;
        ctx.fillRect(45 + i * 24, 235 - barH / 2, 14, barH);
      }
      ctx.fillText('🔊 ກຳລັງປ່ອຍສຽງເຕືອນ Beep! (400ms)', 45, 215);
    } else {
      ctx.fillStyle = '#71717a';
      ctx.font = '12px Inter, Noto Sans Lao';
      ctx.fillText('⏳ ລໍຖ້າຮອບ Cooldown ຕໍ່ໄປ...', 45, 235);
    }
  }
}

export class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
  }

  playBeep() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const startTime = this.audioCtx.currentTime;
      const beepDuration = 0.11;
      const beepGap = 0.08;

      // ສ້າງສຽງ Beep, beep, beep! (3 ຄັ້ງຕິດຕໍ່ກັນ)
      for (let i = 0; i < 3; i++) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const t0 = startTime + i * (beepDuration + beepGap);
        const t1 = t0 + beepDuration;

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, t0);

        gain.gain.setValueAtTime(0.15, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t1);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(t0);
        osc.stop(t1);
      }
    } catch (err) {
      console.warn('ກະລຸນາຄລິກໜ້າເວັບກ່ອນເພື່ອເປີດສຽງ', err);
    }
  }
}