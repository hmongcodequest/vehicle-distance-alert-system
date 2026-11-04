const STORAGE_KEY = 'vehicle_30m_course_progress';

export class ProgressTracker {
  constructor(totalChapters = 4) {
    this.totalChapters = totalChapters;
    this.completedIds = this.loadProgress();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.completedIds));
  }

  toggleChapter(chapterId) {
    if (this.completedIds.includes(chapterId)) {
      this.completedIds = this.completedIds.filter(id => id !== chapterId);
    } else {
      this.completedIds.push(chapterId);
    }
    this.saveProgress();
  }

  isCompleted(chapterId) {
    return this.completedIds.includes(chapterId);
  }

  resetAll() {
    this.completedIds = [];
    this.saveProgress();
  }

  getStats() {
    const count = this.completedIds.length;
    const percent = Math.round((count / this.totalChapters) * 100);
    return { count, total: this.totalChapters, percent };
  }
}