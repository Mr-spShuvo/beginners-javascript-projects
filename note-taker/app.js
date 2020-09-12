/******************************
 * => DOM Elem & DOM Selectors
 ******************************/
const noteList = document.querySelector('.note-list');
const addNote = document.querySelector('.note-add button');
const noteDetails = document.querySelector('.note-details textarea');
const searchNotes = document.querySelector('.note-search input');
const clearSearch = document.querySelector('.clear-search');
const editedAtElem = document.querySelector('.note-updated span');
const appThemeButton = document.querySelector('.app-theme button');
let noteFormInput = '';

const noteDOMInputElem = `<li>
<input class="note-form" type="text" placeholder="Enter note title" />
</li>`;

const noNoteElem = `<li class="no-notes">
  <h3 class="note-title">No Notes Found! <span class="note-summary">Go ahead and create one. 😍</span></h3>
</li>`;

const noteDOMElem = (id, title, summary = '', createdAt) => `<li>
<span class="note-created">${moment(createdAt).format('hh.mm A - MMM DD, YYYY')}</span>
<button class="note-title" id="${id}" onclick="selected(this)">${title} <span class="note-summary" >${summary}</span></button>
<button data-id=${id} onclick="deleteNote(this)" class="note-delete">&Cross;</button>
</li>`;

/**************************
 * => App Themes
 **************************/
const appThemeSwitcher = (button, appTheme) => {
  if (appTheme === 'light') {
    document.querySelector('body').classList.add('light-mode');
    button.innerHTML = '&#9865;';
  } else if (appTheme === 'dark') {
    document.querySelector('body').classList.remove('light-mode');
    button.innerHTML = '&#9728;';
  }
};

let appTheme = localStorage.getItem('notes-theme');
appThemeSwitcher(appThemeButton, appTheme);

appThemeButton.addEventListener('click', e => {
  if (appTheme === 'light') {
    appTheme = 'dark';
    appThemeSwitcher(appThemeButton, appTheme);
    localStorage.setItem('notes-theme', appTheme);
  } else if (appTheme === 'dark' || appTheme === null) {
    appTheme = 'light';
    appThemeSwitcher(appThemeButton, appTheme);
    localStorage.setItem('notes-theme', appTheme);
  }
});

/**************************
 * => Local Storage Funcs
 ***************************/
const getNotesFromLocal = () => JSON.parse(localStorage.getItem('notes'));

const timestamp = moment().valueOf();
const saveNewNoteToLocal = (title, details = '') => {
  const id = uuidv4(); //`${Math.floor(Math.random() * 2000000)}`;
  const localNotes = JSON.parse(localStorage.getItem('notes'));
  const noteData = { id, title, details, createdAt: timestamp, updatedAt: timestamp };
  const localData = localNotes ? [noteData, ...localNotes] : [noteData];
  localStorage.setItem('notes', JSON.stringify(localData));
  return noteData;
};

const deleteNoteFromLocal = noteId => {
  const localNotes = getNotesFromLocal();
  const localData = localNotes.filter(note => note.id != noteId);
  localStorage.setItem('notes', JSON.stringify(localData));
};

/**************************
 * => Initial App Rendering
 ***************************/
const renderELem = notes => {
  notes.forEach(note => {
    const summary = note.details ? note.details.slice(0, 35) + '...' : '';
    const noteItem = noteDOMElem(note.id, note.title, summary, note.createdAt);
    noteList.insertAdjacentHTML('beforeend', noteItem);
  });
};

const render = () => {
  const notes = getNotesFromLocal();
  const noNotes = document.querySelector('.no-notes');
  console.log(noNotes);
  console.log(notes);
  noteList.innerHTML = '';
  if (notes !== null && notes.length !== 0) {
    noteList.innerHTML = '';
    noteFormInput = '';
    renderELem(notes);
    const firstItem = document.querySelector('.note-title');
    if (firstItem) {
      firstItem.classList.add('note-selected');
      noteDetails.value = notes[0].details;
      editedAtElem.textContent = moment(notes[0].updatedAt).fromNow();
    }
  } else if (!noNotes) noteList.insertAdjacentHTML('afterbegin', noNoteElem);
};
render();

