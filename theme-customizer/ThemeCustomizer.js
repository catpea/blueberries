import {fromInput, derived, effect} from '#ladybits';

// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement('template');
// we use html`` as it enables syntax higlighiting in zed editor
template.innerHTML = html`
  <style>
  :host { }
  </style>


  <level-builder></level-builder>
  <theme-grid></theme-grid>
  <gradient-builder></gradient-builder>

`;

export class ThemeCustomizer extends HTMLElement {
  #disposables;
  constructor() {
    super();
    this.#disposables = new Set();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

  }

  fromInput(el, ev){
    const signal = fromInput(el, ev);
    this.#disposables.add(()=>signal.terminate())
    return signal;
  }

  connectedCallback() {

  }

  disconnectedCallback() {
    this.#disposables.forEach(bye=>bye())
  }



}

function html(a,...b) { return (Array.from({ length: Math.max(a.length, b.length) }, (_, index) => [a[index], b[index]])).flat().join('') }  // For Code Highlighters (zed editor treats html`` as html and highlights the syntax)
