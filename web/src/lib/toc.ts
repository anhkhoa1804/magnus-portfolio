import readingTime from 'reading-time';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';

export type TocItem = {
  depth: 2 | 3;
  value: string;
  slug: string;
};

export type ReadingMeta = {
  text: string;
  minutes: number;
  words: number;
};

export function getReadingMeta(source: string): ReadingMeta {
  const rt = readingTime(source);
  return {
    text: rt.text,
    minutes: rt.minutes,
    words: rt.words,
  };
}

type MdxNode = {
  type: string;
  value?: unknown;
  depth?: unknown;
  children?: unknown;
};

function isNode(value: unknown): value is MdxNode {
  return typeof value === 'object' && value !== null && 'type' in value;
}

function extractText(node: unknown): string {
  if (!isNode(node)) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) return node.children.map(extractText).join('');
  return '';
}

export function getToc(source: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, 'heading', (node) => {
    if (!isNode(node)) return;
    const depth = typeof node.depth === 'number' ? node.depth : NaN;
    if (depth !== 2 && depth !== 3) return;

    const value = extractText(node).trim();
    if (!value) return;

    const slug = slugger.slug(value);
    items.push({ depth: depth as 2 | 3, value, slug });
  });

  return items;
}
