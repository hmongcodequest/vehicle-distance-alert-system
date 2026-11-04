ນີ້ແມ່ນໄຟລ໌ **`README.md`** ລະດັບມືອາຊີບສຳລັບອັບໂຫຼດຂຶ້ນໜ້າຫຼັກຂອງ GitHub (ຂຽນເປັນ **2 ພາສາ: ລາວ ແລະ ອັງກິດ** ພ້ອມ Badges, ຕາຕະລາງບົດຮຽນ, ໂຄງສ້າງໄຟລ໌ ແລະ ຄູ່ມືການລັນຄົບຖ້ວນ).

ໃຫ້ເຈົ້າສ້າງໄຟລ໌ຊື່ວ່າ **`README.md`** ໄວ້ຢູ່ໂຟລເດີຫຼັກສຸດ (`vehicle-distance-alert-system/README.md`) ແລ້ວກ໊ອບປີ້ຂໍ້ຄວາມລຸ່ມນີ້ໄປວາງໃສ່ໄດ້ເລີຍ:

---

```markdown
# 🚗 Vehicle Distance Alert System (30m) & Interactive Web Course
**ລະບົບວິເຄາະໄລຍະຫ່າງລົດທາງໜ້າ 30 ແມັດ ດ້ວຍ Python (YOLOv8 + OpenCV) ພ້ອມເວັບໄຊຄູ່ມືການຮຽນຮູ້ແບບ Interactive**

![Python](https://img.shields.io/badge/Python-3.10%2B%20%7C%203.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![YOLOv8](https://img.shields.io/badge/AI-YOLOv8%20Ultralytics-00FFFF?style=for-the-badge)
![OpenCV](https://img.shields.io/badge/Computer%20Vision-OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![UI Style](https://img.shields.io/badge/Frontend-shadcn%2Fui%20Style-09090B?style=for-the-badge)

---

## 🌟 ພາບລວມຂອງໂປຣເຈັກ (Project Overview)

ໂປຣເຈັກນີ້ຖືກພັດທະນາຂຶ້ນເພື່ອວິເຄາະໄລຍະຫ່າງລະຫວ່າງລົດຂອງຜູ້ຂັບຂີ່ ແລະ ລົດຄັນທາງໜ້າໃນເລນດຽວກັນ (Ego Lane) ໂດຍໃຊ້ກ້ອງໜ້າລົດພຽງຕົວດຽວ (Monocular Camera) ຮ່ວມກັບ **YOLOv8** ແລະ ຫຼັກການຄະນິດສາດ **Triangle Similarity (ຮູບສາມແຈຄ້າຍຄື)**. ລະບົບຈະສົ່ງສຽງເຕືອນ **"Beep, beep, beep!"** ໂດຍອັດຕະໂນມັດທັນທີເມື່ອລົດຄັນໜ້າຢູ່ໃກ້ກວ່າ **30.0 ແມັດ**.

ນອກຈາກລະຫັດ Python ສຳລັບประมวลผลວິດີໂອຕົວຈິງແລ້ວ, ໂປຣເຈັກນີ້ຍັງມາພ້ອມກັບ **ເວັບໄຊຄູ່ມືການຮຽນຮູ້ 4 ບົດຮຽນແບບ Interactive (shadcn/ui Dark Mode)** ທີ່ຊ່ວຍໃຫ້ຜູ້ຮຽນສາມາດທົດລອງປັບຄ່າສູດຄະນິດສາດ, ເຂດເລນ (ROI), ແລະ ທົດສອບລະບົບສຽງ Threading ຜ່ານເວັບບຣາວເຊີໄດ້ໂດຍກົງ.

### ✨ ຈຸດເດັ່ນຂອງລະບົບ (Key Features)
* 📐 **Triangle Similarity Distance Estimation:** ຄິດໄລ່ໄລຍະຫ່າງຕົວຈິງ (ແມັດ) ຈາກຄວາມກວ້າງ Pixel ຂອງກ່ອງລົດດ້ວຍສູດ $D = \frac{W \times F}{P}$.
* 🎯 **Pre-configured JSON Lane ROI (`lane_config.json`):** ແຍກຂັ້ນຕອນການກຳນົດເຂດເລນ 4 ຈຸດ (`lane_points`) ແລະ ເສັ້ນຂອບເທິງ (`lane_top_y`) ອອກເປັນໄຟລ໌ JSON ກ່ອນການຄຳນວນຕົວຈິງ (ພ້ອມເຊື່ອງເສັ້ນ `lane_top_y` ໄວ້ເບື້ອງຫຼັງເພື່ອບໍ່ໃຫ້ບັງໜ້າຈໍ).
* 🧹 **Modular Noise & Overlap Filter (`utils/` Package):**
  * ຊູມຕັດພາບສະເພາະປ່ອງຢ້ຽມໜ້າລົດ (`imgsz=960`) ເພື່ອກວດຈັບລົດທີ່ຢູ່ໄກໄດ້ຢ່າງແມ່ນຍຳ.
  * ຕັດກ່ອງລົບກວນຂະໜາດໃຫຍ່ທີ່ກວດຈັບເສົາລົດ/ຫ້ອງໂດຍສານຂອງລົດຕົວເອງອອກ 100%.
  * ລວມກ່ອງ `WARNING!` ທີ່ຊ້ອນທັບກັນເທິງລົດຄັນດຽວ (IoU & Containment Filter) ໃຫ້ເຫຼືອພຽງ 1 ກ່ອງທີ່ສະອາດ.
* 🔊 **Non-Blocking Triple Beep Alert (`threading.Thread`):** ປ່ອຍສຽງເຕືອນ *"Beep, beep, beep!"* ຜ່ານ Background Thread ພ້ອມລະບົບ Cooldown Timer ໂດຍບໍ່ເຮັດໃຫ້ພາບວິດີໂອກະຕຸກ.
* 📚 **4-Chapter Interactive Web Portal:** ໜ້າເວັບຄູ່ມືການຮຽນ ແລະ Dashboard ຈຳລອງທີ່ສາມາດ Deploy ຂຶ້ນ **GitHub Pages** ໄດ້ທັນທີ.

---

## 🌐 ລິ້ງເວັບໄຊຄູ່ມືການຮຽນ (Live Demo - GitHub Pages)
> 💡 *(ຫຼັງຈາກເປີດໃຊ້ງານ GitHub Pages ແລ້ວ ປ່ຽນ `YOUR_USERNAME` ເປັນຊື່ບັນຊີ GitHub ຂອງເຈົ້າ)*
* **🏠 ໜ້າສາລະບານຫຼັກ (Main Course Portal):** `https://YOUR_USERNAME.github.io/vehicle-distance-alert-system/`
* **🎬 ໜ້າກະດານຄວບຄຸມ (Live Dashboard):** `https://YOUR_USERNAME.github.io/vehicle-distance-alert-system/frontend/index.html`

