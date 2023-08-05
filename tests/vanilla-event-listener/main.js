const template = document.createElement("template");
template.id = "pool-calculator-template";
template.innerHTML = `
<style>
.dimension-inputs {
  display: grid;
  grid-template-columns: 15ch 10ch;
  row-gap: 0.4rem;
}

#calculate {
  margin: 0.8rem 0;
  padding: 0.3rem;
  background-color: #7dd3fc;
  border: 1px solid #7dd3fc;
  border-radius: 0.25rem;
  color: #0c4a6e;
}

#calculate:hover {
  background-color: #e0f2fe;
}

#calculate:focus {
  border-color: #0c4a6e;
}

</style>
<div class="input-section">
  <div class="dimension-inputs">
    <label for="length">Length (meters)</label>
    <input id="length" type="number" min="0" />
    <label for="width">Width (meters)</label>
    <input id="width" type="number" min="0" />
    <label for="depth">Depth (meters)</label>
    <input id="depth" type="number" min="0" />
  </div>
  <button id="calculate">Calculate (constr)</button>
  <button id="calculate-cb">Calculate (conn cb)</button>
</div>
<div class="output-section">
  <label>Water Capacity (liters): </label>
  <span id="capacity"></span>
  <br />
  <label>Surface Area (square meters): </label>
  <span id="area"></span>
</div>
`;

class PoolDimensions extends HTMLElement {
  constructor() {
    // always call super() first in the constructor
    super();
    console.log("constructor");
    const templateClone = template.content.cloneNode(true);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateClone);

    this.logClick = this.logClick.bind(this);
    this.lenInp = this.shadowRoot.querySelector("#length");

    this.button = this.shadowRoot.querySelector("#calculate");
    this.cbButton = this.shadowRoot.querySelector("#calculate-cb");

    this.button.addEventListener("click", this.logClick);
  }

  connectedCallback() {
    console.log("connectedCallback");
    this.cbButton.addEventListener("click", this.logClick);
  }

  disconnectedCallback() {
    console.log("disconnectedCallback");
    this.button.removeEventListener("click", this.logClick);
    this.cbButton.removeEventListener("click", this.logClick);
  }

  logClick(e) {
    console.log("clicked", e.target.textContent, "length", this.lenInp.value);
  }
}

customElements.define("pool-dimensions", PoolDimensions);
