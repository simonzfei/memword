# MemWord

MemWord is a lightweight, browser-based vocabulary flashcard app inspired by Anki-style spaced repetition.

## Features

- Add word/meaning cards quickly.
- Review only cards that are currently due.
- Reveal the answer, then grade recall as **Again**, **Good**, or **Easy**.
- Simple interval scheduling that adjusts future due dates.
- Local persistence with `localStorage` (no backend required).
- Deck list with one-click card deletion.

## How it works

Each card stores:

- `word`
- `meaning`
- `dueAt`
- `intervalDays`
- `ease`
- `reviews`

During review:

- **Again**: requeues in 1 minute and decreases ease.
- **Good**: schedules based on current interval × ease.
- **Easy**: increases ease and schedules a longer interval.

## Getting started

### Option 1: Open directly

Open `index.html` in a modern browser.

### Option 2: Run a local static server

From the project root:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project structure

- `index.html` – app layout and UI structure.
- `styles.css` – visual styles.
- `app.js` – flashcard logic, scheduling, rendering, and persistence.

## Data storage

Cards are saved under the `localStorage` key:

- `memword-cards-v1`

To reset data, clear site storage in your browser dev tools.

## Browser compatibility

MemWord uses modern web APIs (including `crypto.randomUUID()`), so use an up-to-date browser.
