import { settings, NotificationStyle, Settings } from "@/utils/settings";

export default defineContentScript({
  matches: ["*://typst.app/*"],
  async main() {
    const ERROR_SELECTOR = '[data-type="errors"]';
    const PREVIEW_SELECTOR = "._previewPane_1blcv_48";
    const TOAST_WRAPPER_CLASS = "_wrapper_1gidb_1";

    let overlay: HTMLDivElement | null = null;
    let toast: HTMLDivElement | null = null;
    let currentStyle: NotificationStyle = (await settings.getValue())
      .notificationStyle;

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

    const createToast = () => {
      const el = document.createElement("div");
      el.id = "typst-qol-toast";
      el.textContent = "Compilation Error ⚠️";

      Object.assign(el.style, {
        backgroundColor: "rgb(220, 38, 38)",
        color: "rgb(255, 255, 255)",
        padding: "12px 32px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "53px",
        fontSize: "13px",
        fontWeight: "500",
        boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 12px",
        border: "1px solid rgb(153, 27, 27)",
        fontFamily: "Inter, sans-serif",
        transition: "transform 0.23s cubic-bezier(0.21, 1.02, 0.73, 1)",
        pointerEvents: "auto",
        lineHeight: "1.2",
        whiteSpace: "nowrap",
        display: "none",
      });
      return el;
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

    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;
    let showDelay = (await settings.getValue()).showDelay;
    let hideDelay = (await settings.getValue()).hideDelay;

    const updateUI = () => {
      const errorIndicator = document.querySelector(ERROR_SELECTOR);
      const hasError =
        errorIndicator &&
        errorIndicator.textContent &&
        parseInt(errorIndicator.textContent) > 0;

      if (hasError) {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }

        if (
          !showTimeout &&
          (!overlay || overlay.style.display === "none") &&
          (!toast || toast.style.display === "none")
        ) {
          showTimeout = setTimeout(() => {
            renderUI(true);
            showTimeout = null;
          }, showDelay);
        } else if (
          (overlay && overlay.style.display === "block") ||
          (toast && toast.style.display === "block")
        ) {
          renderUI(true);
        }
      } else {
        if (showTimeout) {
          clearTimeout(showTimeout);
          showTimeout = null;
        }

        if (
          !hideTimeout &&
          ((overlay && overlay.style.display === "block") ||
            (toast && toast.style.display === "block"))
        ) {
          hideTimeout = setTimeout(() => {
            renderUI(false);
            hideTimeout = null;
          }, hideDelay);
        }
      }
    };

    const renderUI = (visible: boolean) => {
      if (currentStyle === "overlay") {
        if (toast) toast.style.display = "none";

        const previewPane = document.querySelector(
          PREVIEW_SELECTOR,
        ) as HTMLElement;
        if (previewPane) {
          if (window.getComputedStyle(previewPane).position === "static") {
            previewPane.style.position = "relative";
          }
          if (!overlay) {
            injectStyles();
            overlay = createOverlay();
            previewPane.appendChild(overlay);
          }
          overlay.style.display = visible ? "block" : "none";
        }
      } else {
        if (overlay) overlay.style.display = "none";

        let wrapper = document.querySelector(`.${TOAST_WRAPPER_CLASS}`);
        if (!wrapper) {
          wrapper = document.createElement("div");
          wrapper.className = TOAST_WRAPPER_CLASS;
          Object.assign((wrapper as HTMLElement).style, {
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            gap: "8px",
            position: "fixed",
            left: "0",
            right: "0",
            bottom: "0",
            padding: "16px",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: "100000",
          });
          document.body.appendChild(wrapper);
        }

        if (!toast) {
          toast = createToast();
          wrapper.appendChild(toast);
        }

        toast.style.display = visible ? "block" : "none";
        toast.style.transform = visible ? "translateY(0)" : "translateY(100px)";
      }
    };

    settings.watch((newSettings: Settings) => {
      currentStyle = newSettings.notificationStyle;
      showDelay = newSettings.showDelay;
      hideDelay = newSettings.hideDelay;
      updateUI();
    });

    const observer = new MutationObserver(() => updateUI());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    updateUI();
  },
});
