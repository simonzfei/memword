const STORAGE_KEY = "memword-cards-v1";

const form = document.getElementById("card-form");
const wordInput = document.getElementById("word");
const meaningInput = document.getElementById("meaning");
const totalCards = document.getElementById("total-cards");
const dueCards = document.getElementById("due-cards");
const emptyText = document.getElementById("empty-text");
const cardElement = document.getElementById("card");
const cardWord = document.getElementById("card-word");
const cardMeaning = document.getElementById("card-meaning");
const reviewControls = document.getElementById("review-controls");
const showAnswerButton = document.getElementById("show-answer");
const gradeControls = document.getElementById("grade-controls");
const deckList = document.getElementById("deck-list");
const deckItemTemplate = document.getElementById("deck-item-template");

let cards = loadCards();
let currentCard = null;

function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function now() {
  return Date.now();
}

function createCard(word, meaning) {
  const timestamp = now();
  return {
    id: crypto.randomUUID(),
    word,
    meaning,
    dueAt: timestamp,
    intervalDays: 0,
    ease: 2.5,
    reviews: 0,
  };
}

function getDueCards() {
  const ts = now();
  return cards.filter((card) => card.dueAt <= ts);
}

function pickNextCard() {
  const due = getDueCards();
  if (!due.length) return null;
  due.sort((a, b) => a.dueAt - b.dueAt);
  return due[0];
}

function pluralize(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function updateStats() {
  totalCards.textContent = pluralize(cards.length, "card");
  dueCards.textContent = `${getDueCards().length} due`;
}

function renderDeck() {
  deckList.innerHTML = "";

  cards
    .slice()
    .sort((a, b) => a.word.localeCompare(b.word))
    .forEach((card) => {
      const item = deckItemTemplate.content.firstElementChild.cloneNode(true);
      item.querySelector(".deck-word").textContent = card.word;
      item.querySelector(".deck-meaning").textContent = card.meaning;
      item.querySelector(".delete-btn").addEventListener("click", () => {
        cards = cards.filter((entry) => entry.id !== card.id);
        saveCards();
        render();
      });
      deckList.append(item);
    });
}

function renderReviewCard() {
  currentCard = pickNextCard();

  if (!cards.length) {
    emptyText.textContent = "No cards yet. Add your first word above.";
    cardElement.classList.add("hidden");
    emptyText.classList.remove("hidden");
    return;
  }

  if (!currentCard) {
    emptyText.textContent = "Great job! No cards are due right now.";
    cardElement.classList.add("hidden");
    emptyText.classList.remove("hidden");
    return;
  }

  emptyText.classList.add("hidden");
  cardElement.classList.remove("hidden");
  cardWord.textContent = currentCard.word;
  cardMeaning.textContent = currentCard.meaning;
  cardMeaning.classList.add("hidden");
  reviewControls.classList.remove("hidden");
  gradeControls.classList.add("hidden");
}

function schedule(card, grade) {
  if (grade === "again") {
    card.intervalDays = 0;
    card.dueAt = now() + 60 * 1000;
    card.ease = Math.max(1.3, card.ease - 0.2);
  } else if (grade === "good") {
    card.intervalDays = Math.max(1, Math.round((card.intervalDays || 1) * card.ease));
    card.dueAt = now() + card.intervalDays * 24 * 60 * 60 * 1000;
  } else if (grade === "easy") {
    card.ease += 0.15;
    card.intervalDays = Math.max(2, Math.round((card.intervalDays || 1) * card.ease * 1.3));
    card.dueAt = now() + card.intervalDays * 24 * 60 * 60 * 1000;
  }

  card.reviews += 1;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  if (!word || !meaning) return;

  cards.push(createCard(word, meaning));
  saveCards();
  form.reset();
  wordInput.focus();
  render();
});

showAnswerButton.addEventListener("click", () => {
  if (!currentCard) return;
  cardMeaning.classList.remove("hidden");
  reviewControls.classList.add("hidden");
  gradeControls.classList.remove("hidden");
});

gradeControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-grade]");
  if (!button || !currentCard) return;
  schedule(currentCard, button.dataset.grade);
  saveCards();
  render();
});

function render() {
  updateStats();
  renderReviewCard();
  renderDeck();
}

render();