/**************************
 * => Adding Note
 **************************/
addNote.addEventListener('click', () => {
  if (noteFormInput) return;
  const clearButton = document.querySelector('.clear-search');
  clearSearchField(clearButton);

  noteList.insertAdjacentHTML('afterbegin', noteDOMInputElem);
  noteFormInput = document.querySelector('.note-form');
  noteFormInput.focus();

  noteFormInput.addEventListener('change', e => {
    const note = saveNewNoteToLocal(e.target.value);
    const noteItem = noteDOMElem(note.id, note.title);
    const noNotes = document.querySelector('.no-notes');
    if (noNotes) noNotes.remove();

    noteList.insertAdjacentHTML('afterbegin', noteItem);
    noteFormInput = '';
    e.target.parentElement.remove();

    const selectedNote = document.querySelector('.note-title');
    noteDetails.value = note.details;
    checkSelected(selectedNote);
  });
});

/**************************
 * => Select Notes
 **************************/
const checkSelected = e => {
  const isSelected = document.querySelector('.note-selected');
  if (isSelected) isSelected.classList.remove('note-selected');
  e.classList.toggle('note-selected');
};

const selected = e => {
  const selectedNote = getNotesFromLocal().find(note => note.id == e.id);
  noteDetails.value = selectedNote.details;
  editedAtElem.textContent = moment(selectedNote.updatedAt).fromNow();
  checkSelected(e);
};

/**************************
 * => Updating Note Details
 ***************************/
noteDetails.addEventListener('input', e => {
  const itemId = document.querySelector('.note-selected').id;
  const note = updateDetails(itemId, e.target.value);
  const noteSummary = document.querySelector('.note-selected .note-summary');
  editedAtElem.textContent = moment(note.updatedAt).fromNow();
  noteSummary.textContent = e.target.value;
  if (noteSummary.textContent.length && noteSummary.textContent.length >= 35) {
    noteSummary.textContent = noteSummary.textContent.slice(0, 35) + '...';
  }
});

const updateDetails = (id, details) => {
  const localNotes = getNotesFromLocal();
  let localNote = localNotes.find(note => note.id == id);
  let index = localNotes.findIndex(note => note.id == id);
  localNote.details = details;
  localNote.updatedAt = moment().valueOf();
  localNotes[index] = localNote;
  localStorage.setItem('notes', JSON.stringify(localNotes));
  return localNotes;
};

/**************************
 * => Deleting Note
 ***************************/

const deleteNote = e => {
  const id = e.dataset.id;
  deleteNoteFromLocal(id);
  noteDetails.value = '';
  render();
};

/**************************
 * => Searching Notes
 **************************/
const findNotes = e => {
  const keywords = e.target.value.toLowerCase();
  if (!keywords) {
    clearSearch.style.visibility = 'hidden';
    return render();
  }

  clearSearch.style.visibility = 'visible';
  const localNotes = getNotesFromLocal();
  const notes = localNotes.filter(note => note.title.toLowerCase().includes(keywords));

  if (notes) {
    noteList.innerHTML = '';
    renderELem(notes);
  }
};
searchNotes.addEventListener('input', findNotes);

// Clear Search
const clearSearchField = elem => {
  searchNotes.value = '';
  render();
  elem.style.visibility = 'hidden';
};
clearSearch.addEventListener('click', e => clearSearchField(e.target));

/**************************
 * => Sync Notes
 **************************/

window.addEventListener('storage', e => {
  if (e.key == 'notes') {
    notes = JSON.parse(e.newValue);
    const itemId = document.querySelector('.note-selected').id;

    note = notes.find(function (note) {
      return note.id === itemId;
    });

    const noteSummary = document.querySelector('.note-selected .note-summary');
    noteSummary.textContent = note.details;
    if (noteSummary.textContent.length && noteSummary.textContent.length >= 35) {
      noteSummary.textContent = noteSummary.textContent.slice(0, 35) + '...';
    }
    noteDetails.value = note.details;
  }
});
