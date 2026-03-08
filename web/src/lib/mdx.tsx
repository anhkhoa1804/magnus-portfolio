import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code';
import type { MDXComponents } from 'mdx/types';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';
import { Pre } from '@/components/mdx/Pre';
import { Callout } from '@/components/mdx/Callout';

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: false,
};

export async function renderMdx(source: string, components?: MDXComponents) {
  const baseComponents: MDXComponents = {
    pre: Pre,
    Callout,
    a: ({ href, children, ...props }) => {
      if (typeof href === 'string' && href.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
        </a>
      );
    },
  };

  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
    components: { ...baseComponents, ...(components ?? {}) },
  });

  return content;
}
