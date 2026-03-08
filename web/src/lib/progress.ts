// User progress tracking (localStorage)
export interface ProblemSubmission {
  problemId: string;
  timestamp: number;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
  runtime?: string;
  memory?: number;
}

export interface UserProgress {
  solvedProblems: Set<string>;
  submissions: ProblemSubmission[];
  dailyStreak: number;
  lastSolvedDate: string | null;
}

const STORAGE_KEY = 'code-sandbox-progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return {
      solvedProblems: new Set(),
      submissions: [],
      dailyStreak: 0,
      lastSolvedDate: null,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        solvedProblems: new Set(),
        submissions: [],
        dailyStreak: 0,
        lastSolvedDate: null,
      };
    }

    const data = JSON.parse(stored);
    return {
      ...data,
      solvedProblems: new Set(data.solvedProblems || []),
    };
  } catch (error) {
    console.error('Failed to load progress:', error);
    return {
      solvedProblems: new Set(),
      submissions: [],
      dailyStreak: 0,
      lastSolvedDate: null,
    };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    const data = {
      ...progress,
      solvedProblems: Array.from(progress.solvedProblems),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function recordSubmission(submission: ProblemSubmission): void {
  const progress = getProgress();
  
  // Add to submissions history
  progress.submissions.push(submission);
  
  // If accepted, mark as solved
  if (submission.status === 'Accepted') {
    progress.solvedProblems.add(submission.problemId);
    
    // Update daily streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (progress.lastSolvedDate === yesterday) {
      // Continue streak
      progress.dailyStreak += 1;
    } else if (progress.lastSolvedDate !== today) {
      // New streak or reset
      progress.dailyStreak = 1;
    }
    // If today, don't change streak
    
    progress.lastSolvedDate = today;
  }
  
  // Keep only last 100 submissions
  if (progress.submissions.length > 100) {
    progress.submissions = progress.submissions.slice(-100);
  }
  
  saveProgress(progress);
}

export function getSolvedCount(): number {
  const progress = getProgress();
  return progress.solvedProblems.size;
}

export function getDailyStreak(): number {
  const progress = getProgress();
  
  // Check if streak is still active
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (progress.lastSolvedDate === today || progress.lastSolvedDate === yesterday) {
    return progress.dailyStreak;
  }
  
  return 0; // Streak broken
}

export function isProblemSolved(problemId: string): boolean {
  const progress = getProgress();
  return progress.solvedProblems.has(problemId);
}

export function getRecentSubmissions(limit: number = 10): ProblemSubmission[] {
  const progress = getProgress();
  return progress.submissions.slice(-limit).reverse();
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
