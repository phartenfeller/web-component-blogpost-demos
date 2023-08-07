const template = document.createElement("template");
template.id = "pool-calculator-template";
template.innerHTML = `
<div class="input-section">
</div>
`;

class PropTest extends HTMLElement {
  static get observedAttributes() {
    return ["prop1"];
  }

  constructor() {
    // always call super() first in the constructor
    super();
    const templateClone = template.content.cloneNode(true);

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateClone);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);
    this.setText(newValue);
  }

  setText(text) {
    this.shadow.querySelector(".input-section").textContent = text;
  }

  set prop1(value) {
    console.log("set prop1", value);
    this.setAttribute("prop1", value);
  }

  get prop1() {
    return this.getAttribute("prop1");
  }
}

customElements.define("prop-test", PropTest);
