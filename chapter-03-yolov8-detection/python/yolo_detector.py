import cv2
from ultralytics import YOLO

class YoloVehicleDistanceDetector:
    """
    ຄລາສກວດຈັບລົດດ້ວຍ YOLOv8 ພ້ອມລະບົບກັ່ນຕອງເລນ (ROI) ແລະ ວັດແທກໄລຍະ 30m (ບົດທີ 3)
    """
    # ລະຫັດ Class ໃນ COCO Dataset: 2 = car, 5 = bus, 7 = truck
    VEHICLE_CLASSES = {2: ("Car", 1.8), 5: ("Bus", 2.5), 7: ("Truck", 2.4)}

    def __init__(self, model_path: str = "yolov8n.pt", focal_length: float = 800.0, safe_distance: float = 30.0):
        self.model = YOLO(model_path)
        self.focal_length = focal_length
        self.safe_distance = safe_distance
        self.roi_width_ratio = 0.45  # ກວດຈັບສະເພາະຊ່ວງກາງຈໍ 45%

    def process_frame(self, frame):
        h, w, _ = frame.shape
        roi_left = int(w * (0.5 - self.roi_width_ratio / 2))
        roi_right = int(w * (0.5 + self.roi_width_ratio / 2))

        # ແຕ້ມເສັ້ນຂອບເຂດເລນທາງໜ້າ (ROI) ລົງໃນພາບ
        cv2.line(frame, (roi_left, int(h * 0.35)), (roi_left, h), (248, 189, 56), 2)
        cv2.line(frame, (roi_right, int(h * 0.35)), (roi_right, h), (248, 189, 56), 2)

        results = self.model(frame, stream=True, verbose=False)
        danger_in_ego_lane = False
        closest_distance = 999.0

        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                if cls_id not in self.VEHICLE_CLASSES:
                    continue

                cls_name, known_width = self.VEHICLE_CLASSES[cls_id]
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                pixel_width = x2 - x1
                center_x = (x1 + x2) // 2

                if pixel_width <= 0:
                    continue

                # ຄິດໄລ່ໄລຍະຫ່າງຕາມຄວາມກວ້າງຕົວຈິງຂອງລົດແຕ່ລະຊະນິດ
                distance = (known_width * self.focal_length) / pixel_width
                in_ego_lane = roi_left <= center_x <= roi_right

                if in_ego_lane:
                    closest_distance = min(closest_distance, distance)
                    if distance < self.safe_distance:
                        danger_in_ego_lane = True
                        color = (0, 0, 255)  # ສີແດງ (ອັນຕະລາຍ < 30m)
                        label = f"WARNING! {cls_name} {distance:.1f}m"
                    else:
                        color = (0, 255, 0)  # ສີຂຽວ (ປອດໄພ >= 30m)
                        label = f"Safe: {cls_name} {distance:.1f}m"
                else:
                    # ລົດຢູ່ເລນອື່ນ (ສະແດງເປັນສີເທົາ ບໍ່ແຈ້ງເຕືອນ)
                    color = (140, 140, 140)
                    label = f"Other Lane: {distance:.1f}m"

                # ແຕ້ມກ່ອງ Bounding Box ແລະ ຈຸດກາງລົດ
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.circle(frame, (center_x, (y1 + y2) // 2), 4, color, -1)
                cv2.putText(frame, label, (x1, max(20, y1 - 8)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

        return frame, danger_in_ego_lane, closest_distance