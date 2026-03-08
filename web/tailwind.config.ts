import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1200px',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        heading: ['var(--font-heading)', 'var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        bg: {
          DEFAULT: 'hsl(var(--bg))',
          subtle: 'hsl(var(--bg-subtle))',
        },
        fg: {
          DEFAULT: 'hsl(var(--fg))',
          muted: 'hsl(var(--fg-muted))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          fg: 'hsl(var(--card-fg))',
        },
        border: 'hsl(var(--border))',
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          fg: 'hsl(var(--brand-fg))',
        },
        pos: {
          DEFAULT: 'hsl(var(--pos) / <alpha-value>)',
          fg: 'hsl(var(--pos-fg) / <alpha-value>)',
        },
        neg: {
          DEFAULT: 'hsl(var(--neg) / <alpha-value>)',
          fg: 'hsl(var(--neg-fg) / <alpha-value>)',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--fg))',
            '--tw-prose-headings': 'hsl(var(--fg))',
            '--tw-prose-lead': 'hsl(var(--fg-muted))',
            '--tw-prose-links': 'hsl(var(--fg))',
            '--tw-prose-bold': 'hsl(var(--fg))',
            '--tw-prose-counters': 'hsl(var(--fg-muted))',
            '--tw-prose-bullets': 'hsl(var(--fg-muted))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--fg))',
            '--tw-prose-quote-borders': 'hsl(var(--border))',
            '--tw-prose-captions': 'hsl(var(--fg-muted))',
            '--tw-prose-code': 'hsl(var(--fg))',
            '--tw-prose-pre-code': 'hsl(var(--fg))',
            '--tw-prose-pre-bg': 'hsl(var(--bg-subtle))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            code: {
              fontWeight: '500',
            },
            pre: {
              border: '1px solid hsl(var(--border))',
              borderRadius: '1rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
