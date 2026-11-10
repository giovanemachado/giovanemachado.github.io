export type Lang = 'pt-br' | 'en-us';

export const PT: Lang = 'pt-br';
export const EN: Lang = 'en-us';

const STRINGS: Record<Lang, Record<string, string>> = {
  'pt-br': {
    contact: `contato:`,
    blogs: `blogs:`,
    myGames: `meus jogos:`,
    games: `jogos que já joguei:`,
    books: `livros que já li:`,
    watched: `séries e filmes que já vi:`,
    more: `ver lista completa`,
    stack: `minha stack:`,
    homeP1: `eai 🤙, sou fullstack engineer desde 2019, gosto de passar tempo meu tempo livre com a minha família, ou jogando algo. vivo em uma cidade pequena de santa catarina - brasil, e trabalho remoto desde sempre.`,
    homeP2: `minha experiência profissional inclui startups de diversas áreas (no brasil e nos estados unidos), trabalhando com aplicações para web e também mobile de maneira AI first. fora isso, ainda sou um aspirante a game dev/designer.`,
  },
  'en-us': {
    contact: `contact:`,
    blogs: `blogs:`,
    myGames: `my games:`,
    games: `games i've played:`,
    books: `books i've read:`,
    watched: `shows and movies i've watched:`,
    more: `see full list`,
    stack: `my stack:`,
    homeP1: ` hey 🤙, i'm a fullstack engineer since 2019, i like to spend my free time with my family, or playing video games. i live in a small city in santa catarina - brazil, and i've been working remotely since forever.`,
    homeP2: ` my professional experience includes startups from various areas (in brazil and the united states), working with web and mobile applications in an AI first approach. besides that, i'm an aspiring game dev/designer.`,
  },
};

export const t = (lang: Lang, key: string): string =>
  STRINGS[lang][key] ?? STRINGS[PT][key];

export const isEn = (lang: Lang): boolean => lang === EN;

export const otherLang = (lang: Lang): Lang => (lang === EN ? PT : EN);
