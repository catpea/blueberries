import { Signal, DisposableSinusoidalListener } from "#sinusoid";

import { DisposableEventListener } from "../util/DisposableEventListener.js";
import { GradientCalculator } from "../util/GradientCalculator.js";
import { DisposableArrayListener, ReactiveArray, detectSetChanges, detectOrderChanges } from "../util/ReactiveArray.js";

const gradientCalculator = new GradientCalculator();

// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement("template");
template.innerHTML = `
  <link href="https://cdn.jsdelivr.net/npm/epidermis/reset.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/epidermis/controls.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/epidermis/developer.css" rel="stylesheet">
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
  <table class="table debug-message debug-visible"  data-debug="theme-grid">
    <thead>
      <tr id="tableHeader">
      </tr>
    </thead>

    <tbody id="tableBody">
      <tr id="varianceAdjust"></tr>
    </tbody>

  </table>
`;

export class ThemeGrid extends HTMLElement {
  #colorStops = new ReactiveArray(); // set by external web-component

  #disposables = new Map();
  addDisposable(disposable, key = "this") {
    if (typeof disposable?.dispose !== "function") throw new TypeError("This is for SomeDisposable.dispose() only.");
    if (!this.#disposables.has(key)) this.#disposables.set(key, new Set());
    this.#disposables.get(key).add(disposable);
  }
  hasDisposable(key = "this") {
    const set = this.#disposables.get(key);
    return !!(set && set.size > 0);
  }
  disposeDisposables(key = "this") {
    const set = this.#disposables.get(key);
    if (!set || set.size === 0) return;
    const disposables = Array.from(set);
    set.clear();
    this.#disposables.delete(key);
    disposables.map((o) => o.dispose());
  }

  #rows = new ReactiveArray({ id: "level9" }, { id: "level8" }, { id: "level7" }, { id: "level6" }, { id: "level5" }, { id: "level4" }, { id: "level3" }, { id: "level2" }, { id: "level1" }, { id: "level0" });

  // level5,  level4,  level3,  level2,  level1
  // caption,  backdrop,  background,  raised,  foreground,  text,  link,  info,  success,  warning,  danger,  muted,
  #columns = new ReactiveArray(
    { id: "caption", variance: new Signal(0.7) },
    { id: "backdrop", variance: new Signal(0.2) },
    { id: "background", variance: new Signal(0.6) },
    { id: "raised", variance: new Signal(0.1) },
    { id: "foreground", variance: new Signal(0.5) },
    { id: "text", variance: new Signal(0.4) },
    { id: "link", variance: new Signal(0.9) },

    // {id: 'info', value:new Signal(0.8)},
    // {id: 'success', value:new Signal(0.9)},
    // {id: 'warning', value:new Signal(0.10)},
    // {id: 'danger', value:new Signal(0.11)},
    // {id: 'muted', value:new Signal(0.12)},
  );

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.tableHeader = shadow.querySelector("#tableHeader");
    this.tableBody = shadow.querySelector("#tableBody");
    this.varianceAdjust = shadow.querySelector("#varianceAdjust");

    this.initializeTable();
  }

  initializeTable() {
    this.addDisposable(new DisposableArrayListener(this.#columns, "change", (e) => this.renderTableHeaders()));
    this.addDisposable(new DisposableArrayListener(this.#columns, "change", (e) => this.renderVarianceAdjust()));
    this.addDisposable(new DisposableArrayListener(this.#colorStops, "change", (e) => this.renderTableRows()));

    this.#colorStops.rev.subscribe(([rev])=>console.info(`this.#colorStops revision is now at ${rev}`))

  }

  renderTableHeaders() {
    this.tableHeader.textContent = "";
    const th = document.createElement("th"); // ID/blank Header (never changes)
    th.setAttribute("scope", "col");
    this.tableHeader.appendChild(th);
    for (const { id } of this.#columns) {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = id;
      this.tableHeader.appendChild(th);
    }
  }

  renderVarianceAdjust() {
    this.varianceAdjust.textContent = "";

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.textContent = "variance";
    this.varianceAdjust.appendChild(th);

    for (const entry of this.#columns) {
      const td = document.createElement("td");

      const varianceInput = document.createElement("input");
      varianceInput.setAttribute("type", "number");
      varianceInput.setAttribute("min", "0");
      varianceInput.setAttribute("max", "1");
      varianceInput.setAttribute("step", "0.01");
      varianceInput.setAttribute("value", entry.variance.value);
      td.appendChild(varianceInput);

      const eventHandler = (e) => {
        entry.variance.value = e.target.value;
      };

      const disposableId = `variance-input-${entry.id}`;
      const disposableListener = new DisposableEventListener(varianceInput, "input", eventHandler);
      this.disposeDisposables(disposableId);
      this.addDisposable(disposableListener, disposableId);

      this.varianceAdjust.appendChild(td);
    }
  }

  renderTableRows() {
    this.tableBody.querySelectorAll("tr.color-row").forEach((row) => row.remove());

    for (const [rowIndex, { id: rowId }] of this.#rows.entries()) {
      const tr = document.createElement("tr");
      tr.setAttribute("class", "color-row");

      //ROW HEADER
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.textContent = rowId;
      tr.appendChild(th);
      //ROW HEADER

      for (const [colIndex, { id: colId }] of this.#columns.entries()) {
        const td = document.createElement("td");
        td.classList.add(`${rowId}-${colId}`);

        const varianceSignal = this.#columns[colIndex].variance;

        const varianceSignalUpdateHandler = (v) => {
          const colorValue = v;
          const fraction = (rowIndex + 1) / this.#rows.length;
          const percentage = 100 * fraction;
          const baseColor = gradientCalculator.getColorAtPercentage(this.#colorStops, 100 - percentage);
          const localColor = this.#colorTransformer(baseColor, colorValue);
          td.style.background = localColor;
        };
        const disposableListener = new DisposableSinusoidalListener(varianceSignal, varianceSignalUpdateHandler);
        this.disposeDisposables(`${rowId}-${colId}`);
        this.addDisposable(disposableListener, `${rowId}-${colId}`);

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
        this.#colorStops.splice(0, this.#colorStops.length, ...JSON.parse(newValue));
      } catch (e) {
        console.error("Invalid gradient-stops JSON:", e);
      }
    }
  }

  #internal() {
    this.dispatchEvent(new CustomEvent("something", { bubbles: true }));
  }

  #colorTransformer(baseColor, colorVariant) {
    const hslColor = gradientCalculator.hexToHsl(baseColor);
    const shadedHsl = gradientCalculator.toShade(hslColor, 1 - colorVariant);
    return gradientCalculator.hslToHex(shadedHsl);
  }
}
