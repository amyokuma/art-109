const buttons = document.querySelectorAll(".mood-btn");
const body = document.body;
const moodWord = document.getElementById("mood-word");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    body.className = mood;
    moodWord.textContent = mood;

    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
