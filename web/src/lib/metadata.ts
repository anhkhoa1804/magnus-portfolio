import type { Metadata } from 'next';
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import type { SectionKey } from '@/lib/sections';

export function ogImageUrl({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const url = new URL('/og', getSiteUrl());
  url.searchParams.set('title', title);
  if (subtitle) url.searchParams.set('subtitle', subtitle);
  return url.toString();
}

export function entryMetadata({
  section,
  slug,
  title,
  description,
  publishedTime,
}: {
  section: SectionKey;
  slug: string;
  title: string;
  description: string;
  publishedTime?: string;
}): Metadata {
  const canonical = `/${section}/${slug}`;
  const fullTitle = `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url: canonical,
      publishedTime,
      images: [{ url: ogImageUrl({ title, subtitle: `/${section}/${slug}` }) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl({ title, subtitle: `/${section}/${slug}` })],
    },
  };
}

export function baseMetadata(): Metadata {
  return {
    title: {
      default: SITE_NAME,
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    metadataBase: new URL(getSiteUrl()),
    icons: {
      icon: [
        { url: '/logo.png', type: 'image/png', sizes: 'any' },
        { url: '/logo.png', type: 'image/png', rel: 'shortcut icon' }, // Fallback for some browsers
      ],
      apple: '/logo.png',
    },
  };
}
