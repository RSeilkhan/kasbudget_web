document.querySelectorAll(".faq-list").forEach((list) => {
  list.querySelectorAll("details.faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      list.querySelectorAll("details.faq-item").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
});

const policyToggleButtons = document.querySelectorAll("[data-policy-toggle]");
const policyLanguageBlocks = document.querySelectorAll("[data-policy-lang]");

if (policyToggleButtons.length && policyLanguageBlocks.length) {
  const setPolicyLanguage = (lang) => {
    policyLanguageBlocks.forEach((block) => {
      const isActive = block.dataset.policyLang === lang;
      block.hidden = !isActive;
    });

    policyToggleButtons.forEach((button) => {
      const isActive = button.dataset.policyToggle === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  setPolicyLanguage("ru");

  policyToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.policyToggle;
      if (!lang) return;
      setPolicyLanguage(lang);
    });
  });
}
