// DOM Selector

const noteList = document.querySelector('.note-list ul');
const addNote = document.querySelector('.note-add button');
const noteDetails = document.querySelector('.note-details textarea');
const searchNotes = document.querySelector('.note-search input');
const clearSearch = document.querySelector('.clear-search');
let noteSummary = '';

// Locale Storage
const generateRandomId = () => {
  return `${Math.floor(Math.random() * 2000000)}`;
};

const saveNewNote = (title, details = '') => {
  const id = generateRandomId();
  const localNotes = JSON.parse(localStorage.getItem('notes'));
  const noteData = { id, title, details };
  const localData = localNotes ? [noteData, ...localNotes] : [noteData];
  localStorage.setItem('notes', JSON.stringify(localData));
  return noteData;
};

const getNotes = () => JSON.parse(localStorage.getItem('notes'));

//Initial State
const renderELem = notes => {
  notes.forEach(note => {
    const summary = note.details ? note.details.slice(0, 40) + '...' : '';
    const noteItem = `<li>
        <button class="note-title" id="${note.id}" onclick="selected(this)">${note.title} <span class="note-summary" >${summary}</span></button>
      </li>`;
    noteList.insertAdjacentHTML('beforeend', noteItem);
  });
};
const render = () => {
  const notes = getNotes();
  noteList.innerHTML = '';
  if (notes) {
    renderELem(notes);
    const firstItem = document.querySelector('.note-title');
    firstItem.classList.add('note-selected');
    noteDetails.value = notes[0].details;
  }
};
render();

// Add Notes
let noteFormInput = '';
addNote.addEventListener('click', () => {
  if (noteFormInput) return;
  const noteForm = `<li>
    <input class="note-form" type="text" placeholder="Enter note title" />
  </li>`;

  noteList.insertAdjacentHTML('afterbegin', noteForm);
  noteFormInput = document.querySelector('.note-form');
  noteFormInput.focus();

  // On input save notes
  noteFormInput.addEventListener('change', e => {
    // Saving Note
    const note = saveNewNote(e.target.value);

    const noteItem = `<li>
      <button id="${note.id}" class="note-title" onclick="selected(this)">${note.title} <span class="note-summary"></span></button>
    </li>`;

    noteList.insertAdjacentHTML('afterbegin', noteItem);
    noteFormInput = '';
    e.target.parentElement.remove();

    // Select Note
    const selectedNote = document.querySelector('.note-title');
    noteDetails.value = note.details;
    checkSelected(selectedNote);
  });
});

// Select Notes
const checkSelected = e => {
  const isSelected = document.querySelector('.note-selected');
  if (isSelected) isSelected.classList.remove('note-selected');
  e.classList.toggle('note-selected');
};

const selected = e => {
  const selectedNote = getNotes().find(note => note.id == e.id);
  noteDetails.value = selectedNote.details;
  checkSelected(e);
};

// Updating Details
noteDetails.addEventListener('input', e => {
  const itemId = document.querySelector('.note-selected').id;

  updateDetails(itemId, e.target.value);

  const noteSummary = document.querySelector('.note-summary');
  noteSummary.textContent = e.target.value;

  if (noteSummary.textContent.length && noteSummary.textContent.length >= 40) {
    noteSummary.textContent = noteSummary.textContent.slice(0, 40) + '...';
  }
});

const updateDetails = (id, details) => {
  const localNotes = getNotes();
  let localNote = localNotes.find(note => note.id == id);
  let index = localNotes.findIndex(note => note.id == id);
  localNote.details = details;

  localNotes[index] = localNote;
  localStorage.setItem('notes', JSON.stringify(localNotes));
  return localNotes;
};

// Search notes
const findNotes = e => {
  const keywords = e.target.value.toLowerCase();
  if (!keywords) {
    clearSearch.style.visibility = 'hidden';
    return render();
  }

  clearSearch.style.visibility = 'visible';
  const localNotes = getNotes();
  const notes = localNotes.filter(note => note.title.toLowerCase().includes(keywords));

  console.log(notes);
  if (notes) {
    noteList.innerHTML = '';
    renderELem(notes);
  }
};

searchNotes.addEventListener('input', findNotes);

// Clear Search
clearSearch.addEventListener('click', e => {
  searchNotes.value = '';
  render();
  e.target.style.visibility = 'hidden';
});
