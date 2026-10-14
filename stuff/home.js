const DOGS_BANNER_HTML = `<div id="tralha" style="display:none" class="aspect-video w-full overflow-hidden">
    <img class="w-full h-full object-cover" src="assets/tralha.jpeg"
        alt="um dos meus cachorrinhos / one of my dogs" />
</div>
<div id="treco" style="display:none" class="aspect-video w-full overflow-hidden">
    <img class="w-full h-full object-cover" src="assets/treco.png"
        alt="um dos meus cachorrinhos / one of my dogs" />
</div>
<div id="tirulico" style="display:none" class="aspect-video w-full overflow-hidden">
    <img class="w-full h-full object-cover" src="assets/tirulico.png"
        alt="um dos meus cachorrinhos / one of my dogs" />
</div>`;

const bootHome = () => {
    renderShell({
        homeHref: 'index.html',
        langFn: 'showContent',
        bannerHtml: DOGS_BANNER_HTML,
        mainHtml: '<div id="home-content" class="flex-1 min-w-0"></div>',
    });
    return firstLoad();
};

const STACK_LIST_HTML = `<ul>
    <li>* typescript, react, sql, nosql, web, mobile </li>
    <li>* godot engine, cursor, claude code, open code</li>
    <li>* AI first development</li>
</ul>`;

const homeTemplate = (lang) => `<div>
    <p>${t(lang, 'homeP1')}
    </p>
    <br />
    <p>${t(lang, 'homeP2')}
    </p>
    <br />
    <div>
        <span class="font-bold">${t(lang, 'stack')}</span>
        <div id="stack-list">${STACK_LIST_HTML}</div>
    </div>
</div>`;

const firstLoad = async () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const lang = localStorage.getItem("lang");
    getRandomDog()

    if (lang) {
        await showContent(lang)
    } else {
        await showContent(window.portugueseTag)
    }
}

const DOGS = ["tralha", "treco", "tirulico"];

const getRandomDog = () => {
    const stored = localStorage.getItem("dogCounter");
    const index = stored == null ? 0 : (+stored + 1) % DOGS.length;
    localStorage.setItem("dogCounter", index);
    const shown = document.getElementById(DOGS[index]) || document.getElementById(DOGS[0]);
    shown.style.display = "block";
}

const showContent = async (lang) => {
    localStorage.setItem("lang", lang);

    try {
        await ensureDataLoaded();
        const content = homeTemplate(lang);
        document.getElementById("home-content").innerHTML = content;

        renderSidebar(lang);

        document.getElementById("content").style.opacity = 1;
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Erro ao carregar:', error);
        window.location.href = '/404.html';
    }
}
