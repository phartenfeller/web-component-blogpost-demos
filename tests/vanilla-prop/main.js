const template = document.createElement("template");
template.id = "pool-calculator-template";
template.innerHTML = `
<div class="input-section">
</div>
`;

class PropTest extends HTMLElement {
  constructor() {
    // always call super() first in the constructor
    super();
    const templateClone = template.content.cloneNode(true);

    this.state = {};

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateClone);
  }

  setText(text) {
    this.shadowRoot.querySelector(".input-section").textContent = text;
  }

  set prop1(value) {
    this.state.prop1 = value;
    this.setText(value);
  }

  get prop1() {
    return this.state.prop1;
  }
}

customElements.define("prop-test", PropTest);
