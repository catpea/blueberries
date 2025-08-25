import {fromInput, derived, effect} from '#ladybits';

// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement('template');
// we use html`` as it enables syntax higlighiting in zed editor
template.innerHTML = html`
  <style>
  :host {
      display: grid;
      grid-template-areas:
        "head head"
        "nav  main"
        "foot foot";
      grid-template-rows: 50px 1fr;
      grid-template-columns: 150px 1fr;
  }


     header {
      grid-area: head;
    }
     nav {
      grid-area: nav;
    }
     main {
      grid-area: main;
    }
     footer {
      grid-area: foot;
    }

  </style>


  <nav>
  <level-builder id="levelBuilder"></level-builder>
  </nav>

  <main>
  <theme-grid id="themeGrid"></theme-grid>
  </main>


  <footer>
  <!--
  for when a cell is selected in the theme grid
  <gradient-builder id="gradientBuilder"></gradient-builder>
  -->
  </footer>

`;

export class ThemeCustomizer extends HTMLElement {
  #colorStops;

  #disposables;
  constructor() {
    super();
    this.#disposables = new Set();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    // Initialize with default gradient
    this.#colorStops = [
      { percentage: 0, color: '#03141C' },
      { percentage: 55, color: '#3B9C93' },
      { percentage: 100, color: '#083145' },
    ];


    const stopsJson = JSON.stringify(this.#colorStops);
    this.levelBuilder = shadow.querySelector('#levelBuilder');
    this.levelBuilder.setAttribute('gradient-stops', stopsJson);

    this.themeGrid = shadow.querySelector('#themeGrid');
    this.themeGrid.setAttribute('gradient-stops', stopsJson);

    // UNUSED AT THE MOMENT
    this.gradientBuilder = shadow.querySelector('#gradientBuilder');

    // NOTE level-builder's gradient-changed event must send data to theme-grid, because theme grid must update level colors based on level builder's gradient
    this.levelBuilder.addEventListener('gradient-changed', (e) => {
    //   console.log('levelBuilder\'s gradient changed:', e.detail.css);
    //   // Use e.detail.css to apply the gradient elsewhere
    //   // document.body.style.background = e.detail.css;
    this.#colorStops = e.detail.stops;
    //   this.themeGrid.setAttribute('gradient-stops',  JSON.stringify(e.detail.stops));
    const stopsJson = JSON.stringify(this.#colorStops);

    this.themeGrid.setAttribute('gradient-stops', stopsJson);

    });

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
