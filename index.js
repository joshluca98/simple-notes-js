const noteList = document.querySelector('.noteList');
const noteListItems = noteList.querySelectorAll('.noteItem')
const searchBar = document.querySelector('#noteListSearchInput')
const dropdownItems = document.querySelectorAll('.dropdown-item');
const saveButton = document.querySelector('#saveButton');
const updateButton = document.querySelector('#updateButton');
const cancelButton = document.querySelector('#cancelButton');
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

// Function to revert edits upon cancel button click
cancelButton.addEventListener('click', () => {
    const selectedNote = document.querySelector('.noteItem.border');
    if (selectedNote) {
      const noteViewportTitle = document.querySelector('#noteViewportTitle');
      const noteViewportBody = document.querySelector('#noteViewportBody');
      const noteTitle = selectedNote.querySelector('.itemTitle');
      const noteBody = selectedNote.querySelector('.itemBody');
      // Revert the note viewport content to the original note's content
      noteViewportTitle.innerHTML = noteTitle.innerHTML;
      noteViewportBody.innerHTML = noteBody.innerHTML;
    }
});


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


// Add event listener to enable and disable the update/cancel button as necessary
document.addEventListener('click', e => {
  const isClickedInsideViewport = viewportColumn.contains(e.target);
  if (!isClickedInsideViewport) {
    updateButton.disabled = true;
    cancelButton.disabled = true;
  } else {
    updateButton.disabled = false;
    cancelButton.disabled = false;
  }
});


// Add event listener to enable search functionality upon user text input
searchBar.addEventListener('input', () => {
    const noteListItems = noteList.querySelectorAll('.noteItem')
    const searchTerm = searchBar.value.toLowerCase().trim();

    noteListItems.forEach((item, index) => {
        if (searchTerm && item.textContent.toLowerCase().includes(searchTerm)){
            item.classList.remove('d-none');
            item.classList.add('d-flex');
        } else if (searchTerm && !(item.textContent.toLowerCase().includes(searchTerm))) {
            item.classList.remove('d-flex');
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
            item.classList.add('d-flex');
        } 
    });
})


// Sort note by date functionality
function sortNoteListItems() {
    const noteListItems = noteList.querySelectorAll('.noteItem')
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


// Function for settings menu popup to display
const settingsButton = document.querySelector('#settingsButton');
const settingsPopup = document.querySelector('#settingsPopup');
const twoColumnsRow = document.querySelector('#twoColumnsRow');
settingsButton.addEventListener('click', () => {
    console.log(settingsButton);
    if (settingsPopup.classList.contains('d-none')){
        settingsPopup.classList.remove('d-none');
        twoColumnsRow.classList.add('filter');
    } else {
        settingsPopup.classList.add('d-none');
        twoColumnsRow.classList.remove('filter');
    }
});

// Function to allow exiting settings menu by clicking outside the menu
const switchLabel = document.querySelector('#switchLabel');
document.addEventListener('click', (event) => {
    const isClickedInsidePopup = settingsPopup.contains(event.target);
    const isClickingSettings = settingsButton.contains(event.target);
    if (isClickedInsidePopup || settingsButton == event.target ){
    } else {
        settingsPopup.classList.add('d-none');
        twoColumnsRow.classList.remove('filter');
    }
});


// Function for lights toggle switch
const lightsToggle = document.querySelector('#lightsToggle');
const generalPageContainer = document.querySelector('#page-container');
const noteListColumnChild = document.querySelector('#noteListColumnChild');
const viewportColumnChild = document.querySelector('#viewportColumnChild');
const navBar = document.querySelector('#navBar');
const viewportHeader = document.querySelector('#viewportHeader');
const logoColumn = document.querySelector('#logoColumn');
let toggleCount = 0;
lightsToggle.addEventListener('click', () => {
    toggleCount++
    if (toggleCount % 2 === 0){
        generalPageContainer.classList.remove('bg-white');

        noteListColumnChild.classList.add('bg-black');
        noteListColumnChild.classList.remove('bg-custom4');

        viewportColumnChild.classList.add('bg-black');
        viewportColumnChild.classList.remove('bg-custom4');

        navBar.classList.add('bg-black');
        navBar.classList.remove('bg-primary');

        viewportHeader.classList.add('bg-custom1');
        viewportHeader.classList.remove('bg-custom2');

        logoColumn.classList.add('bg-custom2');
        logoColumn.classList.remove('bg-custom3');
    } else {
        generalPageContainer.classList.add('bg-white');

        noteListColumnChild.classList.remove('bg-black');
        noteListColumnChild.classList.add('bg-custom4');

        viewportColumnChild.classList.remove('bg-black');
        viewportColumnChild.classList.add('bg-custom4');

        navBar.classList.remove('bg-black');
        navBar.classList.add('bg-primary');

        viewportHeader.classList.remove('bg-custom1');
        viewportHeader.classList.add('bg-custom2');

        logoColumn.classList.remove('bg-custom2');
        logoColumn.classList.add('bg-custom3');
    }
});


