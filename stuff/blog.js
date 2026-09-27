const portugueseTag = 'pt-br'
const englishTag = 'en-us'

const strings = {
    'pt-br': {
        postsLabel: 'posts:',
    },
    'en-us': {
        postsLabel: 'posts:',
    }
}

const currentLang = () => localStorage.getItem("lang") || portugueseTag

const fetchOrThrow = async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + path);
    return response.text();
}

// `hello-pt.html` <-> `hello-en.html`. Returns null when the path
// doesn't follow the `<slug>-<lang>.html` convention.
const counterpartOf = (path, lang) => {
    const match = /^(.*)-(pt|en)\.html$/.exec(path || '');
    if (!match) return null;
    return match[1] + (lang === englishTag ? '-en.html' : '-pt.html');
}

const goNotFound = () => {
    window.location.href = '/404.html';
}

const firstLoadBlog = async () => {
    // BLOG DISABLED: redirect all direct blog URLs to 404; delete these 2 lines to re-enable blog
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

    const fileName = lang === englishTag ? 'posts-en.html' : 'posts-pt.html';
    const currentPost = new URL(window.location).searchParams.get("post");
    let nextPost = null;

    document.getElementById("posts-label").textContent = strings[lang].postsLabel;

    try {
        document.getElementById("posts-list").innerHTML = await fetchOrThrow(fileName);
        attachPostsClickHandler();

        // Switching language loads the same post in the other language.
        const counterpart = counterpartOf(currentPost, lang);
        if (counterpart) {
            try {
                document.getElementById("post-content").innerHTML = await fetchOrThrow(counterpart);
                nextPost = counterpart;
            } catch (postError) {
                console.error('Erro ao carregar:', postError);
                goNotFound();
                return;
            }
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

const showPost = async (path, opts = {}) => {
    const lang = currentLang();

    try {
        document.getElementById("post-content").innerHTML = await fetchOrThrow(path);
        document.getElementById("post-content").scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Erro ao carregar:', error);
        goNotFound();
        return;
    }

    if (opts.updateUrl !== false) {
        const url = new URL(window.location);
        url.searchParams.set("post", path);
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
