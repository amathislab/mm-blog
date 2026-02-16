// Font size adjustment for d-article
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const decreaseBtn = document.getElementById("font-decrease");
    const increaseBtn = document.getElementById("font-increase");
    const label = document.getElementById("font-size-label");
    const content = document.querySelector("d-article");
    if (!decreaseBtn || !increaseBtn || !content) return;

    const sizes = [14, 16, 17, 18, 20, 22];
    const defaultIndex = 2;
    let currentIndex = parseInt(localStorage.getItem("font-size-index") || defaultIndex);

    function applySize() {
      content.style.fontSize = sizes[currentIndex] + "px";
      if (label) {
        const diff = currentIndex - defaultIndex;
        if (diff === 0) label.textContent = "A";
        else if (diff > 0) label.textContent = "A".repeat(diff) + "+";
        else label.textContent = "A" + "-".repeat(-diff);
      }
    }

    decreaseBtn.onclick = function () {
      if (currentIndex > 0) {
        currentIndex--;
        localStorage.setItem("font-size-index", currentIndex);
        applySize();
      }
    };

    increaseBtn.onclick = function () {
      if (currentIndex < sizes.length - 1) {
        currentIndex++;
        localStorage.setItem("font-size-index", currentIndex);
        applySize();
      }
    };

    applySize();
  });
})();

// Copy-to-clipboard for code blocks
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("div.highlighter-rouge").forEach((block) => {
    let btn = document.createElement("button");
    btn.className = "code-copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      let code = block.querySelector("code");
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => { btn.textContent = "Copy"; }, 2000);
        });
      }
    });
    block.appendChild(btn);
  });
});
