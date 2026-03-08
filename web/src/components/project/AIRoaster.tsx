'use client';

import { useState } from 'react';

interface DetectedObject {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
}

interface RoastResult {
  roast: string;
  detectedObjects: string[];
  objectDetection?: DetectedObject[];
}

export function AIRoaster() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setRoastResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call both AI Roaster and Object Detection in parallel
      const [roastResponse, detectionResponse] = await Promise.all([
        fetch('/api/ai-roaster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: selectedImage }),
        }),
        (async () => {
          try {
            // Convert base64 to blob for object detection
            const blob = await fetch(selectedImage).then(r => r.blob());
            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');
            
            return await fetch('/api/detect-objects', {
              method: 'POST',
              body: formData,
            });
          } catch {
            return null; // Object detection is optional
          }
        })(),
      ]);

      if (!roastResponse.ok) {
        throw new Error('Failed to analyze image');
      }

      const roastData = await roastResponse.json();
      
      // Add object detection results if available
      if (detectionResponse?.ok) {
        const detectionData = await detectionResponse.json();
        if (detectionData.success && detectionData.detections) {
          roastData.objectDetection = detectionData.detections;
        }
      }

      setRoastResult(roastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl border border-border p-8">
        {/* Upload Area */}
        {!selectedImage ? (
          <div className="text-center">
            <label
              htmlFor="image-upload"
              className="cursor-pointer block p-12 border border-dashed border-border rounded-xl hover:border-fg/40 transition-colors bg-bg-subtle"
            >
              <div className="mb-4">
                <svg className="mx-auto w-10 h-10 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-fg mb-1">Upload an image</p>
              <p className="text-sm text-fg-muted">PNG, JPG up to 5MB</p>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="relative">
              <div className="relative w-full rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Uploaded image"
                  onLoad={(e) => {
                    const t = e.currentTarget;
                    setImgNatural({ w: t.naturalWidth, h: t.naturalHeight });
                  }}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  className="rounded-2xl"
                />
                {/* Object Detection Bounding Boxes */}
                {roastResult?.objectDetection && roastResult.objectDetection.length > 0 && imgNatural.w > 0 && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 ${imgNatural.w} ${imgNatural.h}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {roastResult.objectDetection.map((obj, idx) => {
                      const [x1, y1, x2, y2] = obj.bbox;
                      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B731', '#5F27CD'];
                      const color = colors[idx % colors.length];
                      return (
                        <g key={idx}>
                          <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="none" stroke={color} strokeWidth="3" />
                          <rect x={x1} y={y1} width={Math.min(140, x2 - x1)} height={22} fill={color} fillOpacity="0.85" />
                          <text x={x1 + 5} y={y1 + 15} fill="white" fontSize="13" fontWeight="bold">
                            {obj.label} {Math.round(obj.confidence * 100)}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setRoastResult(null);
                  setError(null);
                }}
                className="absolute top-4 right-4 px-3 py-1.5 bg-bg-hover border border-border text-fg-muted text-sm rounded hover:text-fg transition-colors"
              >
                Remove
              </button>
            </div>

            {/* Analyze Button */}
            {!roastResult && (
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full py-3 bg-fg text-bg rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  AI is analyzing...
                  </span>
                ) : (
                  'Roast me'
                )}
              </button>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-bg-subtle border border-border rounded-lg text-fg-muted text-sm">
                {error}
              </div>
            )}

            {/* Roast Result */}
            {roastResult && (
              <div className="space-y-4 animate-in fade-in duration-500">
                {/* Roast Text */}
                <div className="p-6 bg-bg-subtle rounded-2xl border border-border">
                  <p className="text-base text-fg leading-relaxed italic">
                    &ldquo;{roastResult.roast}&rdquo;
                  </p>
                </div>

                {/* Try Again Button */}
                <button
                  onClick={() => setRoastResult(null)}
                  className="w-full py-2.5 border border-border text-fg-muted rounded-full text-sm hover:bg-bg-subtle transition-colors"
                >
                  Roast Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
