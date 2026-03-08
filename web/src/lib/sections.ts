export type SectionKey = 'garden' | 'german' | 'wanderlust';

export const SECTIONS: Array<{
  key: SectionKey;
  label: string;
  href: `/${SectionKey}`;
  description: string;
}> = [
  {
    key: 'garden',
    label: 'Garden',
    href: '/garden',
    description: 'Digital garden - personal growth, essays, and reflections.',
  },
  {
    key: 'german',
    label: 'German',
    href: '/german',
    description: 'Learning German: news, translation, TTS, and word of the day.',
  },
  {
    key: 'wanderlust',
    label: 'Wanderlust',
    href: '/wanderlust',
    description: 'Travel map, check-ins, and photography.',
  },
];

export function getSection(key: SectionKey) {
  const section = SECTIONS.find((s) => s.key === key);
  if (!section) throw new Error(`Unknown section: ${key}`);
  return section;
}
