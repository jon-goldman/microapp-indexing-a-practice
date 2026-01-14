// app.js (module) - small notes widget backed by localStorage
const STORAGE_KEY = 'simple-notes:v1';

function readNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createNoteElement(note) {
  const li = document.createElement('li');
  li.className = 'note-item';
  li.dataset.id = note.id;

  const text = document.createElement('span');
  text.textContent = note.text;
  text.title = note.text;

  const actions = document.createElement('div');
  actions.className = 'note-actions';

  const del = document.createElement('button');
  del.className = 'icon-btn';
  del.type = 'button';
  del.ariaLabel = 'Delete note';
  del.textContent = 'Delete';
  del.addEventListener('click', () => {
    const notes = readNotes().filter(n => n.id !== note.id);
    writeNotes(notes);
    render();
  });

  actions.appendChild(del);
  li.appendChild(text);
  li.appendChild(actions);
  return li;
}

function render() {
  const list = document.getElementById('notes-list');
  if (!list) return;
  list.innerHTML = '';
  const notes = readNotes();
  if (notes.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'note-item';
    empty.style.opacity = '0.6';
    empty.textContent = 'No notes yet — add one above.';
    list.appendChild(empty);
    return;
  }
  notes.forEach(note => list.appendChild(createNoteElement(note)));
}

function init() {
  const form = document.getElementById('note-form');
  const input = document.getElementById('note-input');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const notes = readNotes();
    notes.unshift({ id: Date.now().toString(), text });
    writeNotes(notes);
    input.value = '';
    render();
  });

  // initial render
  render();
}

// Auto-init when loaded in the page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential programmatic use
export { readNotes, writeNotes, render, init };