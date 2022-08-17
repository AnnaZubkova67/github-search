function elementCreation(tagName, className, place) {
    let newElement = document.createElement(tagName);
    newElement.classList.add(className)
    newElement = place.appendChild(newElement)
    return newElement;
}

const app = document.querySelector('.app');
const title = elementCreation('hi', 'app__title', app);
title.textContent = 'Github search repositories';
const entryField = elementCreation('input', 'app__input', app);
const olRepo = elementCreation('ol', 'app__olRepo', app);
const olFavorites = elementCreation('ol', 'app__olFavorites', app);

const debounce = (fn, debounceTime) => {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, debounceTime)
    }
};

function serverCall() {
    olRepo.innerHTML = '';
    const data = entryField.value;
    if (!data) {
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${data}`)
        .then(response => response.json())
        .then(repositories => {
            let countElement = 0;

            repositories.items.forEach((elem) => {

                if (elem.name.includes(data) && countElement < 5 && data) {
                    const list = elementCreation('li', 'app__listRepositories', olRepo);
                    list.textContent = elem.name;
                    countElement++;

                    list.addEventListener('click', () => {
                        entryField.value = '';
                        olRepo.innerHTML = '';
                        const favoritesList = elementCreation('li', 'app__favoritesList', olFavorites);
                        favoritesList.innerText = `Name: ${elem.name}
                        Owner: ${elem.owner.login}
                        Stars: ${elem.stargazers_count}`;
                        const buttonClose = elementCreation('button', 'button', favoritesList);
                        buttonClose.textContent = 'X';

                        buttonClose.addEventListener('click', () => {
                            let elt = buttonClose.closest('li');
                            elt.remove();
                        })
                    })
                }
            })


        }).catch(e => console.log(e.message = 'Не удалось выполнить запрос'));
}

const request = debounce(serverCall, 500);
entryField.addEventListener('keydown', request);








