const dialog = document.querySelector('#letter-dialog');
let letterOpener;

document.querySelectorAll('[data-open-letter]').forEach(button => {
  button.addEventListener('click', () => {
    letterOpener = button;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  letterOpener?.focus({ preventScroll: true });
});
document.querySelector('#letter-to-dates').addEventListener('click', () => {
  dialog.close();
  document.querySelector('#next-chapter').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.querySelector('.date-card').focus({ preventScroll: true });
});

const notes = [
  ['You deserve a little effort.', 'Consider this the opening scene.'],
  ['I could have played it cool.', 'Instead, I made you a website.'],
  ['One date, and here I am', 'putting hearts in my code.'],
  ['The next thing on my to-do list?', 'A little more time with you.'],
  ['This page has a favorite person.', 'Spoiler: it’s you, Gi.']
];
let noteIndex = 0;
document.querySelector('#another-note').addEventListener('click', () => {
  noteIndex = (noteIndex + 1) % notes.length;
  const [first, second] = notes[noteIndex];
  const emphasis = document.createElement('em');
  emphasis.textContent = second;
  document.querySelector('#little-note').replaceChildren(document.createTextNode(first), document.createElement('br'), emphasis);
});

const dates = {
  coffee: { title: 'Two coffees. A little more us.', copy: 'A cozy spot and enough time to actually talk. That sounds like a pretty good chapter two.', message: 'Okay, your little website made me smile. Coffee & conversation for date two? ☕♡' },
  bookstore: { title: 'Meet me between the shelves.', copy: 'You pick a book. We find a cozy corner. I get to learn a little more about your world.', message: 'My chapter-two pick: a little bookstore date. I have some reading recommendations for you. 📚♡' },
  sunset: { title: 'Something sweet. Then golden hour.', copy: 'Dessert, a sunset, and a very good excuse to spend a little more time together.', message: 'Dessert & a sunset gets my vote for our next chapter. Your website may have worked. 🌅♡' }
};
let selectedDate;
const copyButton = document.querySelector('#copy-invitation');
const copyHelp = document.querySelector('#copy-help');
const fallback = document.querySelector('#copy-fallback');
document.querySelectorAll('.date-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedDate = card.dataset.date;
    document.querySelectorAll('.date-card').forEach(other => {
      const selected = other === card;
      other.setAttribute('aria-pressed', String(selected));
      other.querySelector('.date-selector').textContent = selected ? '✓' : '↗';
    });
    const choice = dates[selectedDate];
    document.querySelector('#date-result-title').textContent = choice.title;
    document.querySelector('#date-result-copy').textContent = choice.copy;
    document.querySelector('#date-result').hidden = false;
    copyButton.innerHTML = 'Copy my pick <span aria-hidden="true">♡</span>';
    copyHelp.textContent = 'Nothing is sent here. Copy your pick and text it to me.';
    fallback.hidden = true;
  });
});
copyButton.addEventListener('click', async () => {
  if (!selectedDate) return;
  const message = dates[selectedDate].message;
  try {
    await navigator.clipboard.writeText(message);
    copyButton.textContent = 'Copied ♡';
    copyHelp.textContent = 'Your pick is copied. Paste it into our chat when you feel like it.';
  } catch {
    fallback.value = message;
    fallback.hidden = false;
    fallback.focus();
    fallback.select();
    copyHelp.textContent = 'Your browser couldn’t copy automatically. Select and copy the message below.';
  }
});

let celebrationTimeout;
document.querySelector('#smile-button').addEventListener('click', () => {
  document.querySelector('#smile-reply').textContent = 'Then this little corner of the internet did its job. ♡';
  const container = document.querySelector('#heart-confetti');
  clearTimeout(celebrationTimeout);
  container.replaceChildren();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 25; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'confetti-piece';
    heart.textContent = i % 3 ? '♡' : '♥';
    heart.style.setProperty('--x', `${Math.random() * 100}%`);
    heart.style.setProperty('--size', `${16 + Math.random() * 22}px`);
    heart.style.setProperty('--color', ['#a13b53', '#d1859a', '#e6afbe'][i % 3]);
    heart.style.setProperty('--duration', `${2.8 + Math.random() * 1.5}s`);
    heart.style.setProperty('--delay', `${Math.random() * .8}s`);
    heart.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
    heart.style.setProperty('--rotation', `${Math.random() * 120 - 60}deg`);
    container.append(heart);
  }
  celebrationTimeout = setTimeout(() => container.replaceChildren(), 5200);
});
