import cv2
import json
import numpy as np
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
VIDEO_PATH = ROOT_DIR / "videos" / "dome.mp4"
LANE_CONFIG_PATH = ROOT_DIR / "videos" / "lane_config.json"

clicked_points = []
lane_top_y = None

def mouse_handler(event, x, y, flags, param):
    global clicked_points, lane_top_y
    if event == cv2.EVENT_LBUTTONDOWN:
        if len(clicked_points) < 4:
            # ຖ້າເປັນຈຸດທີ 1 ແລະ 2 (ຂອບເທິງຂອງເລນ) ໃຫ້ລ໋ອກຄ່າ lane_top_y ໃຫ້ຊື່ເທົ່າກັນໂດຍອັດຕະໂນມັດ
            if len(clicked_points) == 0:
                lane_top_y = y
                clicked_points.append([x, lane_top_y])
                print(f"✅ ກຳນົດເຂດເລນ Top (lane_top_y) = {lane_top_y} | ຈຸດທີ 1 (ເທິງຊ້າຍ): {[x, lane_top_y]}")
            elif len(clicked_points) == 1:
                clicked_points.append([x, lane_top_y])
                print(f"✅ ຈຸດທີ 2 (ເທິງຂວາ - ລ໋ອກຕາມ lane_top_y): {[x, lane_top_y]}")
            else:
                clicked_points.append([x, y])
                print(f"✅ ຈຸດທີ {len(clicked_points)} (ຂອບລຸ່ມ): {[x, y]}")
    elif event == cv2.EVENT_RBUTTONDOWN:
        clicked_points = []
        lane_top_y = None
        print("🔄 ລ້າງຈຸດທັງໝົດແລ້ວ! ກະລຸນາຄລິກເລືອກໃໝ່.")

def save_json_config(width, height, top_y, points):
    config_data = {
        "video_name": VIDEO_PATH.name,
        "frame_width": width,
        "frame_height": height,
        "lane_top_y": int(top_y),
        "lane_points": [[int(pt[0]), int(pt[1])] for pt in points]
    }
    LANE_CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(LANE_CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config_data, f, indent=2)
    print("\n=======================================================")
    print(f"💾 ບັນທຶກໄຟລ໌ JSON ສຳເລັດແລ້ວທີ່: {LANE_CONFIG_PATH}")
    print(json.dumps(config_data, indent=2))
    print("=======================================================")

def main():
    global clicked_points, lane_top_y
    if not VIDEO_PATH.exists():
        print(f"❌ ບໍ່ພົບໄຟລ໌ວິດີໂອທີ່: {VIDEO_PATH}")
        return

    cap = cv2.VideoCapture(str(VIDEO_PATH))
    ret, first_frame = cap.read()
    cap.release()

    if not ret:
        print("❌ ບໍ່ສາມາດອ່ານເຟຣມຈາກວິດີໂອໄດ້!")
        return

    h, w, _ = first_frame.shape

    # ຄ່າເລີ່ມຕົ້ນມາດຕະຖານ (เผื่อກໍລະນີກົດ Save ເລີຍ ຫຼື ບໍ່ມີ GUI)
    default_top_y = int(h * 0.45)
    default_points = [
        [int(w * 0.38), default_top_y],
        [int(w * 0.62), default_top_y],
        [int(w * 0.85), int(h * 0.94)],
        [int(w * 0.15), int(h * 0.94)]
    ]

    window_name = "Step 1: Select Lane Top & Lane Points -> Press 'S' to Save JSON"
    try:
        cv2.namedWindow(window_name)
        cv2.setMouseCallback(window_name, mouse_handler)
    except cv2.error:
        print("⚠️ WSL ບໍ່ມີໜ້າຕ່າງ GUI, ລະບົບຈະສ້າງໄຟລ໌ lane_config.json ມາດຕະຖານໃຫ້ເລີຍ...")
        save_json_config(w, h, default_top_y, default_points)
        return

    print("===================================================================")
    print("📐 ຂັ້ນຕອນທີ 1: ເຄື່ອງມືສ້າງໄຟລ໌ videos/lane_config.json")
    print("   1. ຄລິກຈຸດທີ 1 (ເທິງຊ້າຍ): ກຳນົດເສັ້ນຂອບເທິງສຸດຂອງເລນ (lane_top_y)")
    print("   2. ຄລິກຈຸດທີ 2 (ເທິງຂວາ): ກຳນົດຄວາມກວ້າງເລນດ້ານເທິງ")
    print("   3. ຄລິກຈຸດທີ 3 (ລຸ່ມຂວາ) ແລະ ຈຸດທີ 4 (ລຸ່ມຊ້າຍ)")
    print("   4. ກົດປຸ່ມ 's' ເພື່ອບັນທຶກເປັນໄຟລ໌ JSON | ກົດ 'r' ເພື່ອເລືອກໃໝ່ | ກົດ 'q' ເພື່ອອອກ")
    print("===================================================================")

    while True:
        display = first_frame.copy()

        # ແຕ້ມເສັ້ນ lane_top_y (ເຂດເລນ Top)
        active_top_y = lane_top_y if lane_top_y is not None else default_top_y
        cv2.line(display, (0, active_top_y), (w, active_top_y), (0, 255, 255), 2)
        cv2.putText(display, f"lane_top_y = {active_top_y}px", (20, max(25, active_top_y - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 255), 2)

        # ແຕ້ມຈຸດ ແລະ ກອບເຂດເລນ (lane_points)
        pts_to_draw = clicked_points if len(clicked_points) > 0 else default_points
        for idx, pt in enumerate(pts_to_draw):
            cv2.circle(display, tuple(pt), 7, (0, 165, 255), -1)
            cv2.putText(display, f"P{idx+1}{tuple(pt)}", (pt[0] + 10, pt[1] - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)

        if len(pts_to_draw) == 4:
            overlay = display.copy()
            pts_np = np.array(pts_to_draw, np.int32).reshape((-1, 1, 2))
            cv2.fillPoly(overlay, [pts_np], (248, 189, 56))
            cv2.addWeighted(overlay, 0.25, display, 0.75, 0, display)
            cv2.polylines(display, [pts_np], isClosed=True, color=(248, 189, 56), thickness=2)

        cv2.putText(display, "Click 4 points | Press 'S' = Save JSON | 'R' = Reset | 'Q' = Quit",
                    (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        cv2.imshow(window_name, display)
        key = cv2.waitKey(20) & 0xFF

        if key == ord('s'):
            final_pts = clicked_points if len(clicked_points) == 4 else default_points
            final_top = lane_top_y if lane_top_y is not None else default_top_y
            save_json_config(w, h, final_top, final_pts)
            break
        elif key == ord('r'):
            clicked_points = []
            lane_top_y = None
        elif key == ord('q'):
            break

    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()