import { COURSE_CHAPTERS } from './course-data.js';
import { ProgressTracker } from './progress-tracker.js';

document.addEventListener('DOMContentLoaded', () => {
  const tracker = new ProgressTracker(COURSE_CHAPTERS.length);
  const chaptersGrid = document.getElementById('chaptersGrid');
  const progressPercentText = document.getElementById('progressPercentText');
  const progressBarFill = document.getElementById('progressBarFill');
  const resetProgressBtn = document.getElementById('resetProgressBtn');
  const copyAllCliBtn = document.getElementById('copyAllCliBtn');
  const cliCommandsText = document.getElementById('cliCommandsText');

  function renderPortal() {
    // 1. ອັບເດດແຖບ Progress Bar
    const stats = tracker.getStats();
    progressPercentText.textContent = `${stats.percent}% (${stats.count}/${stats.total} ບົດ)`;
    progressBarFill.style.width = `${stats.percent}%`;

    // 2. ສ້າງກາດບົດຮຽນທັງ 4 ບົດ
    chaptersGrid.innerHTML = '';
    COURSE_CHAPTERS.forEach((ch) => {
      const done = tracker.isCompleted(ch.id);
      const card = document.createElement('div');
      card.className = `card chapter-card ${done ? 'completed-card' : ''}`;

      const tagsHtml = ch.tags.map(t => `<span class="topic-tag">${t}</span>`).join('');
      const pyFilesHtml = ch.pythonFiles.map(f => `<div>🐍 <code>${f}</code></div>`).join('');

      card.innerHTML = `
        <div>
          <div class="chapter-top">
            <span class="badge badge-outline">${ch.number}</span>
            ${done ? '<span class="badge badge-safe">✅ ຮຽນຈົບແລ້ວ</span>' : ''}
          </div>
          <h3 class="chapter-title">${ch.title}</h3>
          <p class="card-description">${ch.description}</p>
          <div class="topic-tags">${tagsHtml}</div>
          <div class="python-files-box">
            <div class="text-xs text-muted" style="margin-bottom: 0.25rem;">ໄຟລ໌ Python ປະຈຳບົດ:</div>
            ${pyFilesHtml}
          </div>
        </div>

        <div class="chapter-actions">
          <label class="check-label">
            <input type="checkbox" data-id="${ch.id}" ${done ? 'checked' : ''}>
            <span>ໝາຍວ່າຮຽນຈົບບົດນີ້ແລ້ວ</span>
          </label>
          <a href="${ch.folderUrl}" class="btn btn-primary">ເປີດບົດຮຽນ Interactive →</a>
        </div>
      `;

      chaptersGrid.appendChild(card);
    });

    // ຜູກ Event ໃສ່ Checkbox ແຕ່ລະບົດ
    chaptersGrid.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener('change', (e) => {
        const chId = e.target.getAttribute('data-id');
        tracker.toggleChapter(chId);
        renderPortal();
      });
    });
  }

  // ປຸ່ມລ້າງຄວາມຄືບໜ້າ
  resetProgressBtn?.addEventListener('click', () => {
    tracker.resetAll();
    renderPortal();
  });

  // ປຸ່ມກ໊ອບປີ້ຄຳສັ່ງ CLI
  copyAllCliBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(cliCommandsText.textContent);
    copyAllCliBtn.textContent = '✅ ກ໊ອບປີ້ແລ້ວ!';
    setTimeout(() => { copyAllCliBtn.textContent = '📋 ກ໊ອບປີ້ຄຳສັ່ງທັງໝົດ'; }, 2000);
  });

  renderPortal();
});