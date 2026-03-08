import { getAllEntries } from '@/lib/content';
import { QuoteWidget } from '@/components/widgets/QuoteWidget';
import { CodingStatsWidget } from '@/components/widgets/CodingStatsWidget';
import { SpotifyWidget } from '@/components/widgets/SpotifyWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { WordOfTheDayWidget } from '@/components/widgets/WordOfTheDayWidget';
import { UnsplashPhotoWidget } from '@/components/widgets/UnsplashPhotoWidget';
import { AquariusWidget } from '@/components/widgets/AquariusWidget';
import { ContactWidget } from '@/components/widgets/ContactWidget';
import { StockWidget } from '@/components/widgets/StockWidget';
import { ProjectsCarousel, GardenCarousel } from '@/components/home/HomeCarousels';
import { ContactSection } from '@/components/home/ContactSection';
import { HeroSection, BentoSection } from '@/components/home/HomeSections';

const PROJECTS = [
  {
    label: 'AI / NLP',
    title: 'IELTS Examiner',
    desc: 'LLM-graded writing essays and Whisper-transcribed speaking evaluation.',
    href: '/project/ielts',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'Full-stack',
    title: 'Code Sandbox',
    desc: 'Daily LeetCode challenges with Monaco editor and judge execution.',
    href: '/project/code-sandbox',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'AI / Vision',
    title: 'AI Roaster',
    desc: 'Upload a photo and get a sharp, context-aware roast from GPT-4o Vision.',
    href: '/project/ai-roaster',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'Data',
    title: 'Price Predictions',
    desc: 'Stock charts and sparklines powered by AlphaVantage.',
    href: '/project/stocks',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'AI / Vision',
    title: 'Doodle Classifier',
    desc: 'ResNet50 fine-tuned on Google Quick Draw — classifies your sketch live.',
    href: '/project/doodle-classifier',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=480&h=360&fit=crop&auto=format',
  },
  {
    label: 'Full-stack',
    title: 'Chat',
    desc: 'Conversational AI with RAG context built from content across this site.',
    href: '/project/chat-phi3',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&h=360&fit=crop&auto=format',
  },
];

export const metadata = {
  title: { absolute: 'Magnus' },
  description: 'Engineer, reader, traveller.',
};

export const revalidate = 3600;

export default async function HomePage() {
  const all = await getAllEntries('garden').catch(() => []);

  return (
    <div>

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── BENTO WIDGETS ── */}
      <BentoSection
        weatherSlot={<WeatherWidget />}
        spotifySlot={<SpotifyWidget />}
        quoteSlot={<QuoteWidget />}
        wordSlot={<WordOfTheDayWidget />}
        codingSlot={<CodingStatsWidget />}
        photoSlot={<UnsplashPhotoWidget />}
        aquariusSlot={<AquariusWidget />}
        contactSlot={<ContactWidget />}
        stocksSlot={<StockWidget />}
      />

      {/* ── FEATURED PROJECTS ── */}
      <ProjectsCarousel projects={PROJECTS} />

      {/* ── FROM THE GARDEN ── */}
      <GardenCarousel posts={all} />

      {/* ── CONTACT ── */}
      <ContactSection />

    </div>
  );
}
