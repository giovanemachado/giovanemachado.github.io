import type { Lang } from '../i18n';

export const archive = {
  date: '2026-10-14',
  title: { 'pt-br': 'todos os posts', 'en-us': 'all posts' },
  intro: {
    'pt-br': 'a lista completa de posts, do mais novo ao mais antigo.',
    'en-us': 'the complete posts list, newest first.',
  },
} satisfies {
  date: string;
  title: Record<Lang, string>;
  intro: Record<Lang, string>;
};
