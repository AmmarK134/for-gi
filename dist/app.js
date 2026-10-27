const dialog = document.querySelector('#letter-dialog');
let letterOpener;
let continueToDates = false;
let activeDuck;
let openingLetter = false;
let openingTimeout;
let decorativeMotionPaused = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const duckStatus = document.querySelector('#duck-status');
const duckTemplate = document.querySelector('#duck-shape-template');

document.querySelectorAll('[data-duck-art]').forEach(duck => {
  duck.append(duckTemplate.content.cloneNode(true));
});

const motionToggle = document.querySelector('#motion-toggle');
motionToggle.addEventListener('click', () => {
  decorativeMotionPaused = !decorativeMotionPaused;
  document.body.classList.toggle('motion-paused', decorativeMotionPaused);
  motionToggle.setAttribute('aria-pressed', String(decorativeMotionPaused));
  motionToggle.setAttribute('aria-label', decorativeMotionPaused ? 'Resume decorative motion' : 'Pause decorative motion');
  motionToggle.innerHTML = decorativeMotionPaused ? 'hearts resting <span aria-hidden="true">♡</span>' : 'hearts in motion <span aria-hidden="true">♥</span>';
  if (decorativeMotionPaused) document.querySelector('#heart-confetti').replaceChildren();
});

function resetDuck() {
  clearTimeout(openingTimeout);
  activeDuck?.classList.remove('is-unfolding');
  activeDuck?.removeAttribute('aria-busy');
  openingLetter = false;
  duckStatus.textContent = '';
}

document.querySelectorAll('[data-open-letter]').forEach(button => {
  button.addEventListener('click', () => {
    if (openingLetter || dialog.open) return;
    openingLetter = true;
    letterOpener = button;
    continueToDates = false;
    const bonus = button.dataset.openLetter === 'bonus';
    activeDuck = document.querySelector(bonus ? '#duck-bonus' : '#duck-main');
    document.querySelector('#main-letter-content').hidden = bonus;
    document.querySelector('#bonus-letter-content').hidden = !bonus;
    document.querySelector('#letter-title').textContent = bonus ? 'Psst, Gi…' : 'Hey Gi,';

    const showLetter = () => {
      dialog.showModal();
      document.body.classList.add('modal-open');
      openingLetter = false;
      activeDuck.removeAttribute('aria-busy');
      duckStatus.textContent = '';
    };
    if (reducedMotion.matches) {
      showLetter();
      return;
    }
    duckStatus.textContent = 'Your little paper duck is unfolding its note…';
    activeDuck.setAttribute('aria-busy', 'true');
    const bounds = activeDuck.getBoundingClientRect();
    const needsScroll = bounds.top < 0 || bounds.bottom > window.innerHeight;
    if (needsScroll) activeDuck.scrollIntoView({ behavior: 'smooth', block: 'center' });
    activeDuck.classList.add('is-unfolding');
    openingTimeout = setTimeout(showLetter, 1200);
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && openingLetter && !dialog.open) {
    resetDuck();
    letterOpener?.focus({ preventScroll: true });
  }
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  resetDuck();
  document.body.classList.remove('modal-open');
  if (continueToDates) {
    document.querySelector('#next-chapter').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.querySelector('.date-card').focus({ preventScroll: true });
    continueToDates = false;
    return;
  }
  letterOpener?.focus({ preventScroll: true });
});
document.querySelector('#letter-to-dates').addEventListener('click', () => {
  continueToDates = true;
  dialog.close();
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
  if (reducedMotion.matches || decorativeMotionPaused) return;
  for (let i = 0; i < 25; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'confetti-piece';
    heart.textContent = i % 3 ? '♡' : '♥';
    heart.style.setProperty('--x', `${Math.random() * 100}%`);
    heart.style.setProperty('--size', `${16 + Math.random() * 22}px`);
    heart.style.setProperty('--color', ['#c92b50', '#f1749b', '#ffb3cc'][i % 3]);
    heart.style.setProperty('--duration', `${2.8 + Math.random() * 1.5}s`);
    heart.style.setProperty('--delay', `${Math.random() * .8}s`);
    heart.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
    heart.style.setProperty('--rotation', `${Math.random() * 120 - 60}deg`);
    container.append(heart);
  }
  celebrationTimeout = setTimeout(() => container.replaceChildren(), 5200);
});
