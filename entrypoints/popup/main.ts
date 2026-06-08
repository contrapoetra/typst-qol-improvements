import "./style.css";
import typescriptLogo from "@/assets/typescript.svg";
import extensionLogo from "@/assets/logo.svg";
import { setupCounter } from "@/components/counter";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://wxt.dev" target="_blank">
      <img src="${extensionLogo}" class="logo" alt="Extension logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Typst QoL Improvements</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Quality of life improvements for the Typst web app.
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
