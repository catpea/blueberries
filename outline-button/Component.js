// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement('template');
// we use html`` as it enables syntax higlighiting in zed editor
template.innerHTML = html`
  <style>
  :host {
    padding: var(--padding);


    }

    button {

      color: var(--link);
      background: var(--l3-bg);

      border-radius: 4px;
      font-size: 1.3rem;
      line-height: 1.3rem;
      padding: 5px 6px;

      cursor: pointer;
      box-shadow: 2px 2px 5px 2px rgba(0,0,0,0.5);
      outline: none;
      border: none;

      display: flex-inline;
      flex-direction: column;
      justify-content: space-between;

    }

    ::slotted(*:not([slot])) {
    }




  </style>
	<button data-offcanvas-toggle data-offcanvas-target="#sidebar"><slot>&otimes;</slot></button>

`;

export class OutlineButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("outline-button", OutlineButton);
function html(a,...b) { return (Array.from({ length: Math.max(a.length, b.length) }, (_, index) => [a[index], b[index]])).flat().join('') }  // For Code Highlighters (zed editor treats html`` as html and highlights the syntax)
