var sidebarPortugueseTag = window.sidebarPortugueseTag || window.portugueseTag || 'pt-br'
var sidebarEnglishTag = window.sidebarEnglishTag || window.englishTag || 'en-us'

const LINKS_HTML = `<ul>
    <li>* <a class="underline" target="_blank" href="https://www.linkedin.com/in/giovanenolink">linkedin</a></li>
    <li>* <a class="underline" target="_blank" href="https://github.com/giovanemachado">github</a></li>
    <li>* <a class="underline" target="_blank" href="https://sangue1.itch.io">itch</a></li>
</ul>`;

const CONTACT_TITLE_PT = `contato:`;
const CONTACT_TITLE_EN = `contact:`;

const BLOGS_TITLE = `blogs:`;

const GAMES_TITLE_PT = `jogos que já joguei:`;
const GAMES_TITLE_EN = `games i've played:`;

const BOOKS_TITLE_PT = `livros que já li:`;
const BOOKS_TITLE_EN = `books i've read:`;

const MORE_PT = `ver lista completa`;
const MORE_EN = `see full list`;

const getItems = (slug) => {
    const found = (window.POSTS_DATA || []).find((post) => post.slug === slug);
    return found ? found.items : [];
};

const getRecentPosts = () => {
    return [...(window.POSTS_DATA || [])].sort((a, b) => a.date < b.date ? 1 : -1);
};

const starsFor = (rating) => {
    const clamped = Math.min(5, Math.max(1, rating));
    return "★".repeat(clamped) + "☆".repeat(5 - clamped);
};

const top5ByStars = (list) => {
    return [...list]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 5);
};

const starsRow = (title, rating, lang) => {
    const stars = starsFor(rating);
    const ariaLabel = lang === sidebarEnglishTag ? `${rating} out of 5` : `${rating} de 5`;
    return `<li class="flex justify-between gap-2"><span>* ${title}</span><span class="whitespace-nowrap" title="${rating}/5" aria-label="${title}: ${ariaLabel}">${stars}</span></li>`;
};

const renderContact = (lang) => {
    const isEn = lang === sidebarEnglishTag;
    document.getElementById("contact-title").textContent = isEn ? CONTACT_TITLE_EN : CONTACT_TITLE_PT;
    document.getElementById("contact-list").innerHTML = LINKS_HTML;
};

const renderBlogsBox = (lang) => {
    const isEn = lang === sidebarEnglishTag;
    document.getElementById("blogs-title").textContent = BLOGS_TITLE;

    const rows = getRecentPosts().filter((post) => !post.archive).slice(0, 5).map((post) => {
        const key = post.slug + (isEn ? '-en' : '-pt');
        return `<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${key}">${post.title[lang]}</a></li>`;
    }).join("");

    const allPost = isEn ? 'all-en' : 'all-pt';
    const more = isEn ? MORE_EN : MORE_PT;

    document.getElementById("blogs-list").innerHTML = `<ul>${rows}<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${allPost}">${more}</a></li></ul>`;
};

const renderGames = (lang) => {
    const isEn = lang === sidebarEnglishTag;
    document.getElementById("games-title").textContent = isEn ? GAMES_TITLE_EN : GAMES_TITLE_PT;

    const post = isEn ? 'games-en' : 'games-pt';
    const more = isEn ? MORE_EN : MORE_PT;
    const rows = top5ByStars(getItems('games')).map(([title, rating]) => starsRow(title, rating, lang)).join("");

    document.getElementById("games-list").innerHTML = `<ul>${rows}<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${post}">${more}</a></li></ul>`;
};

const renderBooks = (lang) => {
    const isEn = lang === sidebarEnglishTag;
    document.getElementById("books-title").textContent = isEn ? BOOKS_TITLE_EN : BOOKS_TITLE_PT;

    const post = isEn ? 'books-en' : 'books-pt';
    const more = isEn ? MORE_EN : MORE_PT;
    const rows = top5ByStars(getItems('books')).map(([title, rating]) => starsRow(title, rating, lang)).join("");

    document.getElementById("books-list").innerHTML = `<ul>${rows}<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${post}">${more}</a></li></ul>`;
};

const renderSidebar = (lang) => {
    renderContact(lang);
    renderBlogsBox(lang);
    renderGames(lang);
    renderBooks(lang);
};
