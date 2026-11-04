# chapter-04-audio-threading/python/utils/visualizer.py
import cv2

def draw_lane_polygon(frame, lane_polygon):
    """ແຕ້ມເຂດເລນສີຟ້າໂປ່ງໃສລົງເທິງພາບວິດີໂອ (ໂດຍເຊື່ອງເສັ້ນ lane_top_y)"""
    overlay = frame.copy()
    cv2.fillPoly(overlay, [lane_polygon], (248, 189, 56))
    cv2.addWeighted(overlay, 0.22, frame, 0.78, 0, frame)
    cv2.polylines(frame, [lane_polygon], isClosed=True, color=(248, 189, 56), thickness=2)


def draw_vehicle_box(frame, vehicle_info, safe_distance=30.0):
    """ແຕ້ມກ່ອງ Bounding Box ແລະ ປ້າຍໄລຍະຫ່າງຂອງລົດແຕ່ລະຄັນ"""
    x1, y1, x2, y2 = vehicle_info["bbox"]
    distance = vehicle_info["distance"]
    in_ego_lane = vehicle_info["in_ego_lane"]
    bottom_center = vehicle_info["bottom_center"]

    if in_ego_lane and distance < safe_distance:
        color = (0, 0, 255)  # ສີແດງ (ອັນຕະລາຍ < 30m)
        status = f"WARNING! {distance:.1f}m"
    elif in_ego_lane:
        color = (0, 255, 0)  # ສີຂຽວ (ປອດໄພ >= 30m)
        status = f"Safe: {distance:.1f}m"
    else:
        color = (150, 150, 150)  # ສີເທົາ (ນອກເລນ)
        status = f"Out: {distance:.1f}m"

    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
    cv2.circle(frame, bottom_center, 4, color, -1)

    # ແຕ້ມປ້າຍຊື່ພ້ອມພື້ນຫຼັງຮອງຮັບ ເພື່ອບໍ່ໃຫ້ຕົວໜັງສືຈາງ ຫຼື ອ່ານຍາກ
    (tw, th), _ = cv2.getTextSize(status, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
    label_y = max(22, y1 - 8)
    cv2.rectangle(frame, (x1, label_y - th - 4), (x1 + tw + 6, label_y + 4), color, -1)
    cv2.putText(frame, status, (x1 + 3, label_y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 0), 2)