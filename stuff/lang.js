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

    if (lang === englishTag) {
        fileName = 'home-en.html';
    }

    try {
        const response = await fetch(fileName);
        const content = await response.text();
        document.getElementById("home-content").innerHTML = content;

        // Mostrar o conteúdo na tela
        document.getElementById("content").style.opacity = 1;
    } catch (error) {
        console.error('Erro ao carregar:', error);
        document.getElementById("home-content").innerHTML = '<p>Erro ao carregar conteúdo</p>';
        document.getElementById("content").style.opacity = 1;
    }
}
