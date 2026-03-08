'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { toast } from 'sonner';

interface IeltsScore {
  overall: number;
  taskResponse?: number;
  coherenceCohesion?: number;
  lexicalResource?: number;
  grammaticalRange?: number;
  fluency?: number;
  vocabulary?: number;
  coherence?: number;
  pronunciation?: number;
}

interface Assessment {
  scores: IeltsScore;
  transcription?: string;
  wordCount: number;
  speakingTime?: number;
  pauseCount?: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  estimatedBand?: string;
}

const TASK_TYPES = [
  { value: 'task1', label: 'Task 1 (Academic)', desc: 'Describe visual data' },
  { value: 'task1-general', label: 'Task 1 (General)', desc: 'Write a letter' },
  { value: 'task2', label: 'Task 2', desc: 'Essay (both Academic & General)' },
];

interface SpeakingQuestion {
  part: string;
  topic: string;
  prompts: string[];
  time: number;
}

const DEFAULT_QUESTION: SpeakingQuestion = {
  part: 'Part 2',
  topic: 'Describe a person who has had an important influence on your life',
  prompts: ['Who this person is', 'How you met them', 'What influence they had', 'Why they are important to you'],
  time: 120,
};

export function IeltsExaminer() {
  const [activeModule, setActiveModule] = useState<'writing' | 'speaking'>('writing');
  
  // Writing state
  const [taskType, setTaskType] = useState<'task1' | 'task1-general' | 'task2'>('task2');
  const [prompt, setPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [writingAssessment, setWritingAssessment] = useState<Assessment | null>(null);
  const [isAnalyzingWriting, setIsAnalyzingWriting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Writing prompt state
  const [isLoadingWritingPrompt, setIsLoadingWritingPrompt] = useState(false);

  // Speaking state
  const [speakingQuestion, setSpeakingQuestion] = useState<SpeakingQuestion>(DEFAULT_QUESTION);
  const [speakingText, setSpeakingText] = useState(
    `${DEFAULT_QUESTION.topic}\n\n${DEFAULT_QUESTION.prompts.map(p => `• ${p}`).join('\n')}`
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [speakingAssessment, setSpeakingAssessment] = useState<Assessment | null>(null);
  const [isAnalyzingSpeaking, setIsAnalyzingSpeaking] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const wordCount = essay.trim().split(/\s+/).filter(w => w).length;
  const recommendedMin = taskType === 'task2' ? 250 : 150;

  // LocalStorage keys
  const STORAGE_KEYS = {
    writing: 'ielts-writing-draft',
    writingPrompt: 'ielts-writing-prompt',
    writingTaskType: 'ielts-writing-tasktype',
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedEssay = localStorage.getItem(STORAGE_KEYS.writing);
    const savedPrompt = localStorage.getItem(STORAGE_KEYS.writingPrompt);
    const savedTaskType = localStorage.getItem(STORAGE_KEYS.writingTaskType);
    
    if (savedEssay) setEssay(savedEssay);
    if (savedPrompt) setPrompt(savedPrompt);
    if (savedTaskType) setTaskType(savedTaskType as any);
  }, []);

  // Auto-save draft (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timeoutId = setTimeout(() => {
      if (essay.trim()) {
        localStorage.setItem(STORAGE_KEYS.writing, essay);
      }
      if (prompt.trim()) {
        localStorage.setItem(STORAGE_KEYS.writingPrompt, prompt);
      }
      localStorage.setItem(STORAGE_KEYS.writingTaskType, taskType);
      setDraftSaved(true);
      
      // Hide indicator after 2 seconds
      setTimeout(() => setDraftSaved(false), 2000);
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [essay, prompt, taskType]);

  // Clear draft after successful submission
  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.writing);
    localStorage.removeItem(STORAGE_KEYS.writingPrompt);
    localStorage.removeItem(STORAGE_KEYS.writingTaskType);
  }, []);

  // Manual clear draft function
  const handleClearDraft = useCallback(() => {
    if (confirm('Clear your draft? This cannot be undone.')) {
      setEssay('');
      setPrompt('');
      setTaskType('task2');
      setWritingAssessment(null);
      clearDraft();
    }
  }, [clearDraft]);

  // Fetch writing prompt
  const fetchWritingPrompt = async (type?: string) => {
    setIsLoadingWritingPrompt(true);
    try {
      const t = type || taskType;
      const res = await fetch(`/api/ielts-writing-question?type=${t}`);
      if (res.ok) {
        const q = await res.json();
        setPrompt(q.prompt || '');
      }
    } catch { /* keep current */ }
    setIsLoadingWritingPrompt(false);
  };

  // Fetch speaking question on mount
  const fetchSpeakingQuestion = async () => {
    setIsLoadingQuestion(true);
    try {
      const res = await fetch('/api/ielts-question');
      if (res.ok) {
        const q = await res.json();
        setSpeakingQuestion(q);
        setSpeakingText(`${q.topic}\n\n${(q.prompts as string[]).map(p => `• ${p}`).join('\n')}`);
        setCustomQuestion('');
      }
    } catch { /* use default */ }
    setIsLoadingQuestion(false);
  };

  useEffect(() => { fetchSpeakingQuestion(); }, []);

  // Fetch writing prompt on mount (only if no saved draft)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedPrompt = localStorage.getItem('ielts-writing-prompt');
    if (!savedPrompt) fetchWritingPrompt();
  }, []);

  // Writing functions
  const analyzeEssay = async () => {
    if (!prompt.trim()) {
      setError('Please paste the IELTS task prompt.');
      toast.error('Please paste the IELTS task prompt');
      return;
    }
    if (wordCount < 50) {
      setError('Please write at least 50 words for meaningful analysis.');
      toast.error('Essay too short - minimum 50 words required');
      return;
    }

    setIsAnalyzingWriting(true);
    setError(null);
    
    // Progressive loading messages
    const messages = [
      'Waking up AI models...',
      'Loading language model...',
      'Preparing evaluation engine...',
      'Almost ready...'
    ];
    let msgIndex = 0;
    setLoadingMessage(messages[0]);
    
    const messageInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 5000);

    try {
      const response = await fetch('/api/ielts-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_type: taskType,
          prompt,
          essay,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setWritingAssessment(data.assessment);
      // Clear draft after successful submission
      clearDraft();
      clearInterval(messageInterval);
      toast.success('Assessment complete');
    } catch (err: any) {
      console.error('Analysis error:', err);
      clearInterval(messageInterval);
      setError(
        'AI examiner is currently unavailable. The model may be loading (1-2 min first time) or sleeping. Please try again.'
      );
      toast.error('AI examiner unavailable');
    } finally {
      setIsAnalyzingWriting(false);
      setLoadingMessage('');
    }
  };

  // Speaking functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);
      setSpeakingAssessment(null);
      setError(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Recording error:', err);
      setError('Could not access microphone. Please grant permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const analyzeSpeaking = async () => {
    if (!audioBlob) {
      setError('No recording available');
      return;
    }

    setIsAnalyzingSpeaking(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('question', speakingText.trim() || speakingQuestion.topic);
      formData.append('part', speakingQuestion.part);

      const response = await fetch('/api/ielts-speaking', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setSpeakingAssessment(data.assessment);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        'AI examiner is currently unavailable. Whisper model may be loading (1-2 min first time). Please try again.'
      );
    } finally {
      setIsAnalyzingSpeaking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderAssessmentResults = (assessment: Assessment, type: 'writing' | 'speaking') => {
    const isWriting = type === 'writing';
    const scores = isWriting
      ? [
          { label: 'Task Response', score: assessment.scores.taskResponse! },
          { label: 'Coherence & Cohesion', score: assessment.scores.coherenceCohesion! },
          { label: 'Lexical Resource', score: assessment.scores.lexicalResource! },
          { label: 'Grammatical Range', score: assessment.scores.grammaticalRange! },
        ]
      : [
          { label: 'Fluency & Coherence', score: assessment.scores.fluency! },
          { label: 'Lexical Resource', score: assessment.scores.vocabulary! },
          { label: 'Grammatical Range', score: assessment.scores.coherence! },
          { label: 'Pronunciation', score: assessment.scores.pronunciation! },
        ];

    return (
      <div className="space-y-4">
        {/* Overall Score */}
        <Card>
          <CardBody>
            <div className="text-center py-6">
              <div className="text-5xl font-bold mb-1 tabular-nums">
                {assessment.scores.overall.toFixed(1)}
              </div>
              <div className="text-sm text-fg-muted">Overall Band Score</div>
              {!isWriting && (
                <div className="flex items-center justify-center gap-4 text-xs text-fg-muted mt-3">
                  <span>{assessment.wordCount} words</span>
                  <span>·</span>
                  <span>{assessment.speakingTime}s duration</span>
                  <span>·</span>
                  <span>{assessment.pauseCount} pauses</span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Transcription for Speaking */}
        {!isWriting && assessment.transcription && (
          <Card>
            <CardBody>
              <p className="text-xs font-medium text-fg-muted mb-2 uppercase tracking-wide">Transcription</p>
              <div className="p-3 rounded-lg bg-bg-subtle border border-border text-sm leading-relaxed">
                {assessment.transcription}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Individual Scores */}
        <Card>
          <CardBody>
            <p className="text-xs font-medium text-fg-muted mb-3 uppercase tracking-wide">Detailed Breakdown</p>
            <div className="grid gap-3 md:grid-cols-2">
              {scores.map((item) => (
                <div key={item.label} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-fg-muted">{item.label}</span>
                    <span className="font-bold tabular-nums">{item.score.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-fg transition-all"
                      style={{ width: `${(item.score / 9) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardBody>
              <p className="text-xs font-medium text-fg-muted mb-3 uppercase tracking-wide">Strengths</p>
              <ul className="space-y-2">
                {assessment.strengths.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-fg-muted">+</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium text-fg-muted mb-3 uppercase tracking-wide">Areas to Improve</p>
              <ul className="space-y-2">
                {assessment.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-fg-muted">→</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Suggestions */}
        <Card>
          <CardBody>
            <p className="text-xs font-medium text-fg-muted mb-3 uppercase tracking-wide">Suggestions</p>
            <ol className="space-y-2">
              {assessment.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm flex gap-3">
                  <span className="text-fg-muted shrink-0">{idx + 1}.</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Module Switcher */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setActiveModule('writing')}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
            activeModule === 'writing'
              ? 'bg-fg text-bg'
              : 'border border-border text-fg-muted hover:text-fg'
          }`}
        >
          Writing
        </button>
        <button
          onClick={() => setActiveModule('speaking')}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
            activeModule === 'speaking'
              ? 'bg-fg text-bg'
              : 'border border-border text-fg-muted hover:text-fg'
          }`}
        >
          Speaking
        </button>
      </div>

      {/* Writing Module */}
      {activeModule === 'writing' && (
        <div className="space-y-4">
          {/* Prompt */}
          <Card>
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Task Prompt</span>
                <button
                  onClick={() => fetchWritingPrompt()}
                  disabled={isLoadingWritingPrompt}
                  className="text-xs text-fg-muted hover:text-fg disabled:opacity-40 transition-colors"
                >
                  {isLoadingWritingPrompt ? 'Loading...' : 'New prompt'}
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-bg-subtle focus:outline-none focus:ring-1 focus:ring-border resize-none text-sm font-sans"
                rows={4}
                placeholder="Paste or generate an IELTS task prompt..."
              />
            </CardBody>
          </Card>

          {/* Essay Input */}
          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Essay</span>
                <div className="flex items-center gap-3 text-xs text-fg-muted">
                  {draftSaved && <span>Saved</span>}
                  <span className={wordCount >= recommendedMin ? '' : 'text-fg-muted'}>
                    {wordCount} / {recommendedMin}+ words
                  </span>
                  {(essay.trim() || prompt.trim()) && !isAnalyzingWriting && (
                    <button
                      onClick={handleClearDraft}
                      className="hover:text-fg transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-bg-subtle focus:outline-none focus:ring-1 focus:ring-border resize-none text-sm font-sans"
                rows={16}
                placeholder="Write your essay here..."
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-fg-muted">
                  AI will evaluate your essay based on the 4 IELTS writing criteria.
                </p>
                <button
                  onClick={analyzeEssay}
                  disabled={isAnalyzingWriting || !prompt.trim() || wordCount < 50}
                  className="px-4 py-1.5 bg-fg text-bg disabled:opacity-40 text-xs font-medium rounded-lg transition-colors"
                >
                  {isAnalyzingWriting ? 'Analyzing...' : 'Assess'}
                </button>
              </div>
              {isAnalyzingWriting && (
                <p className="text-xs text-fg-muted animate-pulse text-center">
                  {loadingMessage || 'Evaluating with Groq...'}
                </p>
              )}
            </CardBody>
          </Card>

          {/* Error Message */}
          {error && activeModule === 'writing' && (
            <div className="p-4 rounded-xl border border-border text-sm text-fg-muted">
              <span className="font-medium">Error: </span>{error}
            </div>
          )}

          {/* Writing Assessment Results */}
          {writingAssessment && renderAssessmentResults(writingAssessment, 'writing')}
        </div>
      )}

      {/* Speaking Module */}
      {activeModule === 'speaking' && (
        <div className="space-y-4">
          {/* Question Card */}
          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Speaking Prompt</span>
                <button
                  onClick={fetchSpeakingQuestion}
                  disabled={isLoadingQuestion || isRecording}
                  className="text-xs text-fg-muted hover:text-fg disabled:opacity-40 transition-colors"
                >
                  {isLoadingQuestion ? 'Loading...' : 'New question'}
                </button>
              </div>
              <textarea
                value={speakingText}
                onChange={(e) => setSpeakingText(e.target.value)}
                disabled={isRecording}
                placeholder="AI-generated question will appear here, or paste your own..."
                className="w-full p-3 rounded-lg border border-border bg-bg-subtle focus:outline-none focus:ring-1 focus:ring-border resize-none text-sm"
                rows={5}
              />
            </CardBody>
          </Card>

          {/* Recording Controls */}
          <Card>
            <CardBody>
              <div className="flex flex-col items-center py-6 gap-5">
                {/* Status */}
                <div className="text-center min-h-[3rem] flex flex-col items-center justify-center">
                  {isRecording ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm text-red-500">Recording</span>
                      </div>
                      <span className="text-2xl font-bold tabular-nums">{formatTime(recordingTime)}</span>
                    </>
                  ) : audioBlob ? (
                    <>
                      <span className="text-sm text-fg-muted">Saved — {formatTime(recordingTime)}</span>
                    </>
                  ) : (
                    <span className="text-sm text-fg-muted">Ready to record</span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={isAnalyzingSpeaking}
                      className="px-4 py-1.5 bg-fg text-bg disabled:opacity-40 text-xs font-medium rounded-lg transition-colors"
                    >
                      Record
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Stop
                    </button>
                  )}

                  {audioBlob && !isRecording && (
                    <button
                      onClick={analyzeSpeaking}
                      disabled={isAnalyzingSpeaking}
                      className="px-4 py-1.5 bg-fg text-bg disabled:opacity-40 text-xs font-medium rounded-lg transition-colors"
                    >
                      {isAnalyzingSpeaking ? 'Analyzing...' : 'Get Feedback'}
                    </button>
                  )}
                </div>

                {isAnalyzingSpeaking && (
                  <p className="text-xs text-fg-muted animate-pulse text-center">
                    Processing speech... Cold start may take up to 30s
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Error */}
          {error && activeModule === 'speaking' && (
            <div className="p-4 rounded-xl border border-border text-sm text-fg-muted">
              <span className="font-medium">Error: </span>{error}
            </div>
          )}

          {/* Results */}
          {speakingAssessment && renderAssessmentResults(speakingAssessment, 'speaking')}
        </div>
      )}
    </div>
  );
}
