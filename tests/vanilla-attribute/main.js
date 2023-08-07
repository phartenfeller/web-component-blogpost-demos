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
  <label for="length">Length (<span class="length-unit">meters</span>)</label>
  <input id="length" type="number" min="0">
  <label for="width">Width (<span class="length-unit">meters</span>)</label>
  <input id="width" type="number" min="0">
  <label for="depth">Depth (<span class="length-unit">meters</span>)</label>
  <input id="depth" type="number" min="0">
  </div>
  <button id="calculate">Calculate</button>
</div>
<div class="output-section">
<label>Water Capacity (<span class="capacity-unit">liters</span>): </label>
  <span id="capacity"></span>
  <br />
  <label>Surface Area (<span class="area-unit">square meters</span>): </label>
  <span id="area"></span>
</div>
`;

class PoolDimensions extends HTMLElement {
  static get observedAttributes() {
    return ["units"];
  }

  constructor() {
    // always call super() first in the constructor
    super();

    const templateClone = template.content.cloneNode(true);

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateClone);

    this.calcBtn = this.shadow.querySelector("#calculate");
    this.lengthInput = this.shadow.querySelector("#length");
    this.widthInput = this.shadow.querySelector("#width");
    this.depthInput = this.shadow.querySelector("#depth");
    this.capacityOutput = this.shadow.querySelector("#capacity");
    this.areaOutput = this.shadow.querySelector("#area");

    this.lengthTexts = this.shadow.querySelectorAll(".length-unit");
    this.capacityText = this.shadow.querySelector(".capacity-unit");
    this.areaText = this.shadow.querySelector(".area-unit");

    this.calculate = this.calculate.bind(this);
  }

  connectedCallback() {
    this.calcBtn.addEventListener("click", this.calculate);
    this.setUnits();
  }

  disconnectedCallback() {
    this.calcBtn.removeEventListener("click", this.calculate);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "units":
        this.setUnits();
        break;
      default:
        console.warn(
          `[${this.getAttribute("id")}] Unhandled attribute change:`,
          name
        );
    }
  }

  setUnits() {
    const units = this.getAttribute("units") ?? "metric";

    switch (units) {
      case "metric":
        this.isMetric = true;
        break;
      case "imperial":
        this.isMetric = false;
        break;
      default:
        console.warn(
          `[${this.getAttribute("id")}] Invalid units attribute:`,
          units
        );
        this.isMetric = true;
    }

    this.lengthTexts.forEach(
      (el) => (el.textContent = this.isMetric ? "meters" : "feet")
    );
    this.capacityText.textContent = this.isMetric ? "liters" : "gallons";
    this.areaText.textContent = this.isMetric ? "square meters" : "square feet";

    // recalc
    this.calculate();
  }

  calculate() {
    const length = this.lengthInput.valueAsNumber;
    const width = this.widthInput.valueAsNumber;
    const depth = this.depthInput.valueAsNumber;

    const capacity = length * width * depth * 1000; // cubic meters to liters
    const area = 2 * (width * depth + length * depth) + length * width; // walls + floor

    if (isNaN(capacity) || isNaN(area)) {
      return;
    }

    if (!this.isMetric) {
      // Convert cubic meters to gallons
      this.capacityOutput.textContent = (capacity * 0.2642).toFixed(1);
    } else {
      this.capacityOutput.textContent = capacity;
    }
    this.areaOutput.textContent = area;
  }
}

customElements.define("pool-dimensions", PoolDimensions);
