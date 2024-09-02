// on clicking 'List' in the book button
const {fetchAll, listAllAuthors, showError} = require("./shared");

const addBookFormElement = document.querySelector(".book-form");
const bookListElement= document.querySelector('.books-list');
const addBookButton = document.querySelector(".add-book-btn");


async function editBook({_id, author, name, price}, bookElement) {
  const newAddForm = addBookFormElement.cloneNode(true);
  const authorList = await listAllAuthors();
  newAddForm.classList.remove('hidden');
  bookElement.append(newAddForm);
  const nameElement = newAddForm.querySelector('input[name="title"]');
  const priceElement = newAddForm.querySelector('input[name="price"]');
  const saveButton = newAddForm.querySelector('.save-book-submit-btn');
  const cancelButton = newAddForm.querySelector('.save-book-cancel-btn');

  const loader = newAddForm.querySelector('.loader');
  priceElement.after(authorList);
  nameElement.value = name;
  priceElement.value = price;
  authorList.value = author;
  saveButton.innerHTML = 'Update';

  saveButton.addEventListener('click', async function (){

    loader.classList.remove('hidden');

    const updatedBook = {
      name: nameElement.value,
      price: priceElement.value,
      ...(authorList && authorList.value ? { author: authorList.value} : {})
    };

    await fetch('https://books-api-two.vercel.app/api/book/' + _id, {
      method: 'PUT',
      body: JSON.stringify(updatedBook),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    loader.classList.add('hidden');
    await fetchAll('book', addBookToDom);
  });

  cancelButton.addEventListener('click', function () {
    newAddForm.remove();
  })
}

async function deleteBook({_id}) {

  if(confirm("You are want to delete this book?")) {
    try {
      await fetch('https://books-api-two.vercel.app/api/book/' + _id,  {
        method: 'DELETE',

      });
      await fetchAll('book', addBookToDom);
    }catch (e) {
      console.log('Error: ', e);
    }
  }
}

async function viewBook({_id}, bookElement) {
  const viewButton = bookElement.querySelector('.view-btn');
  viewButton.innerHTML = 'Loading...';
  try {
    const response = await fetch('https://books-api-two.vercel.app/api/book/' + _id);
    const _book = await response.json();
    const detailedBookElement = document.createElement('span');
    detailedBookElement.innerHTML = _book.author ? `Author: ${_book.author.name}` : "";

    bookElement.append(detailedBookElement);

  }catch(a) {
    console.log('Error: ', a);

  }finally {
    viewButton.innerHTML = 'View';
  }
}

function addBookToDom(book) {
  if(bookListElement) {
    const bookElement = document.createElement('li');

    const editButton = document.createElement('button');
    const viewButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    const buttonWrapperElement = document.createElement('div');

    buttonWrapperElement.appendChild(editButton);
    buttonWrapperElement.appendChild(viewButton);
    buttonWrapperElement.appendChild(deleteButton);

    viewButton.classList.add("view-btn");

    editButton.innerHTML = 'Edit';
    viewButton.innerHTML = 'View';
    deleteButton.innerHTML = 'Delete';

    editButton.addEventListener('click', editBook.bind(null, book, bookElement));
    deleteButton.addEventListener('click', deleteBook.bind(null, book));
    viewButton.addEventListener('click', viewBook.bind(null, book, bookElement));

    editButton.classList.add('text-sm', 'underline');
    viewButton.classList.add('text-sm', 'underline');
    deleteButton.classList.add('text-sm', 'underline', "text-red-500");

    bookElement.classList.add('flex', "flex-col", 'justify-start', 'items-start', 'p-2', 'border', 'border-gray-200');

    buttonWrapperElement.classList.add('flex', 'gap-2', 'items-center');

    bookElement.innerHTML = `
      <span class="flex flex-col justify-start items-start">
        <span class="book-title text-lg font-bold">${book.name}</span>
        <span class="book-price text-gray-500">${book.price}</span>
      </span>
    `;

    bookElement.appendChild(buttonWrapperElement);

    return bookElement;
  }
}

async function createNewBook(button, listBooksButton) {
  const originalLabel = button.innerHTML;
  const loader = addBookFormElement.querySelector('.loader');
 try {
   const nameElement = addBookFormElement.querySelector('input[name="title"]');
   const priceElement = addBookFormElement.querySelector('input[name="price"]');
   const authorElement = addBookFormElement.querySelector('select[name="author"]');

   if(!nameElement.value || !priceElement.value) {
     return;
   }

   button.innerHTML = 'Saving...';

   loader.classList.remove('hidden');

   const newBook = {
     name: nameElement.value,
     price: priceElement.value,
     ...(authorElement && authorElement.value ? { author: authorElement.value} : {})
   };

   await fetch('https://books-api-two.vercel.app/api/book/', {
     method: 'POST',
     body: JSON.stringify(newBook),
     headers: {
       'Content-Type': 'application/json'
     }
   });

   await toggleBookFormVisible();
   await fetchAll('book', addBookToDom, listBooksButton);
 }catch (e) {
   console.log(e)
   showError("Saving book failed");
 }finally {
   button.innerHTML = originalLabel; //restore
   loader.classList.add('hidden');
 }
}

async function displayBookForm(){
  const listAuthors = await listAllAuthors();
  const priceInput = addBookFormElement.querySelector('input[name="price"]');
  priceInput.after(listAuthors);
  addBookFormElement.classList.remove('hidden');
  addBookButton.classList.remove("bg-amber-400");
  addBookButton.classList.add("bg-gray-200");
  listAuthors.classList.add(".author-list")
}

function hideBookForm(){
  addBookFormElement.classList.add('hidden');
  const authorList = addBookFormElement.querySelector('.author-list');
  authorList.remove();
  addBookButton.classList.remove("bg-gray-200");
  addBookButton.classList.add("bg-amber-400");
}

async function toggleBookFormVisible() {
  if(addBookButton.classList.contains("bg-amber-400")) {
    await displayBookForm()
  }else {
    hideBookForm()
  }
}

module.exports = {
  addBookToDom,
  createNewBook,
  toggleBookFormVisible
}
