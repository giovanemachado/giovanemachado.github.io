const portugueseTag = 'pt-br'
const englishTag = 'en-us'

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

        document.getElementById("content").style.opacity = 1;
    } catch (error) {
        console.error('Erro ao carregar:', error);
        window.location.href = '/404.html';
    }
}
