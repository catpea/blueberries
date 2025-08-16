// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement('template');
// we use html`` as it enables syntax higlighiting in zed editor
template.innerHTML = html`
  <style>
  :host { }
  input {
    width: 100%
  }
  </style>

  <input type="range" class="form-range" id="level1HueRange" min="0" max="360">
  <input type="range" class="form-range" id="level2HueRange" min="0" max="360">
  <input type="range" class="form-range" id="level3HueRange" min="0" max="360">
  <input type="range" class="form-range" id="level4HueRange" min="0" max="360">
  <input type="range" class="form-range" id="level5HueRange" min="0" max="360">
  <hr>
  <input type="range" class="form-range" id="intensityRange" min="1" max="10">

`;

export class ThemeCustomizer extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("theme-customizer", ThemeCustomizer);
function html(a,...b) { return (Array.from({ length: Math.max(a.length, b.length) }, (_, index) => [a[index], b[index]])).flat().join('') }  // For Code Highlighters (zed editor treats html`` as html and highlights the syntax)
