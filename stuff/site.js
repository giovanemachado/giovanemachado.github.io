// stuff/site.js — shared constants + helpers.
// Load BEFORE stuff/sidebar.js, stuff/home.js, stuff/blog.js on every page.

// Single place where the language-tag literals live.
window.portugueseTag = window.portugueseTag || 'pt-br';
window.englishTag = window.englishTag || 'en-us';

const isEnLang = (lang) => (lang || window.portugueseTag) === window.englishTag;

const postKeyFor = (slug, lang) => slug + (isEnLang(lang) ? '-en' : '-pt');

// Display language is derived from the post key suffix; `lang=` in the URL follows it.
const langOfKey = (key) => /-en(\.html)?$/.test(key || '') ? window.englishTag : window.portugueseTag;

const getItems = (slug) => {
    const found = (window.POSTS_DATA || []).find((post) => post.slug === slug);
    return found ? found.items : [];
};

const getRecentPosts = () => {
    return [...(window.POSTS_DATA || [])].sort((a, b) => a.date < b.date ? 1 : -1);
};

const sortByStars = (list) => {
    return [...list].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

const top5ByStars = (list) => sortByStars(list).slice(0, 5);

const starsFor = (rating) => {
    const clamped = Math.min(5, Math.max(1, rating));
    return "★".repeat(clamped) + "☆".repeat(5 - clamped);
};

const starsRow = (title, rating, lang) => {
    const stars = starsFor(rating);
    const ariaLabel = isEnLang(lang) ? `${rating} out of 5` : `${rating} de 5`;
    return `<li class="flex justify-between gap-2"><span>* ${title}</span><span class="whitespace-nowrap" title="${rating}/5" aria-label="${title}: ${ariaLabel}">${stars}</span></li>`;
};

// All UI copy, both languages. Add a key here instead of a new *_PT/*_EN const pair.
const STRINGS = {
    'pt-br': {
        contact: `contato:`,
        blogs: `blogs:`,
        games: `jogos que já joguei:`,
        books: `livros que já li:`,
        more: `ver lista completa`,
        stack: `minha stack:`,
        homeP1: `eai 🤙, sou fullstack engineer desde 2019, gosto de passar tempo meu tempo livre com a minha família, ou jogando algo. vivo em uma cidade pequena de santa catarina - brasil, e trabalho remoto desde sempre.`,
        homeP2: `minha experiência profissional inclui startups de diversas áreas (no brasil e nos estados unidos), trabalhando com aplicações para web e também mobile de maneira AI first. fora isso, ainda sou um aspirante a game dev/designer.`,
    },
    'en-us': {
        contact: `contact:`,
        blogs: `blogs:`,
        games: `games i've played:`,
        books: `books i've read:`,
        more: `see full list`,
        stack: `my stack:`,
        homeP1: ` hey 🤙, i'm a fullstack engineer since 2019, i like to spend my free time with my family, or playing video games. i live in a small city in santa catarina - brazil, and i've been working remotely since forever.`,
        homeP2: ` my professional experience includes startups from various areas (in brazil and the united states), working with web and mobile applications in an AI first approach. besides that, i'm an aspiring game dev/designer.`,
    },
};

const t = (lang, key) => (STRINGS[lang] || STRINGS[window.portugueseTag])[key];

// Loads every post file listed in posts/manifest.js (once). Resolves the
// posts/ dir from the manifest <script> tag, so it works from any page.
const loadedSlugs = new Set();

const loadPostFile = (base, slug) => new Promise((resolve) => {
    if (loadedSlugs.has(slug)) { resolve(); return; }
    loadedSlugs.add(slug);
    const el = document.createElement('script');
    el.src = new URL(slug + '.js', base).href;
    el.onload = () => resolve();
    el.onerror = () => {
        console.error('Erro ao carregar post: ' + slug);
        resolve();
    };
    document.head.appendChild(el);
});

let dataLoadPromise = null;

const ensureDataLoaded = () => {
    if (!dataLoadPromise) {
        dataLoadPromise = (async () => {
            const files = window.POSTS_FILES || [];
            if (!files.length) {
                console.error('Erro ao carregar: posts/manifest.js missing or empty');
                return;
            }
            const manifestEl = document.querySelector && document.querySelector('script[src*="manifest.js"]');
            const base = manifestEl && manifestEl.src ? new URL('.', manifestEl.src).href : 'posts/';
            await Promise.all(files.map((slug) => loadPostFile(base, slug)));
        })();
    }
    return dataLoadPromise;
};