| ບົດຮຽນ (Chapter) | ຫົວຂໍ້ການຮຽນຮູ້ (Topic) | ໄຟລ໌ Python ປະຈຳບົດ |
| :--- | :--- | :--- |
| **Chapter 01** | 📐 ທິດສະດີສາມແຈຄ້າຍຄື (Triangle Similarity & Optical Diagram) | `triangle_math.py` |
| **Chapter 02** | 🧪 ຫ້ອງທົດລອງສູດ & ການປັບຄ່າກ້ອງ (Camera Calibration Lab) | `calibrate_camera.py`, `distance_calculator.py` |
| **Chapter 03** | 🎯 ການກວດຈັບລົດ YOLOv8, ເຂດເລນ JSON & ຕົວຕັດສິ່ງລົບກວນ | `yolo_detector.py`, `run_video_test.py` |
| **Chapter 04** | 🔊 ສຽງເຕືອນ "Beep, beep, beep!" ແບບ Threading & ລະບົບສົມບູນ | `select_lane_roi.py`, `audio_manager.py`, `utils/`, `full_system_30m.py` |

---

## 📁 ໂຄງສ້າງໄຟລ໌ຂອງໂປຣເຈັກ (Project Structure)

```text
vehicle-distance-alert-system/
│
├── index.html                              # 🏠 ໜ້າສາລະບານລວມ (Main Course Portal)
├── requirements.txt                        # ລາຍຊື່ Library Python ທີ່ຈຳເປັນ
├── README.md                               # ຄູ່ມືອະທິບາຍໂປຣເຈັກ
│
├── portal-assets/                          # CSS & JS ຂອງໜ້າສາລະບານລວມ
├── frontend/                               # 🎬 ໜ້າ Dashboard ສະແດງວິດີໂອ dome.mp4 ເທິງເວັບ
│
├── chapter-01-triangle-similarity/         # 📘 ບົດທີ 1: ທິດສະດີສາມແຈຄ້າຍຄື (Web + Python)
├── chapter-02-interactive-lab/             # 🧪 ບົດທີ 2: ຫ້ອງທົດລອງສູດ & Calibration (Web + Python)
├── chapter-03-yolov8-detection/            # 🎯 ບົດທີ 3: ການກວດຈັບລົດ YOLOv8 & ROI (Web + Python)
│
├── chapter-04-audio-threading/             # ⭐ ບົດທີ 4: ລະບົບສຽງ Threading & ໂປຣແກຣມສະບັບສົມບູນ
│   ├── index.html
│   └── python/
│       ├── utils/                          # 📦 Package ຕັດສິ່ງລົບກວນ & ຈັດການກ່ອງ AI
│       │   ├── __init__.py
│       │   ├── bbox_nms.py                 # ລຶບກ່ອງຊ້ອນທັບກັນເທິງລົດຄັນດຽວ (IoU & Containment)
│       │   ├── geometry_filter.py          # ຕັດກ່ອງລົບກວນຫ້ອງໂດຍສານ & ກວດເຂດເລນ Polygon
│       │   ├── detection_pipeline.py       # ລວມຂັ້ນຕອນການກັ່ນຕອງ ແລະ ຄິດໄລ່ໄລຍະ 30m
│       │   └── visualizer.py               # ແຕ້ມກອບເລນສີຟ້າ ແລະ ປ້າຍໄລຍະຫ່າງ
│       ├── audio_manager.py                # ລະບົບສຽງ "Beep, beep, beep!" ແບບ Non-blocking
│       ├── select_lane_roi.py              # Step 1: ເຄື່ອງມືຄລິກເລືອກເຂດເລນບັນທຶກລົງ JSON
│       └── full_system_30m.py              # Step 2: ໄຟລ໌ລັນລະບົບວິເຄາະໄລຍະ 30m ຕົວຈິງ
│
├── models/
│   └── yolov8n.pt                          # ໂມເດລ YOLOv8 Nano
├── sounds/
│   └── beep_3x.wav                         # ໄຟລ໌ສຽງເຕືອນ Beep 3 ຈັງຫວະ
└── videos/
    ├── dome.mp4                            # ວິດີໂອຕົ້ນສະບັບສຳລັບທົດສອບ
    ├── lane_config.json                    # ໄຟລ໌ JSON ເກັບຄ່າ lane_points ແລະ lane_top_y
    └── output_dome_30m.mp4                 # ວິດີໂອຜົນລັບທີ່ຜ່ານການຕີກອບວັດແທກໄລຍະ 30m ແລ້ວ
```

