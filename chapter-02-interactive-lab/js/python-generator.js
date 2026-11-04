export class PythonCodeGenerator {
  generateSnippet(state) {
    return `# ==========================================
# ໄຟລ໌ຕັ້ງຄ່າໄລຍະຫ່າງ 30m (ສ້າງຈາກ Lab ບົດທີ 2)
# ==========================================

KNOWN_WIDTH = ${state.W.toFixed(1)}    # ຄວາມກວ້າງຕົວຈິງຂອງລົດ (ແມັດ)
FOCAL_LENGTH = ${state.F}   # ຄ່າໂຟກັສຂອງກ້ອງ (Pixels)
SAFE_DISTANCE = 30.0 # ເກນແຈ້ງເຕືອນຄວາມປອດໄພ (ແມັດ)

def calculate_distance(pixel_width: float) -> float:
    """ຄິດໄລ່ໄລຍະຫ່າງຈາກຄວາມກວ້າງ Pixel ຂອງກ່ອງ YOLOv8"""
    if pixel_width <= 0:
        return 999.0
    return (KNOWN_WIDTH * FOCAL_LENGTH) / pixel_width

# --- ທົດສອບດ້ວຍຄ່າປັດຈຸບັນທີ່ເຈົ້າເລືອກ (${state.P} px) ---
current_pixel = ${state.P}
dist = calculate_distance(current_pixel)

print(f"ໄລຍະຫ່າງປັດຈຸບັນ: {dist:.1f} ແມັດ")
if dist < SAFE_DISTANCE:
    print("⚠️ WARNING: ລົດຄັນໜ້າຢູ່ໃກ້ກວ່າ 30 ແມັດ!")
else:
    print("✅ SAFE: ໄລຍະຫ່າງປອດໄພ")`;
  }
}