import Link from 'next/link';
import Image from 'next/image';
import { ProjectsHeader } from '@/components/site/ProjectsHeader';

export const metadata = {
  title: 'Projects',
  description: 'AI experiments and technical demos.',
};

export const revalidate = 3600;

const PROJECTS = [
  {
    label: 'AI / NLP',
    title: 'IELTS Examiner',
    description: 'Full IELTS prep tool. Groq grades writing essays on 4 band criteria; Whisper transcribes speaking recordings for evaluation.',
    stack: ['Llama-3.3-70B', 'Groq', 'Whisper'],
    href: '/project/ielts',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'AI / Vision',
    title: 'Doodle Classifier',
    description: 'Draw anything — a ResNet50 model fine-tuned on Google Quick Draw (345 categories) classifies your sketch live.',
    stack: ['ResNet50', 'Quick Draw', 'Canvas API'],
    href: '/project/doodle-classifier',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'AI / Vision',
    title: 'AI Roaster',
    description: 'Upload a photo — YOLOv8 detects objects, then Llama 4 Scout delivers a sharp, context-aware roast based on what it sees.',
    stack: ['Llama 4 Scout', 'Groq', 'YOLOv8'],
    href: '/project/ai-roaster',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'Full-stack',
    title: 'Chat',
    description: 'Conversational AI with persistent memory. Llama-3.3-70B via Groq, with RAG context built from content across this site.',
    stack: ['Llama-3.3-70B', 'Groq', 'RAG'],
    href: '/project/chat-phi3',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'Full-stack',
    title: 'Code Sandbox',
    description: "Daily LeetCode challenge with Monaco editor. Submit code in Python, JavaScript, C++, or Java — Groq interprets execution.",
    stack: ['Monaco Editor', 'Groq', 'LeetCode API'],
    href: '/project/code-sandbox',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'Data',
    title: 'Price Predictions',
    description: 'Stock price charts with sparklines powered by AlphaVantage. Historical close prices for any ticker symbol.',
    stack: ['AlphaVantage', 'Recharts', 'Next.js'],
    href: '/project/stocks',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=280&fit=crop&auto=format',
  },
];

export default function ProjectsPage() {
  return (
    <div className="container max-w-5xl">
      <ProjectsHeader />

      <div className="grid md:grid-cols-2 gap-4">
        {PROJECTS.map((project) => (
          <Link key={project.href} href={project.href} className="group block bento-card overflow-hidden hover:shadow-md transition-shadow">
            <article className="flex flex-row h-full min-h-[220px]">
              {/* Text */}
              <div className="flex-1 p-7 flex flex-col gap-3 min-w-0">
                <h2 className="text-xl font-heading font-semibold text-fg group-hover:opacity-60 transition-opacity leading-snug">
                  {project.title}
                </h2>
                <p className="text-xs text-fg-muted/70 font-light leading-relaxed flex-1 line-clamp-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {project.stack.map((s) => (
                    <span key={s} className="text-[10px] font-mono border border-border/40 px-1.5 py-0.5 text-fg-muted/60">{s}</span>
                  ))}
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fg-muted group-hover:text-fg transition-colors mt-1">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </div>
              {/* Image */}
              <div className="w-40 md:w-44 shrink-0 relative overflow-hidden border-l border-border">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 176px"
                />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
