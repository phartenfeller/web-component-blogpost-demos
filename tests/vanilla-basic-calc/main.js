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
  <button id="calculate">Calculate</button>
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

    const templateClone = template.content.cloneNode(true);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateClone);

    this.calcBtn = this.shadowRoot.querySelector("#calculate");
    this.lengthInput = this.shadowRoot.querySelector("#length");
    this.widthInput = this.shadowRoot.querySelector("#width");
    this.depthInput = this.shadowRoot.querySelector("#depth");
    this.capacityOutput = this.shadowRoot.querySelector("#capacity");
    this.areaOutput = this.shadowRoot.querySelector("#area");

    this.calculate = this.calculate.bind(this);
  }

  connectedCallback() {
    this.calcBtn.addEventListener("click", this.calculate);
  }

  disconnectedCallback() {
    this.calcBtn.removeEventListener("click", this.calculate);
  }

  calculate() {
    const length = this.lengthInput.valueAsNumber;
    const width = this.widthInput.valueAsNumber;
    const depth = this.depthInput.valueAsNumber;

    const capacity = length * width * depth;
    const area = 2 * (width * depth + length * depth) + length * width; // walls + floor

    this.capacityOutput.textContent = capacity;
    this.areaOutput.textContent = area;
  }
}

customElements.define("pool-dimensions", PoolDimensions);
