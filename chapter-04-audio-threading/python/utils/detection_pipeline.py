# chapter-04-audio-threading/python/utils/detection_pipeline.py
from .bbox_nms import remove_overlapping_boxes
from .geometry_filter import is_valid_vehicle_shape, is_vehicle_in_ego_lane

def filter_noise_detections(raw_boxes, crop_offset, frame_shape, lane_polygon, lane_top_y,
                            vehicle_specs, focal_length, hide_outside_lane=True):
    """
    Pipeline ຫຼັກສຳລັບກັ່ນຕອງກ່ອງລົດຈາກ YOLOv8 ແລະ ຄິດໄລ່ໄລຍະຫ່າງ 30 ແມັດ
    """
    h, w = frame_shape[:2]
    crop_x1, crop_y1 = crop_offset
    valid_candidates = []

    for box in raw_boxes:
        cls_id = int(box.cls[0])
        if cls_id not in vehicle_specs:
            continue

        conf = float(box.conf[0])
        cls_name, known_width = vehicle_specs[cls_id]
        bx1, by1, bx2, by2 = map(int, box.xyxy[0])

        # ແປງພິກັດຈາກພາບ Crop ກັບມາເປັນພິກັດເທິງຈໍຫຼັກ
        bbox = (bx1 + crop_x1, by1 + crop_y1, bx2 + crop_x1, by2 + crop_y1)
        bw = bbox[2] - bbox[0]

        # 1. ກວດສອບຮູບຊົງກ່ອງ (ຕັດກ່ອງລົບກວນຈາກຫ້ອງໂດຍສານລົດຕົວເອງ)
        if not is_valid_vehicle_shape(bbox, w, h):
            continue

        # 2. ກວດສອບວ່າຢູ່ໃນເຂດເລນສີຟ້າບໍ່
        in_ego_lane, bottom_center = is_vehicle_in_ego_lane(bbox, lane_polygon, lane_top_y)

        if hide_outside_lane and not in_ego_lane:
            continue

        # 3. ຄິດໄລ່ໄລຍະຫ່າງ D = (W * F) / P
        distance = (known_width * focal_length) / bw
        if distance < 3.0:
            continue

        valid_candidates.append({
            "bbox": bbox,
            "conf": conf,
            "cls_name": cls_name,
            "distance": distance,
            "in_ego_lane": in_ego_lane,
            "bottom_center": bottom_center
        })

    # 4. ລຶບກ່ອງທີ່ຊ້ອນທັບກັນເທິງລົດຄັນດຽວອອກ
    clean_detections = remove_overlapping_boxes(valid_candidates)
    clean_detections.sort(key=lambda d: d["distance"])
    return clean_detections