import cv2
from pathlib import Path
from yolo_detector import YoloVehicleDistanceDetector

# ຊອກຫາ Path ຂອງໂຟລເດີຫຼັກ (vehicle-distance-alert-system) ໂດຍອັດຕະໂນມັດ
ROOT_DIR = Path(__file__).resolve().parents[2]
VIDEO_PATH = ROOT_DIR / "videos" / "dome.mp4"
MODEL_PATH = ROOT_DIR / "models" / "yolov8n.pt"

def main():
    if not VIDEO_PATH.exists():
        print(f"❌ ບໍ່ພົບໄຟລ໌ວິດີໂອທີ່: {VIDEO_PATH}")
        return

    # ຖ້າໃນໂຟລເດີ models/ ຍັງບໍ່ມີ yolov8n.pt ມັນຈະດາວໂຫຼດໃສ່ໂຟລເດີ models/ ໃຫ້ເອງ
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(str(VIDEO_PATH))
    detector = YoloVehicleDistanceDetector(
        model_path=str(MODEL_PATH),
        focal_length=800.0,
        safe_distance=30.0
    )

    print(f"🎬 ກຳລັງຫຼິ້ນວິດີໂອແທ້ຈາກ: {VIDEO_PATH}")
    print("🚀 ກົດປຸ່ມ 'q' ເທິງໜ້າຈໍວິດີໂອເພື່ອອອກ...")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            # ຖ້າວິດີໂອຫຼິ້ນຈົນຈົບ ໃຫ້ວົນກັບໄປເລີ່ມເຟຣມທີ 0 ໃໝ່ (Loop Video)
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        processed_frame, is_danger, min_dist = detector.process_frame(frame)

        status_text = f"Ego Lane Min Distance: {min_dist:.1f}m" if min_dist < 900 else "Ego Lane: Clear"
        status_color = (0, 0, 255) if is_danger else (0, 255, 0)
        cv2.putText(processed_frame, status_text, (20, 35),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

        cv2.imshow("Chapter 03 - Real Video Test (dome.mp4)", processed_frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()