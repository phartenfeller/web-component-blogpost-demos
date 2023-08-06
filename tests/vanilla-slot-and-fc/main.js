const template = document.createElement("template");
template.id = "dialog-template";
template.innerHTML = `
<style>
dialog {
  max-width: 90%;
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dialog-header {
  font-size: 1.5em;
  margin-bottom: 20px;
}
.dialog-content {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: right;
}
</style>
<dialog>
<header class="dialog-header">Default Title</header>
<main class="dialog-content">
  <slot name="content"></slot>
</main>
<footer class="dialog-footer">
  <button>Cancel</button>
</footer>
</dialog>
`;

class DialogComponent extends HTMLElement {
  constructor() {
    super();

    const templateClone = template.content.cloneNode(true);

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateClone);

    this.dialogEl = this.shadowRoot.querySelector("dialog");
    this.headerEl = this.shadowRoot.querySelector(".dialog-header");
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.close();
    });
    this.headerEl.textContent = this.getAttribute("title");
  }

  static get observedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") {
      this.headerEl.textContent = newValue;
    }
  }

  open() {
    this.dialogEl.setAttribute("open", "");
    this.#privateMethod("open");
  }

  close() {
    this.dialogEl.removeAttribute("open");
  }

  #privateMethod(context) {
    console.log("private method", context);
  }
}

customElements.define("my-dialog", DialogComponent);
