'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const PROMPTS = [
  'cat','dog','house','tree','sun','bicycle','fish','star','apple',
  'flower','car','bird','hat','chair','guitar','pizza','airplane',
  'butterfly','cloud','crown','diamond','elephant','hamburger',
  'ice cream','key','lightning','moon','mushroom','pencil','rainbow',
  'rocket','scissors','snake','umbrella','whale',
];

type GameState = 'idle' | 'drawing' | 'result';
interface Prediction { class: string; confidence: number; }

export function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [prompt, setPrompt] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [topGuess, setTopGuess] = useState('');
  const [guessConf, setGuessConf] = useState(0);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const classifyRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const promptRef = useRef('');

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 5;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }, []);

  useEffect(() => { initCanvas(); }, [initCanvas]);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
    }
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (gameState !== 'drawing') return;
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath(); ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing || gameState !== 'drawing') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y); ctx.stroke();
  }

  function stopDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(false);
  }

  async function classify(): Promise<Prediction | null> {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    try {
      const b64 = canvas.toDataURL('image/png').split(',')[1];
      const res = await fetch('/api/classify-doodle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64, top_k: 1 }),
      });
      const data = await res.json();
      if (data.success && data.predictions?.length > 0) return data.predictions[0];
    } catch { /* silent */ }
    return null;
  }

  function endGame(won: boolean, label: string, conf: number) {
    clearInterval(timerRef.current!); clearInterval(classifyRef.current!);
    setTopGuess(label); setGuessConf(conf); setSuccess(won); setGameState('result');
  }

  function startGame() {
    initCanvas();
    setTopGuess(''); setGuessConf(0); setSuccess(false);
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    promptRef.current = p;
    setPrompt(p); setTimeLeft(20); setGameState('drawing');

    classifyRef.current = setInterval(async () => {
      const result = await classify();
      if (!result) return;
      setTopGuess(result.class); setGuessConf(result.confidence);
      if (result.class.toLowerCase() === promptRef.current.toLowerCase() && result.confidence > 0.4) {
        endGame(true, result.class, result.confidence);
      }
    }, 2000);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!); clearInterval(classifyRef.current!);
          classify().then((result) => endGame(
            result?.class.toLowerCase() === promptRef.current.toLowerCase(),
            result?.class ?? '',
            result?.confidence ?? 0,
          ));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  const timerColor = timeLeft > 10 ? '#22c55e' : timeLeft > 5 ? '#f59e0b' : '#ef4444';
  const timerPct = (timeLeft / 20) * 100;
  const circumference = 2 * Math.PI * 24;

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
      <div className="space-y-4">
        {/* Prompt / status banner */}
        <div className="flex items-center justify-between min-h-[56px]">
          {gameState === 'idle' && (
            <p className="text-sm text-fg-muted">Press <strong className="text-fg">Start Game</strong> to get a word and start drawing!</p>
          )}
          {gameState === 'drawing' && (
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-fg-muted mb-1">Draw this:</p>
                <p className="text-2xl font-heading font-bold text-fg capitalize">{prompt}</p>
              </div>
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="text-border/40" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke={timerColor} strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - timerPct / 100)}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-mono font-bold text-fg">{timeLeft}</span>
              </div>
            </div>
          )}
          {gameState === 'result' && (
            success
              ? <p className="text-base font-semibold text-green-500">&#10003; The AI recognized your &ldquo;{prompt}&rdquo;!</p>
              : <p className="text-base text-fg-muted">Time&apos;s up! The word was <strong className="text-fg capitalize">{prompt}</strong>.</p>
          )}
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
          className={`w-full aspect-square border border-border/50 rounded-2xl touch-none bg-white ${gameState === 'drawing' ? 'cursor-crosshair' : 'cursor-default'}`}
        />

        <div className="flex gap-3">
          {gameState !== 'drawing' && (
            <button onClick={startGame} className="flex-1 bg-fg text-bg py-2.5 text-sm font-medium rounded-full hover:opacity-80 transition-opacity">
              {gameState === 'result' ? 'Play Again' : 'Start Game'}
            </button>
          )}
          {gameState === 'drawing' && (
            <>
              <button
                onClick={() => classify().then((r) => endGame(r?.class.toLowerCase() === prompt.toLowerCase(), r?.class ?? '', r?.confidence ?? 0))}
                className="flex-1 bg-fg text-bg py-2.5 text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
              >Submit</button>
              <button onClick={initCanvas} className="border border-border/50 px-4 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-subtle transition-colors rounded-full">Clear</button>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-fg-muted mb-4">
            {gameState === 'drawing' ? 'AI is guessing…' : 'AI thought it was:'}
          </p>
          {topGuess ? (
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-xl font-heading font-semibold text-fg capitalize">{topGuess}</span>
                <span className="text-sm font-mono text-fg-muted tabular-nums">{(guessConf * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${topGuess.toLowerCase() === prompt.toLowerCase() ? 'bg-green-500' : 'bg-fg/30'}`}
                  style={{ width: `${guessConf * 100}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-fg-muted">{gameState === 'idle' ? 'Start a game to see the AI guess.' : 'Keep drawing…'}</p>
          )}
        </div>

        {gameState === 'result' && (
          <div className={`p-4 rounded-2xl border ${success ? 'border-green-500/30 bg-green-500/5' : 'border-border/40 bg-bg-subtle'}`}>
            <p className="text-sm font-medium text-fg mb-1">{success ? '&#127881; Got it!' : '&#128517; Not quite'}</p>
            <p className="text-xs text-fg-muted">
              {success
                ? `The AI recognized "${prompt}" with ${(guessConf * 100).toFixed(0)}% confidence.`
                : `The AI thought it was "${topGuess || 'unknown'}". Try drawing "${prompt}" again!`}
            </p>
          </div>
        )}

        <p className="text-xs text-fg-muted/50 leading-relaxed">
          Model trained on 345 categories from Google Quick Draw — 50M+ human sketches.
        </p>
      </div>
    </div>
  );
}
