import Link from 'next/link';
import { cn } from '@/lib/cn';

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

type ButtonAsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLink = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonAsButton): React.ReactNode;
export function Button(props: ButtonAsLink): React.ReactNode;
export function Button(props: ButtonProps) {
  const { className, children, variant = 'primary', size = 'md' } = props;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-border shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-border/70 disabled:opacity-60 disabled:pointer-events-none';

  const variants: Record<string, string> = {
    primary: 'bg-brand text-brand-fg hover:opacity-90',
    secondary: 'bg-card text-fg-muted hover:text-fg',
    ghost: 'border-transparent shadow-none bg-transparent text-fg-muted hover:text-fg hover:bg-bg-subtle',
  };

  const sizes: Record<string, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-11 px-6 text-base',
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in props && typeof props.href === 'string') {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
