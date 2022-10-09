class Book {
    constructor(title, author, year, pages, read) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.pages = pages;
        this.read = read;
    }
    
    // ids a book by author-title
    getKey() {
        return this.author.concat(this.title).replace(/\s+/g, '').toLowerCase();
    }

    // indicates the values to display in card creation, reverse ordered
    getAllInfo() {
        return new Array(
            this.pages,
            this.year,
            this.author,
            this.title);
    }

    // Sets the footer element of a card with bindings
    makeCardFoot(element) {
        const foot1 = document.createElement('p');
        element.classList.add((this.read) ? 'read' : 'unread');
        foot1.textContent = (this.read) ? 'FINISHED' : 'UNREAD';
        // binds switching states of book
        foot1.addEventListener('click', (e) => {
            element.classList.toggle('read');
            element.classList.toggle('unread');
            this.read = !this.read;
            foot1.textContent = (element.classList.contains('read')) ? "FINISHED" : "UNREAD";
        })
        const foot2 = document.createElement('img');
        foot2.setAttribute('src', './ico/delete.svg');
        foot2.setAttribute('id', `${this.getKey()}`);
        foot2.classList.add('hide');
        element.appendChild(foot1);
        element.appendChild(foot2);
    }

    // Returns a card element for this book
    makeCard() {
        const card = document.createElement('div');
        card.classList.add('card');
        const bookInfo = this.getAllInfo();
        const toAdd = new Array('div', 'p', 'p', 'h4', 'h3');
        while (toAdd.length != 0) {
            const element = document.createElement(toAdd.pop());
            if (toAdd.length === 0) {
                this.makeCardFoot(element);
            }
            else { 
                element.textContent = bookInfo.pop();
            }
            card.addEventListener('mouseover', (e) => {
                document.getElementById(`${this.getKey()}`).classList.remove('hide');
            })
            card.addEventListener('mouseout', (e) => {
                document.getElementById(`${this.getKey()}`).classList.add('hide');
            })
            card.appendChild(element);
        }
        return card
    }
}

class Library {
    constructor() {
        this.stacks = new Map();
    }

    // add book entry to library and returns its keyvalue
    addBook(book) {
        this.stacks.set(book.getKey(), book);
    }
    
    hasBook(key) {
        return this.stacks.has(key);
    }

    removeBook(key) {
        this.stacks.delete(key);
    }
}

const library = new Library();

document.querySelector('#booker').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector('#booker'));
    const value = [...formData.entries()];
    const book = new Book(value[0][1], value[1][1], value[2][1], value[3][1], (value.length == 5))
    if (!library.hasBook(book.getKey())) {
        library.addBook(book);
        const card = book.makeCard();
        card.querySelector('img').addEventListener('click', () => {
            library.removeBook(`${book.getKey()}`);
            card.remove();
        })
        document.getElementById('shelf').appendChild(card);
    }
    document.querySelector('#booker').reset();
})