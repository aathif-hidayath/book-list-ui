const {fetchAll, showError} = require("./shared");
const {addBookToDom} = require("./book");
const addAuthorFormElement = document.querySelector(".author-form");
const bookListElement= document.querySelector('.books-list');
const addAuthorButton = document.querySelector('.add-author-btn');

const displayAuthorForm = () => {
  addAuthorFormElement.classList.remove("hidden");
  addAuthorButton.classList.remove("bg-amber-400");
  addAuthorButton.classList.add("bg-gray-200");
}

const hideAuthorForm = () => {
  addAuthorFormElement.classList.add("hidden");
  addAuthorButton.classList.add("bg-amber-400");
  addAuthorButton.classList.remove("bg-gray-200");
}

function getBookElement(book) {
  const bookElement = document.createElement('div');
  bookElement.classList.add('flex', "flex-col", 'justify-start', 'items-start', 'p-2', 'border', 'border-gray-200');
  bookElement.innerHTML = `
      <span class="flex flex-col justify-start items-start">
        <span class="book-title text-lg font-bold">${book.name}</span>
        <span class="book-price text-gray-500">${book.price}</span>
      </span>
    `;

  return bookElement;
}

async function editAuthor({_id, name}, authorElement, addAuthorFormElement) {
  const newAddForm = addAuthorFormElement.cloneNode(true);
  newAddForm.classList.remove('hidden');
  authorElement.append(newAddForm);
  const nameElement = newAddForm.querySelector('input[name="title"]');
  const saveButton = newAddForm.querySelector('.save-author-submit-btn');
  const loader = newAddForm.querySelector('.loader');
  const cancelButton = newAddForm.querySelector('.cancel-author-form-btn');

  nameElement.value = name;

  saveButton.innerHTML = 'Update';

  saveButton.addEventListener('click', async function (){

    loader.classList.remove('hidden');

    const updatedAuthor = {
      name: nameElement.value,
    };

    await fetch('https://books-api-two.vercel.app/api/author/' + _id, {
      method: 'PUT',
      body: JSON.stringify(updatedAuthor),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    loader.classList.add('hidden');
    await fetchAll('author', addAuthorToDom, addAuthorFormElement);
  });

  cancelButton.addEventListener('click', function () {
    newAddForm.remove();
  })

}

async function deleteAuthor({_id}, addAuthorFormElement) {
  if(confirm("You are want to delete this author?")) {
    try {
      await fetch('https://books-api-two.vercel.app/api/author/' + _id,  {
        method: 'DELETE',

      });
      await fetchAll('author', addAuthorToDom, addAuthorFormElement);
    }catch (e) {
      console.log('Error: ', e);
    }
  }
}

async function viewAuthor(author, authorElement) {
  const viewButton = authorElement.querySelector('.view-btn');
  viewButton.innerHTML = 'Loading...';

  try {
    const response = await fetch(`https://books-api-two.vercel.app/api/author/${author._id}`);
    const data = await response.json();

    if(Array.isArray(data.books) && data.books.length) {
      data.books.forEach(book => {
        const bookListElement = getBookElement(book);
        authorElement.appendChild(bookListElement);
      })
    }
  }catch(e) {
    console.log(e)
  }finally {
    viewButton.innerHTML = 'View';
  }
}

function addAuthorToDom(author) {
  if(bookListElement) {
    const authorElement = document.createElement('li');
    const editAuthorButton = document.createElement('button');
    const viewButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const buttonWrapperElement = document.createElement('div');

    editAuthorButton.innerHTML = 'Edit';
    viewButton.innerHTML = 'View';
    deleteButton.innerHTML = 'Delete';

    viewButton.classList.add('view-btn');

    editAuthorButton.classList.add('text-sm', 'underline');
    viewButton.classList.add('text-sm', 'underline');
    deleteButton.classList.add('text-sm', 'underline', "text-red-500");

    authorElement.classList.add('flex', "flex-col", 'justify-start', 'items-start', 'p-2', 'border', 'border-gray-200');

    buttonWrapperElement.classList.add('flex', 'gap-2', 'items-center');

    authorElement.innerHTML = `
      <span class="flex flex-col justify-start items-start">
        <span class="book-title text-lg font-bold">${author.name}</span>
      </span>
    `;

    buttonWrapperElement.appendChild(editAuthorButton);
    buttonWrapperElement.appendChild(viewButton);
    buttonWrapperElement.appendChild(deleteButton);

    authorElement.appendChild(buttonWrapperElement);

    editAuthorButton.addEventListener('click', editAuthor.bind(null, author, authorElement, addAuthorFormElement));
    deleteButton.addEventListener('click', deleteAuthor.bind(null, author, addAuthorFormElement));
    viewButton.addEventListener('click', viewAuthor.bind(null, author, authorElement));
    return authorElement;
  }
}

async function createNewAuthor(button, listAllAuthorsButton) {

  const originalLabel = button.innerHTML;

  try {
    const nameElement = addAuthorFormElement.querySelector('input[name="title"]');
    const loader = addAuthorFormElement.querySelector('.loader');

    if(!nameElement.value) {
      return;
    }

    button.innerHTML = 'Saving...';

    loader.classList.remove('hidden');

    const newAuthor = {
      name: nameElement.value,
    };

    await fetch('https://books-api-two.vercel.app/api/author/', {
      method: 'POST',
      body: JSON.stringify(newAuthor),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    loader.classList.add('hidden');
    await fetchAll('author', addAuthorToDom, listAllAuthorsButton);
  }catch {
    showError()
  }finally {
    button.innerHTML = originalLabel
  }
}

function toggleAuthorFormVisible() {
  if(addAuthorButton.classList.contains("bg-amber-400")) {
    displayAuthorForm()
  }else {
    hideAuthorForm()
  }
}

module.exports = { displayAuthorForm, hideAuthorForm, addAuthorToDom, createNewAuthor, toggleAuthorFormVisible }
