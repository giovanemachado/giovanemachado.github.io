var portugueseTag = window.portugueseTag || 'pt-br'
var englishTag = window.englishTag || 'en-us'

const STACK_HTML = `<ul>
    <li>* typescript, react, sql, nosql, web, mobile </li>
    <li>* godot engine, cursor, claude code, open code</li>
    <li>* AI first development</li>
</ul>`;

const LINKS_HTML = `<ul>
    <li>* <a class="underline" target="_blank" href="https://www.linkedin.com/in/giovanenolink">linkedin.com/in/giovanenolink</a></li>
    <li>* <a class="underline" target="_blank" href="https://github.com/giovanemachado">github.com/giovanemachado</a></li>
    <li>* <a class="underline" target="_blank" href="https://sangue1.itch.io">sangue1.itch.io</a></li>
</ul>`;

const GAMES_TITLE_PT = `jogos que já joguei:`;
const GAMES_TITLE_EN = `games i've played:`;


const GAMES = [
    ["AOE4", 5],
    ["LOL", 4],
    ["rocket league", 5],
    ["SC2", 2],
    ["RE7", 3],
    ["RE8", 1],
    ["ryse son of rome", 1],
    ["hollow knight", 3],
    ["high on life", 5],
    ["nfs most wanted 05", 5],
    ["peak", 5],
    ["guild wars 2", 3],
    ["new wolrd", 2],
    ["aoe3", 3],
    ["cod 1", 5],
    ["valorant", 2],
    ["bf5", 2],
    ["bf6", 3],
    ["bf2042", 1],
    ["dead space", 2],
    ["cult of the lamb", 5],
    ["sea of thieves", 3],
    ["phasmophobia", 1],
    ["pubg", 3],
    ["rdr", 1],
    ["gta v", 4],
    ["gta sa", 4],
    ["gta vc", 3],
    ["the final station", 2],
    ["the forest", 3],
    ["hf2", 4],
    ["heroes and generals", 2],
    ["hellblade", 4],
    ["hellblade 2", 3],
    ["it takes two", 5],
    ["l4d2", 3],
    ["nfs u2", 3],
    ["nfs unbound", 3],
    ["sons of tf", 2],
    ["tf2", 3],
    ["the witcher 3", 5],
    ["a way out", 3],
    ["plague tale 1", 4],
    ["plague tale 2", 4],
    ["plague tale 3", 3],
    ["chivarly 2", 3],
    ["control", 5],
    ["wolfstein new order", 2],
    ["twd tell tale 1, 2, 3", 3],
    ["balatro", 5],
    ["herdling", 3]
];

const starsFor = (rating) => {
    const clamped = Math.min(5, Math.max(1, rating));
    return "★".repeat(clamped) + "☆".repeat(5 - clamped);
};

const renderGames = (lang) => {
    document.getElementById("games-title").textContent = lang === englishTag ? GAMES_TITLE_EN : GAMES_TITLE_PT;

    document.getElementById("games-list").innerHTML = `<ul>` + GAMES.map(([title, rating]) => {
        const stars = starsFor(rating);
        const ariaLabel = lang === englishTag ? `${rating} out of 5` : `${rating} de 5`;
        return `<li class="flex justify-between gap-2"><span>* ${title}</span><span class="whitespace-nowrap" title="${rating}/5" aria-label="${title}: ${ariaLabel}">${stars}</span></li>`;
    }).join("") + `</ul>`;
};

const HOME_PT = `<div>
    <p>eai 🤙, sou fullstack engineer desde 2019, gosto de passar tempo meu tempo livre com a minha família, ou jogando algo. vivo em uma cidade pequena de santa catarina - brasil, e trabalho remoto desde sempre.
    </p>
    <br />
    <p>minha experiência profissional inclui startups de diversas áreas (no brasil e nos estados unidos), trabalhando com aplicações para web e também mobile de maneira AI first. fora isso, ainda sou um aspirante a game dev/designer.
    </p>
    <br />
    <div>
        <span class="font-bold">minha stack:</span>
        <div id="stack-list"></div>
    </div>
    <br />
    <div>
        <span class="font-bold">links para falar comigo/ver o meu trabalho:</span>
        <div id="links-list"></div>
    </div>
</div>`;

const HOME_EN = `<div>
    <p> hey 🤙, i'm a fullstack engineer since 2019, i like to spend my free time with my family, or playing video games. i live in a small city in santa catarina - brazil, and i've been working remotely since forever.
    </p>
    <br />
    <p> my professional experience includes startups from various areas (in brazil and the united states), working with web and mobile applications in an AI first approach. besides that, i'm an aspiring game dev/designer.
    </p>
    <br />
    <div>
        <span class="font-bold">my stack:</span>
        <div id="stack-list"></div>
    </div>
    <br />
    <div>
        <span class="font-bold">links to contact me/see my work:</span>
        <div id="links-list"></div>
    </div>
</div>`;

const firstLoad = async () => {
    const lang = localStorage.getItem("lang");
    getRandomDog()

    if (lang) {
        await showContent(lang)
    } else {
        await showContent(portugueseTag)
    }
}

const getRandomDog = () => {
    const dogCounter = localStorage.getItem("dogCounter");
    let index = dogCounter

    if (dogCounter == null) {
        localStorage.setItem("dogCounter", 0);
        index = 0
    } else {
        localStorage.setItem("dogCounter", +index + 1);

        if (index >= 2) {
            localStorage.setItem("dogCounter", 0);
        }

        index++
    }

    switch (+index) {
        case 0:
            document.getElementById("tralha").style.display = "block";
            break;

        case 1:
            document.getElementById("treco").style.display = "block";
            break;

        case 2:
            document.getElementById("tirulico").style.display = "block";
            break;

        default:
            document.getElementById("tralha").style.display = "block";
            break;
    }
}

const showContent = async (lang) => {
    localStorage.setItem("lang", lang);

    try {
        const content = lang === englishTag ? HOME_EN : HOME_PT;
        document.getElementById("home-content").innerHTML = content;

        document.getElementById("stack-list").innerHTML = STACK_HTML;
        document.getElementById("links-list").innerHTML = LINKS_HTML;
        renderGames(lang);

        document.getElementById("content").style.opacity = 1;
    } catch (error) {
        console.error('Erro ao carregar:', error);
        window.location.href = '/404.html';
    }
}
