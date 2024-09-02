async function fetchAll (endPoint, listItemProviderFunction, button){

  const originalLabel = button.innerHTML;
  button.innerHTML = 'Loading...';
  try {
    const listElement= document.querySelector('.books-list');
    const response = await fetch(`https://books-api-two.vercel.app/api/${endPoint}/`);
    const list = await response.json();
    if (Array.isArray(list)) {
      listElement.innerHTML = '';
      list.forEach(item => {
        const element = listItemProviderFunction(item);
        listElement.appendChild(element);
      });
    }
  }catch (e) {
    showError()

  }finally {
    button.innerHTML = originalLabel
  }
}

async function listAllAuthors() {

  const selectElement = document.createElement('select');
  selectElement.setAttribute('name', 'author');
  selectElement.classList.add("author-list");
  try {
    const response = await  fetch('https://books-api-two.vercel.app/api/author');
    const data = await response.json();
    data.forEach(({_id, name}) => {
      const optionElement = document.createElement('option');
      optionElement.setAttribute('value', _id);
      optionElement.innerHTML = name;
      selectElement.appendChild(optionElement);
    });
    return selectElement;
  }catch {
    return selectElement;
  }
}

function showError (message =  "Something went wrong!") {
  const errorElement = document.createElement('div');
  const notificationsElement = document.querySelector(".notifications")
  notificationsElement.appendChild(errorElement)
  errorElement.innerHTML = message;
  errorElement.classList.add("p-2", "mt-2", "bg-amber-200", "border-amber-600", "border");
  setTimeout(() => {
    errorElement.remove()
  }, 3000)
}

module.exports = {
  fetchAll,
  listAllAuthors,
  showError
};


