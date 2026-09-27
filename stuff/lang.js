const portugueseTag = 'pt-br'
const englishTag = 'en-us'

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

    let fileName = 'home-pt.html';
    // BLOG DISABLED: uncomment to re-enable blog on home
    // let postsFileName = 'posts/posts-pt.html';

    if (lang === englishTag) {
        fileName = 'home-en.html';
        // BLOG DISABLED: uncomment to re-enable blog on home
        // postsFileName = 'posts/posts-en.html';
    }

    try {
        // BLOG DISABLED: postsResponse + fetch(postsFileName) removed; restore to re-enable blog on home
        const [homeResponse, stackResponse, linksResponse] = await Promise.all([
            fetch(fileName),
            fetch('lists/stack.html'),
            fetch('lists/links.html')
        ]);
        for (const response of [homeResponse, stackResponse, linksResponse]) {
            if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + response.url);
        }
        const content = await homeResponse.text();
        const stackContent = await stackResponse.text();
        const linksContent = await linksResponse.text();
        // BLOG DISABLED: uncomment to re-enable blog on home
        // const postsContent = await postsResponse.text();
        document.getElementById("home-content").innerHTML = content;

        document.getElementById("stack-list").innerHTML = stackContent;
        document.getElementById("links-list").innerHTML = linksContent;
        // BLOG DISABLED: uncomment to re-enable blog on home
        // document.getElementById("posts-list").innerHTML = postsContent;

        // Mostrar o conteúdo na tela
        document.getElementById("content").style.opacity = 1;
    } catch (error) {
        console.error('Erro ao carregar:', error);
        window.location.href = '/404.html';
    }
}
