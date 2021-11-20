// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI
class UI {
    static displayBooks() {        
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.getElementById('book-list') // grab list
        const row = document.createElement('tr') // create <tr> and add <td> to it
        row.innerHTML = `  
        <td>${book.title}</td>  
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        //append new <tr> to lsit
        list.appendChild(row)
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message))
        //grab container and element to target in this container
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        // inserts (div before form) before container is executed
        container.insertBefore(div, form);

        //vanish in 2 sec
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

}


// Store
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];        
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn == isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event Add Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    // validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger')
    } else {
        // instatiate book
        const book = new Book(title, author, isbn)

        // add book to UI
        UI.addBookToList(book);

        // add book to Store
        Store.addBook(book)

        // show succes message
        UI.showAlert('Book Added', 'success')
    
        // clear fields
        UI.clearFields();
    }

})

// Event Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {

    // show delete message
    UI.showAlert('Book Removed', 'success')   

    // remove book from UI
    UI.deleteBook(e.target) 
    
    // remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})


