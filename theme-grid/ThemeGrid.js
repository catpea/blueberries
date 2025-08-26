import { DisposableEventListener } from '../util/DisposableEventListener.js';


// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement("template");
template.innerHTML = `
  <link href="../reset.css" rel="stylesheet">
  <link href="../controls.css" rel="stylesheet">
  <link href="../developer.css" rel="stylesheet">
  <style>
    :host {
      --table-bg-color: var(--l3-bg); /* Background color of the table */
      --header-bg-color: var(--l4-bg); /* Background color of the header */
      --header-text-color: var(--text); /* Text color for the header */
      --text-color: var(--text); /* Text color for the table body */
      --border-color: var(--l3-br); /* Border color */
      --border-radius: 10px; /* Border radius for rounded corners */
      --padding: 10px; /* Padding for table cells */
      --font-family: Arial, sans-serif; /* Font family */

      background: var(--l3-bg);

    }
    class-name:hover{ }
    ::slotted(*:not([slot])) { }
    ::slotted([slot="slot-name"]) { }
    .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(1px,1px,1px,1px); }

    .table {
      width: 100%;
      font-family: var(--font-family);
      font-size: x-small;
    }

    .table th,
    .table td {
      padding: var(--padding);
      text-align: left;
      border-radius: var(--border-radius); /* Apply border-radius to cells */
      border: 1px solid var(--border-color);
    }




    .table thead {
      border: none;
    }
    .table thead th {
      border: none;
    }
    .table thead th {
      border: none;
    }

    .table tbody th {
      border: none;
    }

    /*
    .table tbody tr:nth-child(even) td {
      background-color:var(--l3-bg); /* Light gray for even rows */
    }

    .table tbody tr:hover td {
      background-color: var(--l3-fg); /* Highlight on hover */
    }
    */

  </style>
  <table class="table debug-message debug-visible"  data-debug="ThemeGrid extends HTMLElement">
    <thead>
      <tr id="tableHeader">

      </tr>
    </thead>

    <tbody id="tableBody">

    </tbody>

  </table>
`;

export class ThemeGrid extends HTMLElement {
  #colorStops = []; // set by external web-component
  #disposables = new Set();

  #rows = [

