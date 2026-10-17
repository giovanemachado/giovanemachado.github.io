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
    return [...(window.POSTS_DATA || [])].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
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

// Shared page shell. Each HTML page keeps only a #shell mount point plus a
// static <noscript>; header, sidebar boxes, and footer render from here.
const SIDEBAR_BOXES = ['contact', 'blogs', 'games', 'books'];

const shellSidebar = () => `<aside id="sidebar-column" class="w-full lg:w-64 shrink-0 flex flex-col gap-4">${SIDEBAR_BOXES.map((box) => `
    <div class="border border-dashed border-neutral-400 p-3">
        <span id="${box}-title" class="font-bold"></span>
        <div id="${box}-list"></div>
    </div>`).join('')}
</aside>`;

const shellHeader = (homeHref, langFn) => `<div class="flex w-full justify-between mt-0 mb-2">
    <a class="underline" href="${homeHref}"><h1 class="text-3xl font-bold ">giovane machado</h1></a>${langFn ? `
    <div class="flex flex-col">
        <a class="underline" href="#" onclick="${langFn}('pt-br'); return false;">pt-br</a>
        <a class="underline" href="#" onclick="${langFn}('en-us'); return false;">en-us</a>
    </div>` : ''}
</div>`;

const renderShell = ({ homeHref, langFn, bannerHtml, mainHtml, visible }) => {
    const contentClass = visible
        ? 'container max-w-[450px] lg:max-w-[750px] w-full mx-auto px-0 py-0 font-mono'
        : 'opacity-0 transition-opacity ease-in delay-150 duration-100 container max-w-[450px] lg:max-w-[750px] w-full mx-auto px-0 py-0 font-mono';
    document.getElementById('shell').innerHTML = `<div id="content"
        class="${contentClass}">
        ${bannerHtml}
        ${shellHeader(homeHref, langFn)}
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
            ${mainHtml}
            ${shellSidebar()}
        </div>
        <footer class="mt-8 pt-3 pb-6 text-center text-sm">
            <p>à bientôt !</p>
        </footer>
    </div>`;
};

const NOT_FOUND_HTML = `<div class="flex-1 min-w-0">
    <h2 class="text-xl font-bold">404</h2>
    <br />
    <p>página não encontrada / page not found</p>
    <br />
    <div>
        <ul>
            <li>* <a class="underline" href="/">voltar para o início / back home</a></li>
        </ul>
    </div>
</div>`;

const bootNotFound = () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    renderShell({ homeHref: '/', langFn: null, bannerHtml: '', mainHtml: NOT_FOUND_HTML, visible: true });
    return ensureDataLoaded().then(() => renderSidebar(localStorage.getItem('lang') || window.portugueseTag));
};

// Loads every post file listed in posts/manifest.js (once). Resolves the
// posts/ dir from the manifest <script> tag, so it works from any page.
const loadedSlugs = new Set();

const loadPostFile = (base, slug) => new Promise((resolve) => {
    if (loadedSlugs.has(slug)) { resolve(); return; }
    const el = document.createElement('script');
    el.src = new URL(slug + '.js', base).href;
    el.onload = () => {
        loadedSlugs.add(slug);
        resolve();
    };
    el.onerror = () => {
        console.error('Erro ao carregar post: ' + slug);
        loadedSlugs.delete(slug);
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
