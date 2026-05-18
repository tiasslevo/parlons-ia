function initArticleReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function getPromptEntry(reference) {
  if (reference === "template") {
    return window.articleTemplatePrompt || null;
  }

  const index = Number(reference);
  if (!Number.isNaN(index) && Array.isArray(window.articlePrompts)) {
    return window.articlePrompts[index] || null;
  }

  return null;
}

function updateButtonState(button, label) {
  if (!button) return;

  const original = button.dataset.originalLabel || button.textContent.trim();
  button.dataset.originalLabel = original;
  button.textContent = label;

  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

window.openPromptModal = function openPromptModal(reference) {
  const entry = getPromptEntry(reference);
  const backdrop = document.getElementById("prompt-modal");
  const title = document.getElementById("prompt-modal-title");
  const content = document.getElementById("prompt-modal-content");
  const copyButton = document.getElementById("prompt-modal-copy");

  if (!entry || !backdrop || !title || !content || !copyButton) return;

  title.textContent = entry.title;
  content.textContent = entry.prompt;
  copyButton.dataset.promptRef = String(reference);
  backdrop.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

window.closePromptModal = function closePromptModal(event) {
  if (event && event.target !== event.currentTarget) return;

  const backdrop = document.getElementById("prompt-modal");
  if (!backdrop) return;

  backdrop.classList.remove("is-open");
  document.body.style.overflow = "";
};

window.copyPrompt = function copyPrompt(reference, button) {
  const entry = getPromptEntry(reference);
  if (!entry) return;

  navigator.clipboard.writeText(entry.prompt).then(() => {
    updateButtonState(button, "Copié");
  });
};

window.copyPromptFromModal = function copyPromptFromModal(button) {
  const reference = button.dataset.promptRef;
  if (!reference) return;

  window.copyPrompt(reference, button);
};

window.openImageLightbox = function openImageLightbox(src, alt, caption) {
  const backdrop = document.getElementById("image-lightbox");
  const image = document.getElementById("image-lightbox-img");
  const label = document.getElementById("image-lightbox-caption");

  if (!backdrop || !image || !label) return;

  image.src = src;
  image.alt = alt || "";
  label.textContent = caption || "";
  backdrop.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

window.closeImageLightbox = function closeImageLightbox(event) {
  if (event && event.target !== event.currentTarget) return;

  const backdrop = document.getElementById("image-lightbox");
  if (!backdrop) return;

  backdrop.classList.remove("is-open");
  document.body.style.overflow = "";
};

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  window.closePromptModal();
  window.closeImageLightbox();
});

document.addEventListener("DOMContentLoaded", () => {
  initArticleReveal();
});
