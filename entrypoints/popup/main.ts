import "./style.css";
import typescriptLogo from "@/assets/typescript.svg";
import extensionLogo from "@/assets/logo.svg";
import { setupCounter } from "@/components/counter";

const app = document.querySelector<HTMLDivElement>("#app")!;

const container = document.createElement("div");

const wxtLink = document.createElement("a");
wxtLink.href = "https://wxt.dev";
wxtLink.target = "_blank";
const wxtImg = document.createElement("img");
wxtImg.src = extensionLogo;
wxtImg.className = "logo";
wxtImg.alt = "Extension logo";
wxtLink.appendChild(wxtImg);

const tsLink = document.createElement("a");
tsLink.href = "https://www.typescriptlang.org/";
tsLink.target = "_blank";
const tsImg = document.createElement("img");
tsImg.src = typescriptLogo;
tsImg.className = "logo vanilla";
tsImg.alt = "TypeScript logo";
tsLink.appendChild(tsImg);

const h1 = document.createElement("h1");
h1.textContent = "Typst QoL Improvements";

const card = document.createElement("div");
card.className = "card";
const button = document.createElement("button");
button.id = "counter";
button.type = "button";
card.appendChild(button);

const p = document.createElement("p");
p.className = "read-the-docs";
p.textContent = "Quality of life improvements for the Typst web app.";

container.append(wxtLink, tsLink, h1, card, p);
app.appendChild(container);

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
