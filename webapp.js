const fileInput = document.getElementById("fileInput");
const youNameInput = document.getElementById("youName");
const searchInput = document.getElementById("search");
const chatContainer = document.getElementById("chat");
const previewInput = document.getElementById("previewInput");
const sendPreview = document.getElementById("sendPreview");
const resetBtn = document.getElementById("resetBtn");
const clearBtn = document.getElementById("clearBtn");
const bottomBtn = document.getElementById("bottomBtn");
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");

let messages = [];

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => parseChat(ev.target.result);
  reader.readAsText(file);
});

function parseChat(text) {
  messages = [];
  const lines = text.split("\n");
  let currentDate = "";
  const regex = /^(\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}), (\d{1,2}:\d{2}(?:\s?[ap]m)?) - (.*?): (.*)$/;

  lines.forEach(line => {
    const match = line.match(regex);
    if (match) {
      const [ , date, time, sender, message ] = match;

      if (date !== currentDate) {
        messages.push({ type: "date", text: date });
        currentDate = date;
      }

      messages.push({ type: "msg", sender, time, text: message });
    } else if (line.trim()) {
      // System message
      messages.push({ type: "system", text: line.trim() });
    }
  });

  renderChat();
}

function renderChat() {
  chatContainer.innerHTML = "";
  const you = youNameInput.value.trim().toLowerCase();

  messages.forEach(msg => {
    if (msg.type === "date") {
      const d = document.createElement("div");
      d.className = "date-separator";
      d.innerText = msg.text;
      chatContainer.appendChild(d);
    } else if (msg.type === "system") {
      const sys = document.createElement("div");
      sys.className = "system";
      sys.innerHTML = `<div class="system-text">${msg.text}</div>`;
      chatContainer.appendChild(sys);
    } else {
      const div = document.createElement("div");
      div.className = "message";

      if (msg.sender.toLowerCase() === you) {
        div.classList.add("sent");
      } else {
        div.classList.add("received");
      }

      const textSpan = document.createElement("div");
      textSpan.innerText = msg.text;

      const timeSpan = document.createElement("div");
      timeSpan.className = "timestamp";
      timeSpan.innerText = msg.time;

      if (div.classList.contains("sent")) {
        const ticks = document.createElement("span");
        ticks.className = "ticks read";
        ticks.innerText = "✔✔";
        timeSpan.appendChild(ticks);
      }

      div.appendChild(textSpan);
      div.appendChild(timeSpan);
      chatContainer.appendChild(div);
    }
  });

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Preview composer
sendPreview.addEventListener("click", () => {
  const txt = previewInput.value.trim();
  if (!txt) return;
  messages.push({ type: "msg", sender: youNameInput.value || "You", time: new Date().toLocaleTimeString(), text: txt });
  previewInput.value = "";
  renderChat();
});

resetBtn.addEventListener("click", () => {
  youNameInput.value = "";
  searchInput.value = "";
});
clearBtn.addEventListener("click", () => {
  messages = [];
  renderChat();
});
bottomBtn.addEventListener("click", () => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Modal
helpBtn.addEventListener("click", () => helpModal.setAttribute("aria-hidden", "false"));
closeHelp.addEventListener("click", () => helpModal.setAttribute("aria-hidden", "true"));
