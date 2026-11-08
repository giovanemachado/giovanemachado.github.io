import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

const LANG_FILE: Record<string, Lang> = {
  pt: 'pt-br',
  en: 'en-us',
};

export type PostEntry = CollectionEntry<'posts'>;

export interface PostSummary {
  entry: PostEntry;
  slug: string;
  lang: Lang;
}

export const parsePostId = (id: string): { slug: string; lang: Lang } => {
  const [slug, file] = id.split('/');
  const lang = LANG_FILE[file];
  if (!slug || !lang) throw new Error(`Invalid post id: ${id}`);
  return { slug, lang };
};

export const postsFor = async (lang: Lang): Promise<PostSummary[]> =>
  (await getCollection('posts'))
    .map((entry) => ({ entry, ...parsePostId(entry.id) }))
    .filter((post) => post.lang === lang);

// Newest first, then slug for stable ties.
export const recentPostsFor = async (lang: Lang): Promise<PostSummary[]> =>
  (await postsFor(lang)).sort(
    (a, b) =>
      b.entry.data.date.localeCompare(a.entry.data.date) ||
      a.slug.localeCompare(b.slug),
  );

export const postPath = (lang: Lang, slug: string): string =>
  `${lang === 'en-us' ? '/en' : ''}/posts/${slug}/`;

export const archivePath = (lang: Lang): string =>
  `${lang === 'en-us' ? '/en' : ''}/posts/`;

// Items are stored in display order; the sidebar just takes the first few.
export const topItems = (
  items: [string, number][] | undefined,
  count = 5,
): [string, number][] => (items ?? []).slice(0, count);
