import "./style.css";
import { settings, NotificationStyle } from "@/utils/settings";

const app = document.querySelector<HTMLDivElement>("#app")!;

const container = document.createElement("div");

const h1 = document.createElement("h1");
h1.textContent = "Typst QoL";

const styleSection = document.createElement("div");
styleSection.className = "settings-section";
const styleLabel = document.createElement("label");
styleLabel.textContent = "Error Notification Style:";
styleSection.appendChild(styleLabel);
const styleSelect = document.createElement("select");
styleSelect.id = "style-select";
const styleOptions: { value: NotificationStyle; label: string }[] = [
  { value: "overlay", label: "Big Overlay (Default)" },
  { value: "toast", label: "Native Toast" },
];
styleOptions.forEach((opt) => {
  const option = document.createElement("option");
  option.value = opt.value;
  option.textContent = opt.label;
  styleSelect.appendChild(option);
});
styleSection.appendChild(styleSelect);

const showDelaySection = document.createElement("div");
showDelaySection.className = "settings-section";
const showDelayLabel = document.createElement("label");
showDelayLabel.textContent = "Show Delay (ms):";
showDelaySection.appendChild(showDelayLabel);
const showDelayInput = document.createElement("input");
showDelayInput.type = "range";
showDelayInput.min = "0";
showDelayInput.max = "5000";
showDelayInput.step = "100";
const showDelayValue = document.createElement("span");
showDelayValue.className = "value-display";
showDelaySection.append(showDelayInput, showDelayValue);

const hideDelaySection = document.createElement("div");
hideDelaySection.className = "settings-section";
const hideDelayLabel = document.createElement("label");
hideDelayLabel.textContent = "Hide Delay (ms):";
hideDelaySection.appendChild(hideDelayLabel);
const hideDelayInput = document.createElement("input");
hideDelayInput.type = "range";
hideDelayInput.min = "0";
hideDelayInput.max = "5000";
hideDelayInput.step = "100";
const hideDelayValue = document.createElement("span");
hideDelayValue.className = "value-display";
hideDelaySection.append(hideDelayInput, hideDelayValue);

const footer = document.createElement("p");
footer.className = "footer";
footer.textContent = "Changes apply instantly.";

container.append(h1, styleSection, showDelaySection, hideDelaySection, footer);
app.appendChild(container);

(async () => {
  try {
    const currentSettings = await settings.getValue();

    styleSelect.value = currentSettings.notificationStyle;

    showDelayInput.value = currentSettings.showDelay.toString();
    showDelayValue.textContent = `${currentSettings.showDelay}ms`;

    hideDelayInput.value = currentSettings.hideDelay.toString();
    hideDelayValue.textContent = `${currentSettings.hideDelay}ms`;

    const updateSettings = async () => {
      const newSettings = {
        notificationStyle: styleSelect.value as NotificationStyle,
        showDelay: parseInt(showDelayInput.value),
        hideDelay: parseInt(hideDelayInput.value),
      };
      await settings.setValue(newSettings);
      showDelayValue.textContent = `${newSettings.showDelay}ms`;
      hideDelayValue.textContent = `${newSettings.hideDelay}ms`;
    };

    styleSelect.addEventListener("change", updateSettings);
    showDelayInput.addEventListener("input", updateSettings);
    hideDelayInput.addEventListener("input", updateSettings);
  } catch (err) {
    console.error("Typst QoL: Failed to load settings:", err);
  }
})();
