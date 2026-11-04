import cv2
import json
import numpy as np
from pathlib import Path
from ultralytics import YOLO
from audio_manager import NonBlockingAudioAlert

# ດຶງຟັງຊັນຈາກໂຟລເດີ Package utils/ ທີ່ເຮົາແຍກໄວ້
from utils import filter_noise_detections, draw_lane_polygon, draw_vehicle_box

ROOT_DIR = Path(__file__).resolve().parents[2]
VIDEO_PATH = ROOT_DIR / "videos" / "dome.mp4"
OUTPUT_VIDEO_PATH = ROOT_DIR / "videos" / "output_dome_30m.mp4"
MODEL_PATH = ROOT_DIR / "models" / "yolov8n.pt"
SOUND_PATH = ROOT_DIR / "sounds" / "ລະວັງລົດທາງໜ້າ.mp3"
LANE_CONFIG_PATH = ROOT_DIR / "videos" / "lane_config.json"

FOCAL_LENGTH = 500.0
SAFE_DISTANCE = 30.0
ALERT_COOLDOWN = 2.5
YOLO_CONFIDENCE = 0.22
YOLO_IMG_SIZE = 960
HIDE_OUTSIDE_LANE = True

VEHICLE_SPECS = {
    2: ("Car", 1.8),
    5: ("Bus", 2.5),
    7: ("Truck", 2.4)
}

def load_lane_config(width, height):
    if not LANE_CONFIG_PATH.exists():
        top_y = int(height * 0.38)
        pts = [
            [int(width * 0.45), top_y],
            [int(width * 0.58), top_y],
            [int(width * 0.74), int(height * 0.56)],
            [int(width * 0.43), int(height * 0.56)]
        ]
        default_cfg = {
            "video_name": VIDEO_PATH.name,
            "frame_width": width,
            "frame_height": height,
            "lane_top_y": top_y,
            "lane_points": pts
        }
        with open(LANE_CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(default_cfg, f, indent=2)
        return top_y, np.array(pts, np.int32).reshape((-1, 1, 2))

    with open(LANE_CONFIG_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        top_y = int(data["lane_top_y"])
        pts = np.array(data["lane_points"], np.int32).reshape((-1, 1, 2))
        return top_y, pts

def main():
    if not VIDEO_PATH.exists():
        print(f"❌ ບໍ່ພົບໄຟລ໌ວິດີໂອທີ່: {VIDEO_PATH}")
        return

    model = YOLO(str(MODEL_PATH))
    audio_alert = NonBlockingAudioAlert(cooldown_seconds=ALERT_COOLDOWN)

    cap = cv2.VideoCapture(str(VIDEO_PATH))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    lane_top_y, lane_polygon = load_lane_config(width, height)

    poly_x = lane_polygon[:, 0, 0]
    poly_y = lane_polygon[:, 0, 1]
    crop_x1 = max(0, int(np.min(poly_x) - width * 0.05))
    crop_x2 = min(width, int(np.max(poly_x) + width * 0.05))
    crop_y1 = max(0, int(min(lane_top_y, np.min(poly_y)) - height * 0.06))
    crop_y2 = min(height, int(np.max(poly_y) + height * 0.02))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out_writer = cv2.VideoWriter(str(OUTPUT_VIDEO_PATH), fourcc, fps, (width, height))

    print("🚀 ເລີ່ມວິເຄາະວິດີໂອໂດຍໃຊ້ໂຟລເດີ Package utils/ ...")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        windshield_crop = frame[crop_y1:crop_y2, crop_x1:crop_x2]

        # 1. ແຕ້ມເຂດເລນສີຟ້າຜ່ານ utils.visualizer
        draw_lane_polygon(frame, lane_polygon)

        # 2. ກວດຈັບລົດດ້ວຍ YOLOv8
        results = model(
            windshield_crop,
            imgsz=YOLO_IMG_SIZE,
            conf=YOLO_CONFIDENCE,
            iou=0.40,
            agnostic_nms=True,
            classes=[2, 5, 7],
            verbose=False
        )

        # 3. ກັ່ນຕອງສິ່ງລົບກວນຜ່ານ utils.detection_pipeline
        raw_boxes = results[0].boxes if len(results) > 0 else []
        clean_vehicles = filter_noise_detections(
            raw_boxes=raw_boxes,
            crop_offset=(crop_x1, crop_y1),
            frame_shape=frame.shape,
            lane_polygon=lane_polygon,
            lane_top_y=lane_top_y,
            vehicle_specs=VEHICLE_SPECS,
            focal_length=FOCAL_LENGTH,
            hide_outside_lane=HIDE_OUTSIDE_LANE
        )

        danger_detected = False

        # 4. ແຕ້ມກ່ອງລົດທີ່ສະອາດຜ່ານ utils.visualizer
        for veh in clean_vehicles:
            draw_vehicle_box(frame, veh, safe_distance=SAFE_DISTANCE)
            if veh["in_ego_lane"] and veh["distance"] < SAFE_DISTANCE:
                danger_detected = True

        # 5. ເຕືອນສຽງ Beep, beep, beep! ເມື່ອມີລົດໃນເລນໃກ້ກວ່າ 30 ແມັດ
        if danger_detected:
            audio_alert.trigger_alert()
            cv2.putText(frame, "DANGER: VEHICLE < 30M IN LANE!", (25, 45),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.85, (0, 0, 255), 3)

        out_writer.write(frame)

        try:
            cv2.imshow("Real Distance Calculation (30m) - Modular Utils", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        except cv2.error:
            pass

    cap.release()
    out_writer.release()
    cv2.destroyAllWindows()
    print(f"🎉 ຄຳນວນສຳເລັດ! ໄຟລ໌ວິດີໂອຜົນລັບຢູ່ທີ່: {OUTPUT_VIDEO_PATH}")

if __name__ == "__main__":
    main()