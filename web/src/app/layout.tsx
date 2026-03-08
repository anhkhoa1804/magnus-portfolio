import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/site/ThemeProvider';
import { I18nProvider } from '@/lib/i18n/context';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { SocialSidebar } from '@/components/site/SocialSidebar';
import { PrefetchData } from '@/components/PrefetchData';
import 'mapbox-gl/dist/mapbox-gl.css';
import { baseMetadata } from '@/lib/metadata';
import { Toaster } from 'sonner';

const sans = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

const heading = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const mono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = baseMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${heading.variable} ${mono.variable} min-h-screen font-sans antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <Toaster richColors position="top-center" />
            <PrefetchData />
            <SocialSidebar />
            <Header />
            <main className="min-h-[calc(100vh-5rem)] pt-8">
              <div className="view-transition-wrapper">
                {children}
              </div>
            </main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
