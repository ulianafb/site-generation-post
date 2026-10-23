// Кнопка «Скопировать пост» и сообщение после копирования.

const copyButton = document.getElementById("copy-button");
const postSource = document.getElementById("post-text");
const copyStatus = document.getElementById("copy-status");

if (copyButton && postSource && copyStatus) {
  let hideTimer;

  // Запасной способ для браузеров, где нет Clipboard API.
  function fallbackCopy(textarea) {
    try {
      textarea.focus();
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.blur();
      window.getSelection()?.removeAllRanges();
      return copied;
    } catch (error) {
      return false;
    }
  }

  function showStatus(message) {
    clearTimeout(hideTimer);
    copyStatus.textContent = message;
    copyStatus.classList.add("is-visible");

    hideTimer = setTimeout(() => {
      copyStatus.classList.remove("is-visible");
      copyStatus.textContent = "";
    }, 2600);
  }

  copyButton.addEventListener("click", async () => {
    const text = postSource.value;
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        copied = fallbackCopy(postSource);
      }
    } catch (error) {
      copied = fallbackCopy(postSource);
    }

    if (copied) {
      showStatus("Пост скопирован");
    } else {
      showStatus("Не удалось скопировать. Выделите текст вручную.");
    }
  });
}

// Пока сервер загружает товар и ждёт нейросеть, показываем состояние загрузки.
const generateForm = document.getElementById("generate-form");
const generateButton = document.getElementById("generate-button");
const generateLabel = document.getElementById("generate-label");
const generatingState = document.getElementById("generating-state");
const resultCard = document.querySelector(".result-card");

if (generateForm && generateButton && generateLabel && generatingState && resultCard) {
  generateForm.addEventListener("submit", () => {
    generateButton.disabled = true;
    generateButton.classList.add("is-loading");
    generateLabel.textContent = "Изучаю товар и пишу…";
    generatingState.setAttribute("aria-hidden", "false");
    resultCard.classList.add("is-generating");
    resultCard.setAttribute("aria-busy", "true");
  });

  // Если пользователь вернулся кнопкой «Назад», возвращаем обычный вид.
  window.addEventListener("pageshow", () => {
    generateButton.disabled = false;
    generateButton.classList.remove("is-loading");
    generateLabel.textContent = "Сгенерировать пост";
    generatingState.setAttribute("aria-hidden", "true");
    resultCard.classList.remove("is-generating");
    resultCard.removeAttribute("aria-busy");
  });
}

// На телефоне после генерации прокручиваем страницу к готовому посту.
const resultWithPost = document.querySelector(".result-card.has-post");

if (resultWithPost && window.matchMedia("(max-width: 900px)").matches) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.setTimeout(() => {
    resultWithPost.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, 180);
}
