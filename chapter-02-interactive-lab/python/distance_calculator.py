from dataclasses import dataclass

@dataclass
class DistanceStatus:
    distance: float
    pixel_width: int
    is_danger: bool
    message: str

class VehicleDistanceCalculator:
    """
    ຄລາສຄິດໄລ່ໄລຍະຫ່າງລະຫວ່າງລົດເຮົາ ແລະ ລົດຄັນທາງໜ້າ (ບົດທີ 2)
    """
    def __init__(self, known_width: float = 1.8, focal_length: float = 800.0, safe_distance: float = 30.0):
        self.known_width = known_width
        self.focal_length = focal_length
        self.safe_distance = safe_distance

    def estimate_distance(self, pixel_width: int) -> DistanceStatus:
        if pixel_width <= 0:
            return DistanceStatus(999.0, 0, False, "ບໍ່ພົບລົດທາງໜ້າ")

        # ສູດສາມແຈຄ້າຍຄື: D = (W * F) / P
        distance = (self.known_width * self.focal_length) / pixel_width
        is_danger = distance < self.safe_distance

        if is_danger:
            msg = f"⚠️ WARNING! ລົດຢູ່ໃກ້ເກີນໄປ: {distance:.1f}m (ເກນປອດໄພ: {self.safe_distance}m)"
        else:
            msg = f"✅ SAFE: ໄລຍະຫ່າງປອດໄພ {distance:.1f}m"

        return DistanceStatus(
            distance=round(distance, 2),
            pixel_width=pixel_width,
            is_danger=is_danger,
            message=msg
        )

if __name__ == "__main__":
    print("=== ທົດສອບລະບົບຄິດໄລ່ໄລຍະຫ່າງ 30 ແມັດ (Chapter 02) ===")
    calc = VehicleDistanceCalculator(known_width=1.8, focal_length=800.0, safe_distance=30.0)

    # ທົດສອບຄ່າ Pixel ຕ່າງໆ (ເຊັ່ນ: 30px, 48px, 65px, 90px)
    test_pixels = [32, 48, 65, 95]
    for px in test_pixels:
        result = calc.estimate_distance(px)
        print(f"[Pixel = {px:2d}px] -> {result.message}")