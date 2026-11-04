# =====================================================================
# ບົດທີ 1: ທິດສະດີສາມແຈຄ້າຍຄື (Triangle Similarity Math in Python)
# =====================================================================

KNOWN_WIDTH_M = 1.8     # W: ຄວາມກວ້າງຕົວຈິງໂດຍສະເລ່ຍຂອງລົດເກັງ (ແມັດ)
FOCAL_LENGTH_PX = 800.0 # F: ຄ່າຄວາມຍາວໂຟກັສຂອງກ້ອງ (Pixels)
SAFE_LIMIT_M = 30.0     # ເກນໄລຍະຫ່າງປອດໄພ (30 ແມັດ)


def find_focal_length(measured_pixel_width: float, calibration_distance_m: float, real_width_m: float) -> float:
    """
    1. ສູດຫາຄ່າ Focal Length (F) ຕອນຕັ້ງຄ່າກ້ອງຄັ້ງທຳອິດ:
       F = (P * D) / W
    """
    return (measured_pixel_width * calibration_distance_m) / real_width_m


def find_distance_meters(pixel_width: float, focal_length: float = FOCAL_LENGTH_PX, real_width_m: float = KNOWN_WIDTH_M) -> float:
    """
    2. ສູດຄິດໄລ່ຫາໄລຍະຫ່າງຕົວຈິງ (D) ຈາກຂະໜາດກ່ອງ Pixel ໃນພາບ:
       D = (W * F) / P
    """
    if pixel_width <= 0:
        return 999.0
    return (real_width_m * focal_length) / pixel_width


if __name__ == "__main__":
    print("📐 ບົດທີ 1: ທົດສອບສູດຄະນິດສາດສາມແຈຄ້າຍຄື (Triangle Similarity)")
    print("-" * 60)

    # ຂັ້ນຕອນທີ 1: ທົດສອບຫາຄ່າ F ເມື່ອຈອດລົດຫ່າງ 30 ແມັດ ແລ້ວວັດແທກກ່ອງລົດໄດ້ 48 Pixels
    f_val = find_focal_length(measured_pixel_width=48.0, calibration_distance_m=30.0, real_width_m=1.8)
    print(f"1. ຄ່າ Focal Length (F) ທີ່ຄິດໄລ່ໄດ້: {f_val:.1f} px\n")

    # ຂັ້ນຕອນທີ 2: ທົດສອບຄິດໄລ່ໄລຍະຫ່າງເມື່ອລົດຢູ່ໄລຍະຕ່າງໆ
    sample_pixels = [96.0, 60.0, 48.0, 36.0, 28.8]
    print("2. ຕາຕະລາງປຽບທຽບຂະໜາດ Pixel (P) ກັບ ໄລຍະຫ່າງຕົວຈິງ (D):")
    for p in sample_pixels:
        dist = find_distance_meters(pixel_width=p, focal_length=f_val, real_width_m=1.8)
        status = "⚠️ DANGER (< 30m)" if dist < SAFE_LIMIT_M else "✅ SAFE (>= 30m)"
        print(f"   • ກ່ອງລົດກວ້າງ P = {p:5.1f} px  -->  ໄລຍະຫ່າງ D = {dist:4.1f} ແມັດ  [{status}]")