    { id: "level9" },
    { id: "level8" },
    { id: "level7" },
    { id: "level6" },
    { id: "level5" },
    { id: "level4" },
    { id: "level3" },
    { id: "level2" },
    { id: "level1" },
    { id: "level0" },

  ];

  // level5,  level4,  level3,  level2,  level1
  // caption,  backdrop,  background,  raised,  foreground,  text,  link,  info,  success,  warning,  danger,  muted,
  #columns = [

    { id: "caption",    value: 0.7 },
    { id: "backdrop",   value: 0.2 },
    { id: "background", value: 0.6 },
    { id: "raised",     value: 0.1 },
    { id: "foreground", value: 0.5 },
    { id: "text",       value: 0.4 },
    { id: "link",       value: 0.9 },

    // {id: 'info', value:0.8},
    // {id: 'success', value:0.9},
    // {id: 'warning', value:0.10},
    // {id: 'danger', value:0.11},
    // {id: 'muted', value:0.12},
  ];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.tableHeader = shadow.querySelector("#tableHeader");
    this.tableBody = shadow.querySelector("#tableBody");

    this.initializeTable();
  }

  initializeTable() {
    this.tableHeader.textContent = "";
    this.renderTableHeaders();
    this.renderVarianceSteppers();
  }

  updateTable(){

    this.tableBody.querySelectorAll('tr.color-row').forEach(row => row.remove());
    this.renderTableRows();

  }

  renderTableHeaders() {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.textContent = "id";
    this.tableHeader.appendChild(th);

    for (const { id } of this.#columns) {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = id;
      this.tableHeader.appendChild(th);
    }
  }

  renderVarianceSteppers() {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.textContent = "variance";
    tr.appendChild(th);

    for (const entry of this.#columns ) {
      const td = document.createElement("td");

      const varianceInput = document.createElement("input");
      varianceInput.setAttribute("type", "number");
      varianceInput.setAttribute("min", "0");
      varianceInput.setAttribute("max", "1");
      varianceInput.setAttribute("step", "0.01");
      varianceInput.setAttribute("value", entry.value);
      td.appendChild(varianceInput);

      const eventHandler = (e)=> {
        entry.value = e.target.value;
        this.updateTable();
      };

      const disposableListener = new DisposableEventListener(varianceInput, 'input', eventHandler);
      this.#disposables.add(disposableListener)

      tr.appendChild(td);
    }

    this.tableBody.appendChild(tr);
  }

  renderTableRows() {
    for (const [rowIndex, { id: rowId }] of this.#rows.entries()) {
      const tr = document.createElement("tr");
      tr.setAttribute('class', 'color-row');

      //ROW HEADER
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.textContent = rowId;
      tr.appendChild(th);
      //ROW HEADER

      for (const [colIndex, { id: colId }] of this.#columns.entries()) {
        const colorValue = this.#columns[colIndex].value;
        const fraction = (rowIndex + 1) / this.#rows.length;
        const percentage = 100 * fraction;

        const baseColor = this.getColorAtPercentage(100-percentage);

        const localColor = this.#colorTransformer(baseColor, colorValue);

        const td = document.createElement("td");
        td.style.background = localColor;

        td.classList.add(`${rowId}-${colId}`);
        // td.textContent = `${rowId}-${colId}`;
        const inkWell = document.createElement("input");
        inkWell.setAttribute("type", "color");
        // td.appendChild(inkWell);

        tr.appendChild(td);
      }

      this.tableBody.appendChild(tr);
    }
  }

  connectedCallback() {}

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["gradient-stops"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "gradient-stops" && newValue) {
      try {
        console.log(newValue);
        this.#colorStops = JSON.parse(newValue);
        this.updateTable();
      } catch (e) {
        console.error("Invalid gradient-stops JSON:", e);
      }
    }
  }

  #internal() {
    this.dispatchEvent(new CustomEvent("something", { bubbles: true }));
  }

  #colorTransformer(baseColor, colorValue) {
    console.log({baseColor, colorValue})
    const hslColor = this.hexToHsl(baseColor);
    const shadedHsl = this.toShade(hslColor, 1-colorValue)
    return this.hslToHex(shadedHsl);
  }

  hexToHsl(hex){
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb);
    return hsl;
  }

  hslToHex(hsl){
    const rgb = this.hslToRgb(hsl);
    const hex = this.rgbToHex(rgb);
    return hex;
  }



  toShade({h, s, l}, shadeFactor = 0.3) {
    // shadeFactor: 0 = no change, 1 = completely dark
    // Clamp shadeFactor between 0 and 1
    shadeFactor = Math.max(0, Math.min(1, shadeFactor));

    // Primary effect: reduce lightness
    const newL = l * (1 - shadeFactor);

    // Secondary effect: slightly reduce saturation in deeper shadows
    // Saturation reduction is less pronounced than lightness reduction
    const saturationReduction = shadeFactor * 0.2; // 20% of the shade factor
    const newS = s * (1 - saturationReduction);

    // Tertiary effect: very subtle hue shift toward blue (cooler shadows)
    // This is optional and very subtle - only noticeable in deep shadows
    let newH = h;
    if (shadeFactor > 0.5) {
      // Shift slightly toward blue (240°) for deeper shadows
      const hueShiftAmount = (shadeFactor - 0.5) * 10; // Max 5° shift
      newH = h + hueShiftAmount;
      // Wrap hue around 360°
      if (newH >= 360) newH -= 360;
      if (newH < 0) newH += 360;
    }

    return {
      h: Math.round(newH),
      s: Math.round(Math.max(0, Math.min(100, newS))),
      l: Math.round(Math.max(0, Math.min(100, newL))),
    };
  }

  getColorAtPercentage(percentage) {

    if(!this.#colorStops.length) return "#000";

    // Prepare
    const sorted = [...this.#colorStops].sort((a, b) => a.percentage - b.percentage);

    // If percentate is less than the percentage of the first color stop, return that color-stops value
    if( percentage <= sorted[0].percentage ) return sorted[0].color;

    // if percentate is beyond the last color, return that last colors value;
    if( percentage >= sorted[sorted.length-1].percentage ) return sorted[sorted.length-1].color;


    // Simple interpolation for new stops
    for (let i = 0; i < sorted.length - 1; i++) {

      // if percenatare is between the two
      if (sorted[i].percentage <= percentage && sorted[i + 1].percentage >= percentage) {
        const ratio = (percentage - sorted[i].percentage) / (sorted[i + 1].percentage - sorted[i].percentage);
        return this.interpolateColors(sorted[i].color, sorted[i + 1].color, ratio);
      }

    }

  }

  interpolateColors(color1, color2, ratio) {
    const c1 = this.hexToRgb(this.ensureHexColor(color1));
    const c2 = this.hexToRgb(this.ensureHexColor(color2));

    const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
    const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
    const b = Math.round(c1.b + (c2.b - c1.b) * ratio);

    return this.rgbStrToHex(`rgb(${r}, ${g}, ${b})`);
  }

  rgbToHex({r, g, b}) {
    const rr = r.toString(16).padStart(2, "0");
    const gg = g.toString(16).padStart(2, "0");
    const bb = b.toString(16).padStart(2, "0");
    return `#${rr}${gg}${bb}`;
  }
  rgbStrToHex(rgb) {


    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return "#000000";

    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
  }
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  // Input: { r: 0-255, g: 0-255, b: 0-255 }
  // Output: { h: 0-360, s: 0-100, l: 0-100 }
  rgbToHsl({ r, g, b }) {
    // normalize to [0,1]
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    // Lightness
    let l = (max + min) / 2;

    // Saturation
    let s = 0;
    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));
    }

    // Hue
    let h = 0;
    if (delta !== 0) {
      if (max === rn) {
        h = ((gn - bn) / delta) % 6;
      } else if (max === gn) {
        h = (bn - rn) / delta + 2;
      } else {
        h = (rn - gn) / delta + 4;
      }
      h = h * 60;
      if (h < 0) h += 360;
    }

    // convert s and l to percentages
    return {
      h: Math.round(h * 100) / 100, // optional: round to 2 decimals
      s: Math.round(s * 10000) / 100, // s as percentage with 2 decimals
      l: Math.round(l * 10000) / 100, // l as percentage with 2 decimals
    };
  }

  hslToRgb({ h, s, l }) {
    // h: 0-360, s & l: 0-100 (percent)
    const H = ((h % 360) + 360) % 360; // normalize
    const S = Math.max(0, Math.min(100, s)) / 100;
    const L = Math.max(0, Math.min(100, l)) / 100;

    if (S === 0) {
      // achromatic (gray)
      const val = Math.round(L * 255);
      return { r: val, g: val, b: val };
    }

    const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    const p = 2 * L - q;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const hk = H / 360;
    const r = hue2rgb(p, q, hk + 1 / 3);
    const g = hue2rgb(p, q, hk);
    const b = hue2rgb(p, q, hk - 1 / 3);

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  ensureHexColor(color) {
    if (color.startsWith("#")) return color;
    if (color.startsWith("rgb")) return this.rgbStrToHex(color);
    return color;
  }
}
