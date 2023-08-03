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
  <label>Water Capacity (<span class="capacity-unit">cubic liters</span>): </label>
  <span id="capacity"></span>
  <br>
  <label>Surface Area (<span class="area-unit">square meters</span>): </label>
  <span id="area"></span>
</div>
`;

class PoolDimensions extends HTMLElement {
  static get observedAttributes() {
    return ["units"];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.lengthInput = this.shadowRoot.getElementById("length");
    this.widthInput = this.shadowRoot.getElementById("width");
    this.depthInput = this.shadowRoot.getElementById("depth");
    this.capacityOutput = this.shadowRoot.getElementById("capacity");
    this.areaOutput = this.shadowRoot.getElementById("area");

    this.lengthUnits = this.shadowRoot.querySelectorAll(".length-unit");
    this.capacityUnits = this.shadowRoot.querySelector(".capacity-unit");
    this.areaUnits = this.shadowRoot.querySelector(".area-unit");

    this.isMetric = true;
  }

  connectedCallback() {
    this.calcBtn = this.shadowRoot.getElementById("calculate");
    this.calcBtn.addEventListener("click", this.calculate);

    this.setUnits();

    if (this.data) {
      const { length, width, depth } = this.data;
      this.lengthInput.value = length;
      this.widthInput.value = width;
      this.depthInput.value = depth;
      this.calculate();
    }
  }

  disconnectedCallback() {
    console.log(`[${this.getAttribute("id")}] disconnectedCallback.`);
    this.calcBtn.removeEventListener("click", this.calculate);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`[${this.getAttribute("id")}] attributeChangedCallback:`, {
      name,
      oldValue,
      newValue,
    });
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
    this.isMetric = units === "metric";

    this.lengthUnits.forEach(
      (el) => (el.textContent = this.isMetric ? "meters" : "feet")
    );
    this.capacityUnits.textContent = this.isMetric ? "cubic liters" : "gallons";
    this.areaUnits.textContent = this.isMetric
      ? "square meters"
      : "square feet";

    // recalc
    this.calculate();
  }

  calculate() {
    let length = this.lengthInput.valueAsNumber;
    let width = this.widthInput.valueAsNumber;
    let depth = this.depthInput.valueAsNumber;

    const capacity = length * width * depth;
    const area = 2 * (width * depth + length * depth) + length * width; // walls + floor

    if (!this.isMetric) {
      // Convert cubic meters to gallons
      this.capacityOutput.textContent = isNaN(capacity)
        ? ""
        : (capacity * 264.172).toFixed(1);
    } else {
      this.capacityOutput.textContent = isNaN(capacity) ? "" : capacity;
    }
    this.areaOutput.textContent = isNaN(area) ? "" : area;
  }
}

customElements.define("pool-dimensions", PoolDimensions);
