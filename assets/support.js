const TELEGRAM_CONFIG = {
  BOT_TOKEN: "8292941684:AAFZVU4zyhly7xwujypeijhs4snhhwboZ7s",
  CHAT_ID: "457827498",
};

const supportForm = document.getElementById("support-form");
const statusNode = document.getElementById("form-status");
const hintNode = document.getElementById("support-hint");

const isTelegramConfigured = () => {
  const token = TELEGRAM_CONFIG.BOT_TOKEN?.trim() || "";
  const chatId = TELEGRAM_CONFIG.CHAT_ID?.trim() || "";
  if (!token || !chatId) return false;
  if (token === "PASTE_YOUR_BOT_TOKEN_HERE" || chatId === "PASTE_YOUR_CHAT_ID_HERE") {
    return false;
  }
  return true;
};

const setStatus = (message, kind) => {
  statusNode.textContent = message;
  statusNode.classList.remove("form-status--ok", "form-status--error");
  if (kind === "ok") statusNode.classList.add("form-status--ok");
  if (kind === "error") statusNode.classList.add("form-status--error");
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const updateHint = () => {
  if (!hintNode) return;
  hintNode.classList.remove("support-hint--ok", "support-hint--warn");
  if (isTelegramConfigured()) {
    hintNode.hidden = true;
    hintNode.textContent = "";
  } else {
    hintNode.hidden = false;
    hintNode.textContent =
      "Перед использованием заполните BOT_TOKEN и CHAT_ID в assets/support.js.";
    hintNode.classList.add("support-hint--warn");
  }
};

updateHint();

if (supportForm) {
  supportForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isTelegramConfigured()) {
      setStatus("Укажите BOT_TOKEN и CHAT_ID в assets/support.js.", "error");
      return;
    }

    const formData = new FormData(supportForm);
    const name = formData.get("name")?.toString().trim() || "";
    const contact = formData.get("contact")?.toString().trim() || "";
    const topic = formData.get("topic")?.toString().trim() || "Без темы";
    const message = formData.get("message")?.toString().trim() || "";

    if (!name || !contact || !message) {
      setStatus("Заполните имя, контакт и сообщение.", "error");
      return;
    }

    setStatus("Отправляем сообщение...", "");

    const text = [
      "<b>KasBudget Support</b>",
      "",
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)}`,
      `<b>Тема:</b> ${escapeHtml(topic)}`,
      "",
      `<b>Сообщение:</b>`,
      escapeHtml(message),
    ].join("\n");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }

      supportForm.reset();
      setStatus("Сообщение отправлено. Спасибо!", "ok");
    } catch (error) {
      setStatus(
        "Не удалось отправить сообщение. Проверьте токен, chat id и доступ к сети.",
        "error",
      );
    }
  });
}
