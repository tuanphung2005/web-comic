opened = false;

indicator = document.querySelector("#indicator");

let currentPage = 0;
let currentComic = null;

const comicList = [
    'media/comic/test-comic/test-comic.json',

];

document.querySelector("#top-bar button").addEventListener("click", function() {
    if (opened) {
        opened = false;
        indicator.innerHTML = ">";
    } else {
        opened = true;
        indicator.innerHTML = "<";
    }
    document.querySelector("#side-bar").classList.toggle("open");
});

document.addEventListener("click", function(event) {
    const sidebar = document.querySelector("#side-bar");
    const target = event.target;
    if (opened && !sidebar.contains(target) && target !== document.querySelector("#top-bar button")) {
        opened = false;
        indicator.innerHTML = ">";
        sidebar.classList.remove("open");
    }
});

function loadComicData(comicPath) {
    return fetch(comicPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function loadAllComics(comicPaths) {
    Promise.all(comicPaths.map(loadComicData)).then(comicsData => {
        updateSidebar(comicsData);
    });
}

function updateSidebar(comicData) {
    const sidebar = document.querySelector('#side-bar ul');
    comicData.forEach(comic => {
        const li = document.createElement('li');
        li.className = 'element-wraper';
        li.innerHTML = `
            <a href="#" class="comic-side-bar">
                <span class="author-side-bar">${comic.author}</span>
                <span class="comic-name-side-bar">${comic.name}</span>
            </a>
        `;
        li.querySelector('.comic-side-bar').addEventListener('click', (e) => {
            e.preventDefault();
            displayComic(comic);
        });
        sidebar.appendChild(li);
    });
}

function updateComicViewer() {
    const comicViewer = document.querySelector('#comic');
    if (currentComic && currentComic.images.length > 0) {
        comicViewer.src = currentComic.images[currentPage].url;
        comicViewer.alt = currentComic.name;
        document.querySelector('#page-num').textContent = currentPage + 1;
    }
}

function nextPage() {
    if (currentComic && currentPage < currentComic.images.length - 1) {
        currentPage++;
        updateComicViewer();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        updateComicViewer();
    }
}

function firstPage() {
    currentPage = 0;
    updateComicViewer();
}

function lastPage() {
    if (currentComic) {
        currentPage = currentComic.images.length - 1;
        updateComicViewer();
    }
}

function displayComic(comic) {
    currentComic = comic;
    currentPage = 0;
    preloadImages(comic.images.map(image => image.url)).then(() => {
        updateComicViewer();
    });
}

function preloadImages(urls) {
    const loadPromises = urls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    });

    return Promise.all(loadPromises);
}

loadAllComics(comicList);



