const LINKS_HTML = `<ul>
    <li>* <a class="underline" target="_blank" href="https://www.linkedin.com/in/giovanenolink">linkedin</a></li>
    <li>* <a class="underline" target="_blank" href="https://github.com/giovanemachado">github</a></li>
    <li>* <a class="underline" target="_blank" href="https://sangue1.itch.io">itch</a></li>
</ul>`;

const renderContact = (lang) => {
    document.getElementById("contact-title").textContent = t(lang, 'contact');
    document.getElementById("contact-list").innerHTML = LINKS_HTML;
};

const renderBlogsBox = (lang) => {
    document.getElementById("blogs-title").textContent = t(lang, 'blogs');

    const rows = getRecentPosts().filter((post) => !post.archive).slice(0, 5).map((post) => {
        const key = postKeyFor(post.slug, lang);
        return `<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${key}">${post.title[lang]}</a></li>`;
    }).join("");

    const more = t(lang, 'more');

    document.getElementById("blogs-list").innerHTML = `<ul>${rows}<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${postKeyFor('all', lang)}">${more}</a></li></ul>`;
};

const renderStarList = (slug, titleElId, listElId, titleKey, lang) => {
    document.getElementById(titleElId).textContent = t(lang, titleKey);

    const more = t(lang, 'more');
    const rows = top5ByStars(getItems(slug)).map(([title, rating]) => starsRow(title, rating, lang)).join("");

    document.getElementById(listElId).innerHTML = `<ul>${rows}<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${postKeyFor(slug, lang)}">${more}</a></li></ul>`;
};

const renderGames = (lang) => renderStarList('games', 'games-title', 'games-list', 'games', lang);

const renderBooks = (lang) => renderStarList('books', 'books-title', 'books-list', 'books', lang);

const renderSidebar = (lang) => {
    renderContact(lang);
    renderBlogsBox(lang);
    renderGames(lang);
    renderBooks(lang);
};
