# chapter-04-audio-threading/python/utils/bbox_nms.py

def calculate_iou_and_containment(boxA, boxB):
    """
    ຄິດໄລ່ອັດຕາສ່ວນການຊ້ອນທັບກັນ (IoU) ແລະ ອັດຕາສ່ວນກ່ອງນ້ອຍຢູ່ໃນກ່ອງໃຫຍ່ (Containment)
    """
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    inter_width = max(0, xB - xA)
    inter_height = max(0, yB - yA)
    inter_area = inter_width * inter_height

    if inter_area == 0:
        return 0.0, 0.0

    areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    areaB = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    iou = inter_area / float(areaA + areaB - inter_area + 1e-6)
    min_area = min(areaA, areaB)
    containment = inter_area / float(min_area + 1e-6)

    return iou, containment


def remove_overlapping_boxes(detections, iou_threshold=0.35, containment_threshold=0.65):
    """
    ລຶບກ່ອງທີ່ຊ້ອນທັບກັນເທິງລົດຄັນດຽວອອກ ໃຫ້ເຫຼືອພຽງ 1 ກ່ອງທີ່ໝັ້ນໃຈທີ່ສຸດ
    """
    if not detections:
        return []

    detections = sorted(detections, key=lambda d: d["conf"], reverse=True)
    kept = []

    for current in detections:
        is_duplicate = False
        for existing in kept:
            iou, containment = calculate_iou_and_containment(current["bbox"], existing["bbox"])
            if iou > iou_threshold or containment > containment_threshold:
                is_duplicate = True
                break
        if not is_duplicate:
            kept.append(current)

    return kept