import time
import threading
import platform
import subprocess
from pathlib import Path

class NonBlockingAudioAlert:
    """
    ຄລາສຈັດການສຽງເຕືອນໄລຍະ 30 ແມັດ ຮອງຮັບໄຟລ໌ sounds/ລະວັງລົດທາງໜ້າ.mp3
    """
    def __init__(self, cooldown_seconds: float = 3.0, sound_file: str = None):
        self.cooldown_seconds = cooldown_seconds
        self.last_alert_time = 0.0
        self.sound_file = str(sound_file) if sound_file else None
        self.use_pygame = False

        if self.sound_file and Path(self.sound_file).exists():
            try:
                import pygame
                pygame.mixer.init()
                pygame.mixer.music.load(self.sound_file)
                self.use_pygame = True
                print(f"🔊 ໂຫຼດໄຟລ໌ສຽງສຳເລັດ: {self.sound_file}")
            except Exception as e:
                print(f"⚠️ Pygame Audio ໃນ WSL ບໍ່ພ້ອມ ({e}), ຈະໃຊ້ລະບົບສຽງສຳຮອງແທນ.")

    def _sound_worker(self):
        try:
            if self.use_pygame:
                import pygame
                if not pygame.mixer.music.get_busy():
                    pygame.mixer.music.play()
            elif self.sound_file and Path(self.sound_file).exists():
                # ກໍລະນີລັນໃນ WSL (Linux) ແລ້ວຕ້ອງການເປີດສຽງອອກລຳໂພງ Windows ຫຼື ffplay
                subprocess.run(
                    ["ffplay", "-nodisp", "-autoexit", "-loglevel", "quiet", self.sound_file],
                    check=False
                )
            elif platform.system() == "Windows":
                import winsound
                winsound.Beep(1000, 400)
            else:
                print("\a🔊 [ແຈ້ງເຕືອນສຽງ: ລະວັງລົດທາງໜ້າ! (< 30m)]")
        except Exception as e:
            print(f"🔊 [ແຈ້ງເຕືອນ: ລະວັງລົດທາງໜ້າ!] ({e})")

    def trigger_alert(self) -> bool:
        now = time.time()
        if now - self.last_alert_time >= self.cooldown_seconds:
            self.last_alert_time = now
            threading.Thread(target=self._sound_worker, daemon=True).start()
            return True
        return False