---

## 🚀 ວິທີຕິດຕັ້ງ ແລະ ລັນໂປຣເຈັກ (Installation & Usage)

### 1. ສ້າງ ແລະ ເປີດໃຊ້ງານ Virtual Environment (`venv`)

```bash
# ສ້າງໂຟລເດີ venv
python -m venv venv

# 👉 ສຳລັບ Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# 👉 ສຳລັບ WSL (Linux) / macOS:
source venv/bin/activate

# ອັບເກຣດ pip ແລະ ຕິດຕັ້ງ Library ທັງໝົດ
python -m pip install --upgrade pip
pip install -r requirements.txt
```

> 🛠️ **ໝາຍເຫດສຳລັບຜູ້ໃຊ້ Python 3.13 / 3.14 ເທິງ Windows:**
> ຖ້າພົບບັນຫາ `ModuleNotFoundError: No module named 'distutils.msvccompiler'` ຕອນຕິດຕັ້ງ `pygame`, ໃຫ້ໃຊ້ `pip install pygame-ce` ແທນ (ຫຼື ລັນໂປຣແກຣມໄດ້ເລີຍເພາະ `audio_manager.py` ຮອງຮັບ `winsound` ມາດຕະຖານຂອງ Windows ຢູ່ແລ້ວ).

---

### 2. ຂັ້ນຕອນການລັນລະບົບວິເຄາະໄລຍະຫ່າງ 30 ແມັດ (2-Step Workflow)

#### ຂັ້ນຕອນທີ 1: ກຳນົດເຂດເລນ (`lane_points` & `lane_top_y`) ລົງໄຟລ໌ JSON
ລັນຄຳສັ່ງລຸ່ມນີ້ເພື່ອຄລິກເລືອກເຂດເລນ 4 ຈຸດເທິງວິດີໂອ `videos/dome.mp4` ແລ້ວກົດປຸ່ມ **`s`** ເພື່ອບັນທຶກເປັນໄຟລ໌ `videos/lane_config.json`:

```bash
python chapter-04-audio-threading/python/select_lane_roi.py
```

#### ຂັ້ນຕອນທີ 2: ລັນລະບົບຄຳນວນໄລຍະຫ່າງ 30 ແມັດຕົວຈິງ
ລະບົບຈະໂຫຼດຄ່າເຂດເລນຈາກ `videos/lane_config.json`, ໃຊ້ໂຟລເດີ `utils/` ຕັດສິ່ງລົບກວນ, ປ່ອຍສຽງເຕືອນ **"Beep, beep, beep!"** ເມື່ອລົດໃນເລນເຂົ້າໃກ້ກວ່າ 30m ແລະ ບັນທຶກວິດີໂອຜົນລັບໄວ້ທີ່ `videos/output_dome_30m.mp4`:

```bash
python chapter-04-audio-threading/python/full_system_30m.py
```

---

### 3. ວິທີເປີດເວັບໄຊຄູ່ມືການຮຽນຮູ້ໃນເຄື່ອງ (Local Web Server)
ຢູ່ໂຟລເດີຫຼັກຂອງໂປຣເຈັກ ພິມຄຳສັ່ງ:

```bash
python -m http.server 8080
```
ແລ້ວເປີດເວັບບຣາວເຊີໄປທີ່: **`http://localhost:8080`**

---

## 📄 ລິຂະສິດ (License)
ໂປຣເຈັກນີ້ສ້າງຂຶ້ນເພື່ອການສຶກສາ ແລະ ພັດທະນາລະບົບ Computer Vision (MIT License).
```
