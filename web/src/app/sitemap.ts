import type { MetadataRoute } from 'next';
import { SECTIONS } from '@/lib/sections';
import { getAllEntries } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: '/', changeFrequency: 'weekly', priority: 1 },
    { url: '/writing', changeFrequency: 'weekly', priority: 0.9 },
    { url: '/wiki', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.4 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.4 },
  ];

  for (const section of SECTIONS) {
    routes.push({ url: section.href, changeFrequency: 'weekly', priority: 0.7 });
    const entries = await getAllEntries(section.key);
    for (const entry of entries) {
      routes.push({
        url: `${section.href}/${entry.slug}`,
        lastModified: new Date(entry.frontmatter.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return routes;
}
