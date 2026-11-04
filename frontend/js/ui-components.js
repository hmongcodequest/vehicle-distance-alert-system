export class UIComponents {
  constructor(safeLimit = 30.0) {
    this.safeLimit = safeLimit;
    this.distanceEl = document.getElementById('distanceValue');
    this.badgeEl = document.getElementById('statusBadge');
    this.videoWrapper = document.getElementById('videoWrapper');
    this.alertMsgEl = document.getElementById('alertMessage');
    this.logBody = document.getElementById('alertLogBody');
    this.lastLoggedTime = 0;
  }

  updateStatus(distance) {
    if (!this.distanceEl) return;

    const isDanger = distance < this.safeLimit;
    this.distanceEl.textContent = `${distance.toFixed(1)} m`;

    if (isDanger) {
      this.distanceEl.style.color = 'var(--destructive)';
      this.badgeEl.textContent = '⚠️ ອັນຕະລາຍ (DANGER < 30m)';
      this.badgeEl.className = 'badge badge-danger';
      this.videoWrapper.classList.add('danger-border');
      this.alertMsgEl.textContent = 'ລະວັງ! ລົດຄັນໜ້າຢູ່ໃກ້ກວ່າ 30 ແມັດ ກະລຸນາຊະລໍຄວາມໄວ';
      this.alertMsgEl.style.color = 'var(--destructive)';
      
      this.addLogEntry(distance);
    } else {
      this.distanceEl.style.color = 'var(--safe)';
      this.badgeEl.textContent = 'ປອດໄພ (SAFE)';
      this.badgeEl.className = 'badge badge-safe';
      this.videoWrapper.classList.remove('danger-border');
      this.alertMsgEl.textContent = 'ໄລຍະຫ່າງຢູ່ໃນເກນປອດໄພ (≥ 30 ແມັດ)';
      this.alertMsgEl.style.color = 'var(--muted-foreground)';
    }
  }

  addLogEntry(distance) {
    const now = Date.now();
    // ບັນທຶກລົງຕາຕະລາງທຸກໆ 3 ວິນາທີ ເພື່ອບໍ່ໃຫ້ຕາຕະລາງເຕັມໄວເກີນໄປ
    if (now - this.lastLoggedTime < 3000) return;
    this.lastLoggedTime = now;

    // ລຶບຂໍ້ຄວາມ "ຍັງບໍ່ມີການແຈ້ງເຕືອນ" ອອກໃນຄັ້ງທຳອິດ
    if (this.logBody.children.length === 1 && this.logBody.children[0].children.length === 1) {
      this.logBody.innerHTML = '';
    }

    const timeStr = new Date().toLocaleTimeString('lo-LA');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${timeStr}</td>
      <td style="font-weight: 600; color: var(--destructive);">${distance.toFixed(1)} m</td>
      <td><span class="badge badge-danger">ໃກ້ເກີນໄປ</span></td>
    `;

    this.logBody.prepend(row);

    // ເກັບໄວ້ສູງສຸດ 6 ລາຍການຫຼ້າສຸດ
    if (this.logBody.children.length > 6) {
      this.logBody.removeChild(this.logBody.lastChild);
    }
  }
}