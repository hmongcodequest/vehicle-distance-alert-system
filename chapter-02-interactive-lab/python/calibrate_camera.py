def calculate_focal_length(measured_pixel_width: float, known_distance_m: float = 30.0, known_width_m: float = 1.8) -> float:
    """
    ຟັງຊັນຊ່ວຍຫາຄ່າ FOCAL_LENGTH ຂອງກ້ອງໜ້າລົດ
    ສູດ: F = (P * D) / W
    """
    return (measured_pixel_width * known_distance_m) / known_width_m


if __name__ == "__main__":
    print("=====================================================")
    print("📷 ເຄື່ອງມືຄິດໄລ່ຫາຄ່າ FOCAL_LENGTH ຂອງກ້ອງ (Calibration)")
    print("=====================================================")
    
    try:
        dist_input = input("1. ป้อนໄລຍະຫ່າງຕົວຈິງທີ່ຈອດລົດທົດສອບ (ຄ່າເລີ່ມຕົ້ນ 30 ແມັດ): ").strip()
        known_distance = float(dist_input) if dist_input else 30.0

        width_input = input("2. ປ້ອນຄວາມກວ້າງຕົວຈິງຂອງລົດ (ຄ່າເລີ່ມຕົ້ນ 1.8 ແມັດ): ").strip()
        known_width = float(width_input) if width_input else 1.8

        pixel_input = input("3. ປ້ອນຄວາມກວ້າງ Pixel ຂອງກ່ອງລົດທີ່ວັດແທກໄດ້ໃນພາບ (ເຊັ່ນ 48): ").strip()
        pixel_width = float(pixel_input) if pixel_input else 48.0

        focal_length = calculate_focal_length(pixel_width, known_distance, known_width)

        print("\n-----------------------------------------------------")
        print(f"✅ ຄ່າ FOCAL_LENGTH ຂອງກ້ອງເຈົ້າແມ່ນ: {focal_length:.1f}")
        print(f"👉 ໃຫ້ເອົາຄ່າ FOCAL_LENGTH = {int(round(focal_length))} ໄປໃສ່ໃນໄຟລ໌ config.py ຫຼື main.py")
        print("-----------------------------------------------------")

    except ValueError:
        print("❌ ກະລຸນາປ້ອນຕົວເລກທີ່ຖືກຕ້ອງ!")