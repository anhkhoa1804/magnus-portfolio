export const SITE_NAME = 'Magnus';
export const SITE_DESCRIPTION = 'Engineer, builder, writer. Notes on AI, craft, and living deliberately.';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}
