export class AudioController {
  constructor(cooldownMs = 3000) {
    this.isEnabled = true;
    this.cooldownMs = cooldownMs;
    this.lastPlayedTime = 0;

    // ໂຫຼດໄຟລ໌ສຽງພາສາລາວແທ້ຈາກໂຟລເດີ ../sounds/
    this.voiceAudio = new Audio('../sounds/ລະວັງລົດທາງໜ້າ.mp3');
    this.voiceAudio.preload = 'auto';
  }

  toggleAudio() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.voiceAudio.pause();
      this.voiceAudio.currentTime = 0;
    }
    return this.isEnabled;
  }

  playAlert() {
    if (!this.isEnabled) return;

    const now = Date.now();
    if (now - this.lastPlayedTime < this.cooldownMs) return;
    this.lastPlayedTime = now;

    // ຫຼິ້ນສຽງ "ລະວັງລົດທາງໜ້າ.mp3"
    this.voiceAudio.currentTime = 0;
    this.voiceAudio.play().catch((err) => {
      console.warn("ກະລຸນາຄລິກປຸ່ມໃດໜຶ່ງເທິງໜ້າເວັບກ່ອນ ເພື່ອອະນຸຍາດໃຫ້ Browser ຫຼິ້ນສຽງ MP3:", err);
    });
  }
}