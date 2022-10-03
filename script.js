const library = new Map();

function Book(title, author, year, pages, read) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.pages = pages;
    this.read = read;
}

function getKey(form) {
    return form[1][1].concat(form[0][1]).replace(/\s+/g, '').toLowerCase();
}

Book.prototype.getAllInfo = function() {
    return new Array(this.pages,
        this.year,
        this.author,
        this.title);
}

// add book entry to library and returns its keyvalue
function addBook(key, title, author, year, pages, read) {
    const book = new Book(title, author, year, pages, read);
    library.set(key, book);
    return key;
}

// Sets the footer element of a card with bindings
function makeCardFoot(element, key, card) {
    const book = library.get(key);
    const foot1 = document.createElement('p');
    element.classList.add((book.read) ? 'read' : 'unread');
    foot1.textContent = (book.read) ? 'FINISHED' : 'UNREAD';
    foot1.addEventListener('click', (e) => {
        element.classList.toggle('read');
        element.classList.toggle('unread');
        book.read = !book.read;
        foot1.textContent = (element.classList.contains('read')) ? "FINISHED" : "UNREAD";
    })
    const foot2 = document.createElement('img');
    foot2.setAttribute('src', './ico/delete.svg');
    foot2.setAttribute('id', `${key}`);
    foot2.classList.add('hide');
    foot2.addEventListener('click', (e) => {
        library.delete(`${key}`);
        card.remove();
        console.log(library.size);
    })
    element.appendChild(foot1);
    element.appendChild(foot2);
}

// Creates a new card element and adds it to the shelf area
function addCard(book, bookKey) {
    const card = document.createElement('div');
    card.classList.add('card');
    const bookInfo = book.getAllInfo();
    const toAdd = new Array('div', 'p', 'p', 'h4', 'h3');
    while (toAdd.length != 0) {
        const element = document.createElement(toAdd.pop());
        if (toAdd.length === 0) {
            makeCardFoot(element, bookKey, card);
        }
        else { 
            element.textContent = bookInfo.pop();
        }
        card.addEventListener('mouseover', (e) => {
            document.getElementById(`${bookKey}`).classList.remove('hide');
        })
        card.addEventListener('mouseout', (e) => {
            document.getElementById(`${bookKey}`).classList.add('hide');
        })
        card.appendChild(element);
    }
    document.getElementById('shelf').appendChild(card);
}

// binding for submission
document.querySelector('#booker').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector('#booker'));
    const value = [...formData.entries()];
    const key = getKey(value);
    if (!library.has(key)) {
        const bookKey = addBook(key, value[0][1], value[1][1], value[2][1], value[3][1], (value.length == 5));
        addCard(library.get(bookKey), bookKey);
    }
    document.querySelector('#booker').reset();
})

