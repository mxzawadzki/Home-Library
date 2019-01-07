class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list'),
          row = document.createElement('div');

    function generateRandomCover() {
      function getRandomNumber(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
      let bookCover = getRandomNumber(4);
      let cover;
      switch (bookCover) {
        case 0:
          cover = '📕';
          break;
        case 1:
          cover = '📗';
          break;
        case 2:
          cover = '📘';
          break;
        case 3:
          cover = '📙';
          break;
      }
      return cover;
    }
    let generateCover = generateRandomCover();

    row.innerHTML = `
      <div class="book-list__container">
        <div class="book-list__item">${generateCover} ${book.author}</div>
        <div class="book-list__item">${book.title}</div>
        <div class="book-list__item--delete"><a href="#" class="delete">X</a></div>
      </div>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div'),
          container = document.querySelector('.container'),
          form = document.querySelector('#book-form'),
          currentAlert = document.querySelector('.alert');
    if (!currentAlert) {
      div.className = `alert ${className}`;
      div.appendChild(document.createTextNode(message));
      container.insertBefore(div, form);
      setTimeout(function () {
        document.querySelector('.alert').remove();
      }, 3000);
    } else {
      currentAlert.textContent = '';
      currentAlert.className = `alert ${className}`;
      currentAlert.appendChild(document.createTextNode(message));
    }
  }
  

  deleteBook(target) {
     if(target.className === 'delete') {
       target.parentElement.parentElement.remove();
     }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
  }
}

class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function(book) {
      const ui = new UI;
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(title) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if(book.title === title)
      books.splice(index, 1);
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.getElementById('book-form').addEventListener('submit', function (e) {
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value;

  const book = new Book(title, author),
        ui = new UI();

  if (title === '' || author === '') {
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    ui.addBookToList(book);
    Store.addBook(book);
    ui.showAlert('Book Added!', 'success');
    ui.clearFields();
  }
  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book Removed!', 'success');
  e.preventDefault();
});