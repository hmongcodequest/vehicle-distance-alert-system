# chapter-04-audio-threading/python/utils/geometry_filter.py
import cv2

def is_valid_vehicle_shape(bbox, frame_width, frame_height):
    """
    ກວດສອບວ່າຂະໜາດ ແລະ ຮູບຊົງຂອງກ່ອງເປັນລົດແທ້ ຫຼື ເປັນສິ່ງລົບກວນຈາກຫ້ອງໂດຍສານລົດຕົວເອງ
    """
    x1, y1, x2, y2 = bbox
    bw = x2 - x1
    bh = y2 - y1

    # 1. ຕັດກ່ອງທີ່ນ້ອຍເກີນໄປ
    if bw < 10 or bh < 8:
        return False

    # 2. ຕັດກ່ອງຍັກທີ່ກວມເອົາເສົາລົດ ຫຼື ແວ່ນໜ້າລົດຕົວເອງ (ເຊັ່ນ Out: 1.2m)
    if bw > int(frame_width * 0.22) or bh > int(frame_height * 0.28):
        return False

    # 3. ກວດສອບອັດຕາສ່ວນ ກວ້າງ/ສູງ (Aspect Ratio) ຂອງລົດປົກກະຕິ
    aspect_ratio = bw / float(bh)
    if aspect_ratio < 0.55 or aspect_ratio > 2.2:
        return False

    return True


def is_vehicle_in_ego_lane(bbox, lane_polygon, lane_top_y):
    """
    ກວດສອບວ່າລົດຢູ່ໃນເຂດເລນສີຟ້າ (Polygon ROI) ແລະ ຢູ່ຕ່ຳກວ່າເສັ້ນຂອບເທິງ (lane_top_y) ບໍ່
    """
    x1, y1, x2, y2 = bbox
    bottom_center = (int((x1 + x2) / 2), int(y2))
    box_center = (int((x1 + x2) / 2), int((y1 + y2) / 2))

    in_lane = (
        bottom_center[1] >= (lane_top_y - 10) and
        (cv2.pointPolygonTest(lane_polygon, bottom_center, True) >= -4.0 or
         cv2.pointPolygonTest(lane_polygon, box_center, False) >= 0)
    )
    return in_lane, bottom_center