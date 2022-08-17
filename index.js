const app = document.querySelector('.app');

function elementCreation(tagName, className, place) {
    let newElement = document.createElement(tagName);
    newElement.classList.add(className)
    newElement = place.appendChild(newElement)
    return newElement;
}

const title = elementCreation('hi', 'app__title', app)
title.textContent = 'Github search repositories'
const entryField = elementCreation('input', 'app__input', app);
const olRepo = elementCreation('ol', 'app__olRepo', app)
const olFavorites = elementCreation('ol', 'app__olFavorites', app);

const debounce = (fn, debounceTime) => {
    let timer;
    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, debounceTime)
    }
};


function serverCall() {
    olRepo.innerHTML = '';
    const data = entryField.value

    fetch('https://api.github.com/repositories')
        .then(response => response.json())
        .then(repositories => {
            let countElement = 0;

            repositories.forEach((elem) => {

                if (elem.name.includes(data) && countElement < 5 && data) {
                    const list = elementCreation('li', 'app__listRepositories', olRepo);
                    list.textContent = elem.name
                    countElement++;

                    list.addEventListener('click', async () => {
                        entryField.value = '';
                        olRepo.innerHTML = '';
                        const stars = await fetch(`https://api.github.com/repos/${elem.owner.login}/${elem.name}/stargazers`)
                            .then((response) => response.json())
                            .then((stargazers) => stargazers.length);
                        const favoritesList = elementCreation('li', 'app__favoritesList', olFavorites);
                        favoritesList.innerText = `Name: ${elem.name}
                        Owner: ${elem.owner.login}
                        Stars: ${stars}`;
                        const buttonClose = elementCreation('button', 'button', favoritesList);
                        buttonClose.textContent = 'X';

                        buttonClose.addEventListener('click', () => {
                            let elt = buttonClose.closest('li')
                            elt.remove()
                        })
                    })
                }
            })

        })
}

const a = debounce(serverCall, 700)
entryField.addEventListener('keydown', a)








