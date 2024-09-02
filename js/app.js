import {fetchAll} from "./shared";
import {addBookToDom, createNewBook, toggleBookFormVisible} from "./book";
import {addAuthorToDom, createNewAuthor, toggleAuthorFormVisible} from "./author";

const listBooksButton = document.querySelector('.fetch-books-btn');
const listAllAuthorsButton = document.querySelector('.fetch-authors-btn');


listBooksButton.addEventListener('click', fetchAll.bind(null, 'book', addBookToDom, listBooksButton));
listAllAuthorsButton.addEventListener('click', fetchAll.bind(null, 'author', addAuthorToDom, listAllAuthorsButton));

const addBookButton = document.querySelector('.add-book-btn');
const addAuthorButton = document.querySelector('.add-author-btn');

const cancelBookButton = document.querySelector('.save-book-cancel-btn');
const cancelAuthorButton = document.querySelector('.cancel-author-form-btn');

addBookButton.addEventListener('click', toggleBookFormVisible);
addAuthorButton.addEventListener('click', toggleAuthorFormVisible);
cancelBookButton.addEventListener("click", toggleBookFormVisible);
cancelAuthorButton.addEventListener("click", toggleAuthorFormVisible);

const saveBookButton = document.querySelector(".save-book-submit-btn");
saveBookButton.addEventListener("click", createNewBook.bind(null, saveBookButton, listBooksButton));

const saveAuthorButton = document.querySelector(".save-author-submit-btn");
saveAuthorButton.addEventListener("click", createNewAuthor.bind(null, saveAuthorButton, listAllAuthorsButton));
