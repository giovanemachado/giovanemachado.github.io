const POSTS = {};

let postsRegistered = false;

const bootBlog = () => {
    renderShell({
        homeHref: '../index.html',
        langFn: 'showBlogList',
        bannerHtml: '',
        mainHtml: `<div class="flex-1 min-w-0">
            <div id="post-content"></div>
        </div>`,
    });
    return firstLoadBlog();
};

const renderArchiveBody = (data, lang) => {
    const rows = getRecentPosts()
        .map((post) => {
            const key = post.slug + (lang === window.englishTag ? '-en' : '-pt');
            return `<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${key}">${post.title[lang]} (${post.date})</a></li>`;
        }).join("\n        ");
    return `<div>\n    <h2 class="text-xl font-bold">${data.title[lang]}</h2>\n    <p class="opacity-70">${data.date}</p>\n    <br />\n    <p>${data.intro[lang]}</p>\n    <br />\n    <ul>\n        ${rows}\n    </ul>\n</div>`;
};

const renderPostBody = (data, lang) => {
    if (data.archive) return renderArchiveBody(data, lang);
    const rows = sortByStars(data.items || []).map(([title, rating]) => starsRow(title, rating, lang)).join("\n        ");
    const list = rows ? `<br />\n    <ul>\n        ${rows}\n    </ul>` : '';
    return `<div>\n    <h2 class="text-xl font-bold">${data.title[lang]}</h2>\n    <p class="opacity-70">${data.date}</p>\n    <br />\n    <p>${data.intro[lang]}</p>${list}\n</div>`;
};

const registerPost = (data) => {
    for (const lang of [window.portugueseTag, window.englishTag]) {
        const key = data.slug + (lang === window.englishTag ? '-en' : '-pt');
        POSTS[key] = renderPostBody(data, lang);
    }
};

const ensurePostsRegistered = () => {
    if (postsRegistered) return;
    postsRegistered = true;
    const seen = new Set();
    (window.POSTS_DATA || []).forEach((data) => {
        if (seen.has(data.slug)) return;
        seen.add(data.slug);
        registerPost(data);
    });
};

const counterpartOf = (key, lang) => {
    const match = /^(.*)-(pt|en)(\.html)?$/.exec(key || '');
    if (!match) return null;
    return match[1] + (lang === window.englishTag ? '-en' : '-pt');
}

const normalizePostKey = (key) => {
    if (!key) return null;
    if (POSTS[key]) return key;
    const withoutExt = key.replace(/\.html$/, '');
    if (POSTS[withoutExt]) return withoutExt;
    return null;
}

const goNotFound = () => {
    window.location.href = '/404.html';
}

const firstLoadBlog = async () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    await ensureDataLoaded();
    ensurePostsRegistered();
    const params = new URLSearchParams(window.location.search);
    const post = params.get("post");

    if (post) {
        await showPost(post, { updateUrl: false });
    } else {
        const lang = params.get("lang") || localStorage.getItem("lang") || window.portugueseTag;
        await showBlogList(lang, { updateUrl: false });
    }

    document.getElementById("content").style.opacity = 1;
}

const showBlogList = async (lang, opts = {}) => {
    await ensureDataLoaded();
    ensurePostsRegistered();
    localStorage.setItem("lang", lang);

    const currentPost = new URL(window.location).searchParams.get("post");
    let nextPost = null;

    try {
        renderSidebar(lang);
        attachPostClickHandler();

        if (!currentPost) {
            document.getElementById("post-content").innerHTML = '';
        } else {
            const counterpartKey = normalizePostKey(counterpartOf(currentPost, lang));
            if (counterpartKey) {
                document.getElementById("post-content").innerHTML = POSTS[counterpartKey];
                nextPost = counterpartKey;
            } else {
                goNotFound();
                return;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar:', error);
        goNotFound();
        return;
    }

    document.getElementById("content").style.opacity = 1;
    window.scrollTo(0, 0);

    if (opts.updateUrl !== false) {
        const url = new URL(window.location);
        if (nextPost) {
            url.searchParams.set("post", nextPost);
        } else {
            url.searchParams.delete("post");
        }
        url.searchParams.set("lang", lang);
        window.history.replaceState({}, '', url);
    }
}

const showPost = async (key, opts = {}) => {
    await ensureDataLoaded();
    ensurePostsRegistered();

    const postKey = normalizePostKey(key);
    if (!postKey) {
        console.error('Erro ao carregar: unknown post ' + key);
        goNotFound();
        return;
    }
    // The key suffix wins: display language follows the post, not stored state.
    const lang = langOfKey(postKey);
    localStorage.setItem("lang", lang);

    try {
        renderSidebar(lang);
        attachPostClickHandler();
        document.getElementById("post-content").innerHTML = POSTS[postKey];
        document.getElementById("content").style.opacity = 1;
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Erro ao carregar:', error);
        goNotFound();
        return;
    }

    if (opts.updateUrl !== false) {
        const url = new URL(window.location);
        url.searchParams.set("post", postKey);
        url.searchParams.set("lang", lang);
        window.history.replaceState({}, '', url);
    }
}

const handlePostClick = (event) => {
    const anchor = event.target.closest('a[href*="post="]');
    if (!anchor) return;
    const url = new URL(anchor.getAttribute("href"), window.location.href);
    const post = url.searchParams.get("post");
    if (!post) return;
    event.preventDefault();
    showPost(post);
}

const attachPostClickHandler = () => {
    document.onclick = handlePostClick;
}
