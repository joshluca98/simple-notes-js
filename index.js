const noteList = document.querySelector('.noteList');
const noteListItems = noteList.querySelectorAll('.noteItem')
const searchBar = document.querySelector('#noteListSearchInput')
const dropdownItems = document.querySelectorAll('.dropdown-item');
const saveButton = document.querySelector('#saveButton');
const updateButton = document.querySelector('.updateButton');
const viewportColumn = document.querySelector('#viewportColumn');

var currentdate = new Date();
var newNoteDate = (currentdate.getMonth()+1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear()

// Save new note to memory with all proper event listeners attached
function onCreateNote(e){
    newNoteTitle = document.querySelector('#newNoteTitle').value;
    newNoteContent = document.querySelector('#newNoteContent').value;
    
    const newNoteDiv = document.createElement('div');
    newNoteDiv.classList = 'd-flex justify-content-center align-items-center row bg-custom1 my-1 noteItem';
    newNoteDiv.innerHTML = `
        <div class="row d-flex justify-content-between align-items-center mt-3">
            <div class="col-8">
                <h6 class="itemTitle">${newNoteTitle}</h6>
            </div>
            <div class="col-auto text-end itemDate">
                ${newNoteDate}
            </div>
        </div>
        <div class="row">
            <div class="col-auto mt-2">
                <p class="itemBody">${newNoteContent}</p>
            </div>
        </div>
        <hr class="my-1"/>
        <div class="row mt-1 d-flex">
        <div class="row no-select">
            <ul class="fa-ul d-flex">
                <!-- <li class="fa-li"><i class="fa-solid fa-box-archive fa-fw button-hover-effect"></i></li> -->
                <li class="fa-li yellow-text"><i class="starButton fa-regular fa-star fa-lg fa-fw button-hover-effect"></i></li>
                <li class="fa-li trashButton"><i class="fa-solid fa-trash fa-fw button-hover-effect trash"></i></li>
                <!-- <li class="fa-li"><i class="fa-solid fa-ellipsis fa-fw button-hover-effect"></i></li> -->
            </ul>
        </div>
    `
    newNoteDiv.addEventListener('click', onNoteItemClick);

    noteList.appendChild(newNoteDiv);
}
saveButton.addEventListener('click', onCreateNote)

// Function to handle note selection and display in the viewport
function onNoteItemClick(e) {
    const clickedItem = e.currentTarget;
    const noteViewportTitle = document.querySelector('#noteViewportTitle');
    const noteViewportBody = document.querySelector('#noteViewportBody');
    const noteViewportDate = document.querySelector('#noteViewportDate');

    // Remove border from previously selected note if necessary
    const previousSelectedNote = document.querySelector('.noteItem.border');
    if (previousSelectedNote) {
        previousSelectedNote.classList.remove('border');
    }
    // Add border to the clicked note
    clickedItem.classList.add('border');

    // Update the viewport with the clicked note's information
    const clickedItemTitle = clickedItem.querySelector('.itemTitle');
    const clickedItemBody = clickedItem.querySelector('.itemBody');
    const clickedItemDate = clickedItem.querySelector('.itemDate');

    noteViewportTitle.innerHTML = clickedItemTitle.innerHTML;
    noteViewportBody.innerHTML = clickedItemBody.innerHTML;
    noteViewportDate.innerHTML = clickedItemDate.innerHTML;
}

// Function to update existing note
function updateNote() {
    const selectedNote = document.querySelector('.noteItem.border');

    const noteViewportBody = document.querySelector('#noteViewportBody');
    const noteViewportTitle = document.querySelector('#noteViewportTitle');
    const noteViewportDate = document.querySelector('#noteViewportDate');

    const editedNoteTitle = noteViewportTitle.innerHTML;
    const editedNoteContent = noteViewportBody.innerHTML;

    if (selectedNote) {
        const noteTitle = selectedNote.querySelector('.itemTitle');
        const noteBody = selectedNote.querySelector('.itemBody');
        const noteDate = selectedNote.querySelector('.itemDate');
        noteTitle.innerHTML = editedNoteTitle;
        noteBody.innerHTML = editedNoteContent;
        noteDate.innerHTML = newNoteDate;
        noteViewportDate.innerHTML = newNoteDate;
    }
}
updateButton.addEventListener('click', updateNote);


// Add event listener for bookmarking a note
noteList.addEventListener('click', e => {
    const target = e.target;
    if (target.classList.contains('starButton')) {
      if (target.classList.contains('fa-regular')) {
        target.classList.remove('fa-regular');
        target.classList.add('fa-solid');
      } else {
        target.classList.add('fa-regular');
        target.classList.remove('fa-solid');
      }
    }
});


// Add event listener for trash button functionality
noteList.addEventListener('click', e => {
const target = e.target;
if (target.classList.contains('trash')) {
    target.closest('.noteItem').remove();
}
});


// Add event listener to enable and disable the update button as necessary
document.addEventListener('click', e => {
  const isClickedInsideViewport = viewportColumn.contains(e.target);
  if (!isClickedInsideViewport) {
    updateButton.disabled = true;
  } else {
    updateButton.disabled = false;
  }
});


// Add event listener to enable search functionality upon user text input
searchBar.addEventListener('input', () => {
    const noteListItems = noteList.querySelectorAll('.noteItem')
    const searchTerm = searchBar.value.toLowerCase();

    noteListItems.forEach((item, index) => {
        if (searchTerm && item.textContent.toLowerCase().includes(searchTerm)){
            item.style.color = 'green';
        } else if (searchTerm && !(item.textContent.toLowerCase().includes(searchTerm))) {
            item.style.color = 'red';
        } else {
            item.style.color = 'white';
        } 
    });
})


// Sort note by date functionality
function sortNoteListItems() {
    const sortedItems = Array.from(noteListItems);
    console.log(sortedItems.length);
  
    if (this.textContent === 'Newest First') {
      sortedItems.sort((a, b) => new Date(b.querySelector('.itemDate').textContent) - new Date(a.querySelector('.itemDate').textContent));
    } else if (this.textContent === 'Oldest First') {
      sortedItems.sort((a, b) => new Date(a.querySelector('.itemDate').textContent) - new Date(b.querySelector('.itemDate').textContent));
    }
  
    // Remove all existing note items from the list
    while (noteList.firstChild) {
      noteList.firstChild.remove();
    }

    // Append the sorted note items to the list
    sortedItems.forEach(item => noteList.appendChild(item));
}
dropdownItems.forEach(item => item.addEventListener('click', sortNoteListItems));


// Add event listener for each existing item to show in viewport when clicked
noteListItems.forEach(item => {
    item.addEventListener('click', onNoteItemClick);
});
