export const COURSE_CHAPTERS = [
  {
    id: 'ch01',
    number: 'Chapter 01',
    title: '1. ທິດສະດີສາມແຈຄ້າຍຄື (Triangle Similarity)',
    description: 'ຮຽນຮູ້ຫຼັກການປ່ຽນຂະໜາດ Pixel ໃນພາບກ້ອງດຽວ ໃຫ້ກາຍເປັນໄລຍະຫ່າງຕົວຈິງ 30 ແມັດ ພ້ອມແຜນວາດເລນກ້ອງ ແລະ ໂຄ້ດ Python ພື້ນຖານ.',
    folderUrl: 'chapter-01-triangle-similarity/index.html',
    tags: ['D = (W × F) / P', 'Optical Ray Diagram', 'Python Math'],
    pythonFiles: [
      'python/triangle_math.py'
    ]
  },
  {
    id: 'ch02',
    number: 'Chapter 02',
    title: '2. ຫ້ອງທົດລອງສູດ & ການປັບຄ່າກ້ອງ (Calibration Lab)',
    description: 'ທົດລອງປັບຄ່າຄວາມກວ້າງລົດແຕ່ລະຊະນິດ (W), ຄ່າໂຟກັສກ້ອງ (F) ແລະ ສ້າງລະຫັດຕັ້ງຄ່າ Python ອັດຕະໂນມັດ.',
    folderUrl: 'chapter-02-interactive-lab/index.html',
    tags: ['Camera Calibration', 'Live Python Generator', 'Vehicle Widths'],
    pythonFiles: [
      'python/calibrate_camera.py',
      'python/distance_calculator.py'
    ]
  },
  {
    id: 'ch03',
    number: 'Chapter 03',
    title: '3. ການກວດຈັບລົດ YOLOv8, ເຂດເລນ JSON & ຕົວຕັດສິ່ງລົບກວນ (utils/)',
    description: 'ວິທີສ້າງໄຟລ໌ lane_config.json (ເຊື່ອງເສັ້ນ lane_top_y) ແລະ ການແຍກໂຟລເດີ utils/ ເພື່ອຕັດກ່ອງຊ້ອນທັບ & ກ່ອງລົບກວນຈາກຫ້ອງໂດຍສານ.',
    folderUrl: 'chapter-03-yolov8-detection/index.html',
    tags: ['lane_config.json', 'Modular utils/', 'Overlap NMS Filter'],
    pythonFiles: [
      'python/yolo_detector.py',
      'python/run_video_test.py'
    ]
  },
  {
    id: 'ch04',
    number: 'Chapter 04',
    title: '4. ສຽງເຕືອນ Beep 3 ຈັງຫວະ, Threading & ແກ້ບັນຫາ Python 3.14',
    description: 'ການສ້າງສຽງ "Beep, beep, beep!" ແບບ Non-blocking Thread, ການລວມໂຟລເດີ utils/ ແລະ ວິທີແກ້ບັນຫາຕິດຕັ້ງ Pygame ໃນ Python 3.14.',
    folderUrl: 'chapter-04-audio-threading/index.html',
    tags: ['Beep, beep, beep!', 'utils/ Package', 'Python 3.14 Fix'],
    pythonFiles: [
      'python/select_lane_roi.py',
      'python/audio_manager.py',
      'python/utils/ (5 files)',
      'python/full_system_30m.py ⭐'
    ]
  }
];