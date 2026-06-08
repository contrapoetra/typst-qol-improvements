export default defineContentScript({
  matches: ["*://typst.app/*"],
  main() {
    const ERROR_SELECTOR = '[data-type="errors"]';
    const PREVIEW_SELECTOR = "._previewPane_1blcv_48";

    let overlay: HTMLDivElement | null = null;

    const createOverlay = () => {
      const container = document.createElement("div");
      container.id = "typst-qol-error-overlay";

      Object.assign(container.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        color: "#000000",
        padding: "20px 32px",
        borderRadius: "8px",
        zIndex: "10000",
        pointerEvents: "none",
        display: "none",
        textAlign: "center",
        border: "1px solid #030101",
        boxShadow: "inset 0 0 0 1px rgba(254, 202, 202, 0.5)",
        fontFamily: '"Libre Baskerville", serif',
      });

      const title = document.createElement("div");
      title.textContent = "Compilation Error";
      Object.assign(title.style, {
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "8px",
      });

      const subtitle = document.createElement("div");
      subtitle.textContent =
        "See red squiggly lines or the Issues tab for more information.";
      Object.assign(subtitle.style, {
        fontSize: "14px",
        opacity: "1",
        fontWeight: "600",
      });

      container.appendChild(title);
      container.appendChild(subtitle);
      return container;
    };

    const injectStyles = () => {
      if (document.getElementById("typst-qol-styles")) return;

      const style = document.createElement("style");
      style.id = "typst-qol-styles";
      style.textContent = `
        @font-face {
          font-family: 'Libre Baskerville';
          src: url('${browser.runtime.getURL("/fonts/LibreBaskerville-VariableFont_wght.ttf")}') format('truetype');
          font-weight: 100 900;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    };

    const updateOverlay = () => {
      const errorIndicator = document.querySelector(ERROR_SELECTOR);
      const previewPane = document.querySelector(
        PREVIEW_SELECTOR,
      ) as HTMLElement;

      const hasError =
        errorIndicator &&
        errorIndicator.textContent &&
        parseInt(errorIndicator.textContent) > 0;

      if (previewPane) {
        if (window.getComputedStyle(previewPane).position === "static") {
          previewPane.style.position = "relative";
        }

        if (!overlay) {
          injectStyles();
          overlay = createOverlay();
          previewPane.appendChild(overlay);
        }

        if (overlay.parentElement !== previewPane) {
          previewPane.appendChild(overlay);
        }

        overlay.style.display = hasError ? "block" : "none";
      }
    };

    const observer = new MutationObserver(() => updateOverlay());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    updateOverlay();
  },
});
