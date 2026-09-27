var portugueseTag = window.portugueseTag || 'pt-br'
var englishTag = window.englishTag || 'en-us'

const POSTS = {};

const POSTS_META = [];

const strings = {
    'pt-br': {
        postsLabel: 'posts:',
    },
    'en-us': {
        postsLabel: 'posts:',
    }
}

const currentLang = () => localStorage.getItem("lang") || portugueseTag

const counterpartOf = (key, lang) => {
    const match = /^(.*)-(pt|en)(\.html)?$/.exec(key || '');
    if (!match) return null;
    return match[1] + (lang === englishTag ? '-en' : '-pt');
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

const renderPostsList = (lang) => {
    return `<ul>` + POSTS_META
        .filter((post) => post.lang === lang)
        .sort((a, b) => a.date < b.date ? 1 : -1)
        .map((post) => `<li>* <a class="underline" href="/posts/blog.html?lang=${lang}&post=${post.key}">${post.title} (${post.date})</a></li>`)
        .join('') + `</ul>`;
}

const firstLoadBlog = async () => {
    goNotFound();
    return;

    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang") || localStorage.getItem("lang") || portugueseTag;
    const post = params.get("post");

    await showBlogList(lang, { updateUrl: false });

    if (post) {
        await showPost(post, { updateUrl: false });
    } else {
        goNotFound();
        return;
    }

    document.getElementById("content").style.opacity = 1;
}

const showBlogList = async (lang, opts = {}) => {
    localStorage.setItem("lang", lang);

    const currentPost = new URL(window.location).searchParams.get("post");
    let nextPost = null;

    document.getElementById("posts-label").textContent = strings[lang].postsLabel;

    try {
        document.getElementById("posts-list").innerHTML = renderPostsList(lang);
        attachPostsClickHandler();

        const counterpartKey = normalizePostKey(counterpartOf(currentPost, lang));
        if (counterpartKey) {
            document.getElementById("post-content").innerHTML = POSTS[counterpartKey];
            nextPost = counterpartKey;
        } else {
            goNotFound();
            return;
        }
    } catch (error) {
        console.error('Erro ao carregar:', error);
        goNotFound();
        return;
    }

    document.getElementById("content").style.opacity = 1;

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
    const lang = currentLang();

    const postKey = normalizePostKey(key);
    if (!postKey) {
        console.error('Erro ao carregar: unknown post ' + key);
        goNotFound();
        return;
    }

    try {
        document.getElementById("post-content").innerHTML = POSTS[postKey];
        document.getElementById("post-content").scrollIntoView({ behavior: 'smooth', block: 'start' });
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

const handlePostsListClick = (event) => {
    const anchor = event.target.closest('a[href*="post="]');
    if (!anchor) return;
    const url = new URL(anchor.getAttribute("href"), window.location.href);
    const post = url.searchParams.get("post");
    if (!post) return;
    event.preventDefault();
    showPost(post);
}

const attachPostsClickHandler = () => {
    const listEl = document.getElementById("posts-list");
    if (!listEl) return;
    listEl.onclick = handlePostsListClick;
}
