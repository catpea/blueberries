import {fromInput, derived, effect} from '#ladybits';

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

  <div><small>level 1</small></div>
  <input type="range" class="form-range" id="level1HueRange" min="0" max="360" value="199">
  <input type="range" class="form-range" id="level1SaturationRange" min="0" max="100" value="81">
  <input type="range" class="form-range" id="level1LuminosityRange" min="0" max="100" value="2">

  <div><small>level 2</small></div>
  <input type="range" class="form-range" id="level2HueRange" min="0" max="360" value="199">
  <input type="range" class="form-range" id="level2SaturationRange" min="0" max="100" value="80">
  <input type="range" class="form-range" id="level2LuminosityRange" min="0" max="100" value="15">

  <div><small>level 3</small></div>
  <input type="range" class="form-range" id="level3HueRange" min="0" max="360" value="204">
  <input type="range" class="form-range" id="level3SaturationRange" min="0" max="100" value="63">
  <input type="range" class="form-range" id="level3LuminosityRange" min="0" max="100" value="15">

  <div><small>level 4</small></div>
  <input type="range" class="form-range" id="level4HueRange" min="0" max="360" value="200">
  <input type="range" class="form-range" id="level4SaturationRange" min="0" max="100" value="75">
  <input type="range" class="form-range" id="level4LuminosityRange" min="0" max="100" value="10">

  <div><small>level 5</small></div>
  <input type="range" class="form-range" id="level5HueRange" min="0" max="360" value="200">
  <input type="range" class="form-range" id="level5SaturationRange" min="0" max="100" value="75">
  <input type="range" class="form-range" id="level5LuminosityRange" min="0" max="100" value="9">

  <hr>

  <div><small>distinction</small></div>
  <input type="range" class="form-range" id="distinctionRange" min="0" max="1" step="0.1">

`;

export class ThemeCustomizer extends HTMLElement {
  #disposables;
  constructor() {
    super();
    this.#disposables = new Set();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    const hue1 = this.fromInput(shadow.querySelector('#level1HueRange') , 'input');
    const saturation1 = this.fromInput(shadow.querySelector('#level1SaturationRange') , 'input');
    const luminosity1 = this.fromInput(shadow.querySelector('#level1LuminosityRange') , 'input');

    const hue2 = this.fromInput(shadow.querySelector('#level2HueRange') , 'input');
    const saturation2 = this.fromInput(shadow.querySelector('#level2SaturationRange') , 'input');
    const luminosity2 = this.fromInput(shadow.querySelector('#level2LuminosityRange') , 'input');

    const hue3 = this.fromInput(shadow.querySelector('#level3HueRange') , 'input');
    const saturation3 = this.fromInput(shadow.querySelector('#level3SaturationRange') , 'input');
    const luminosity3 = this.fromInput(shadow.querySelector('#level3LuminosityRange') , 'input');

    const hue4 = this.fromInput(shadow.querySelector('#level4HueRange') , 'input');
    const saturation4 = this.fromInput(shadow.querySelector('#level4SaturationRange') , 'input');
    const luminosity4 = this.fromInput(shadow.querySelector('#level4LuminosityRange') , 'input');

    const hue5 = this.fromInput(shadow.querySelector('#level5HueRange') , 'input');
    const saturation5 = this.fromInput(shadow.querySelector('#level5SaturationRange') , 'input');
    const luminosity5 = this.fromInput(shadow.querySelector('#level5LuminosityRange') , 'input');


    const distinction = this.fromInput(shadow.querySelector('#distinctionRange') , 'input');


    // hue1.subscribe(v=>{ console.info('hue1 change detection = ', v); })
    // saturation.subscribe(v=>{ console.info('saturation change detection = ', v); })
    // luminosity.subscribe(v=>{ console.info('luminosity change detection = ', v); })
    // const derivedTest = derived(()=>{
    //   const response = `${hue1}, ${saturation} + ${luminosity}`;
    //   // console.log('derived', response)
    //   return response;
    // });
    // console.log(derivedTest)
    // derivedTest.subscribe(v=>  console.info(` derivedTest.subscribe = ${v} (typeof v)`))



    const effectDebug = effect(()=>{

      const value1bg = `hsl(${hue1.value}deg ${saturation1.value}% ${luminosity1.value}%)`
      const value2bg = `hsl(${hue2.value}deg ${saturation2.value}% ${luminosity2.value}%)`
      const value3bg = `hsl(${hue3.value}deg ${saturation3.value}% ${luminosity3.value}%)`
      const value4bg = `hsl(${hue4.value}deg ${saturation4.value}% ${luminosity4.value}%)`
      const value5bg = `hsl(${hue5.value}deg ${saturation5.value}% ${luminosity5.value}%)`

      const value1br = `hsl(${hue1.value}deg ${saturation1.value}% ${luminosity1.value*distinction.value}%)`;
      const value2br = `hsl(${hue2.value}deg ${saturation2.value}% ${luminosity2.value*distinction.value}%)`;
      const value3br = `hsl(${hue3.value}deg ${saturation3.value}% ${luminosity3.value*distinction.value}%)`;
      const value4br = `hsl(${hue4.value}deg ${saturation4.value}% ${luminosity4.value*distinction.value}%)`;
      const value5br = `hsl(${hue5.value}deg ${saturation5.value}% ${luminosity5.value*distinction.value}%)`;

      const value1fg = `hsl(${hue1.value}deg ${saturation1.value}% ${luminosity1.value*distinction.value}%)`;
      const value2fg = `hsl(${hue2.value}deg ${saturation2.value}% ${luminosity2.value*distinction.value}%)`;
      const value3fg = `hsl(${hue3.value}deg ${saturation3.value}% ${luminosity3.value*distinction.value}%)`;
      const value4fg = `hsl(${hue4.value}deg ${saturation4.value}% ${luminosity4.value*distinction.value}%)`;
      const value5fg = `hsl(${hue5.value}deg ${saturation5.value}% ${luminosity5.value*distinction.value}%)`;

      document.documentElement.style.setProperty('--l1-bg', value1bg);
      document.documentElement.style.setProperty('--l2-bg', value2bg);
      document.documentElement.style.setProperty('--l3-bg', value3bg);
      document.documentElement.style.setProperty('--l4-bg', value4bg);
      document.documentElement.style.setProperty('--l5-bg', value5bg);

      document.documentElement.style.setProperty('--l1-br', value1br);
      document.documentElement.style.setProperty('--l2-br', value2br);
      document.documentElement.style.setProperty('--l3-br', value3br);
      document.documentElement.style.setProperty('--l4-br', value4br);
      document.documentElement.style.setProperty('--l5-br', value5br);

      document.documentElement.style.setProperty('--l1-fg', value1fg);
      document.documentElement.style.setProperty('--l2-fg', value2fg);
      document.documentElement.style.setProperty('--l3-fg', value3fg);
      document.documentElement.style.setProperty('--l4-fg', value4fg);
      document.documentElement.style.setProperty('--l5-fg', value5fg);


    })
    // console.log(effectDebug)

  }



  fromInput(el, ev){
    const signal = fromInput(el, ev);
    this.#disposables.add(()=>signal.terminate())
    return signal;
  }

  connectedCallback() {




    // const hue2 = this.fromInput(level2HueRange, 'change');
    // const hue3 = this.fromInput(level3HueRange, 'change');
    // const hue4 = this.fromInput(level4HueRange, 'change');
    // const hue5 = this.fromInput(level5HueRange, 'change');

    // const saturation = this.fromInput(saturationRange, 'change');
    // const luminosity = this.fromInput(luminosityRange, 'change');

    // const foo = derived(()=>{
    //   return `${hue1}, ${saturation} + ${luminosity}`;
    // })

    // this.#disposables.add()
  }

  disconnectedCallback() {
    this.#disposables.forEach(bye=>bye())
  }

  foo(){

    const hue1 = fromInput(level1HueRange, 'change');
    const hue2 = fromInput(level2HueRange, 'change');
    const hue3 = fromInput(level3HueRange, 'change');
    const hue4 = fromInput(level4HueRange, 'change');
    const hue5 = fromInput(level5HueRange, 'change');

    const saturation = fromInput(saturationRange, 'change');
    const luminosity = fromInput(luminosityRange, 'change');

    const foo = derived(()=>{
      return `${hue1}, ${saturation} + ${luminosity}`;
    })

    effect(()=>{

      document.documentElement.style.setProperty('--l1-bg', `hsl(${hue1}), (${saturation}, ${luminosity}`)
      document.documentElement.style.setProperty('--l2-bg', `hsl(${hue2}), (${saturation}, ${luminosity}`)
      document.documentElement.style.setProperty('--l3-bg', `hsl(${hue3}), (${saturation}, ${luminosity}`)
      document.documentElement.style.setProperty('--l4-bg', `hsl(${hue4}), (${saturation}, ${luminosity}`)
      document.documentElement.style.setProperty('--l5-bg', `hsl(${hue5}), (${saturation}, ${luminosity}`)

    })






    // const l1bg = hue1.map(v=>v*.4).map(v=>`hsl(${hue1}), (${saturation}, ${luminosity}`);
    // const l2bg = hue2.map(v=>v*.4).map(v=>`hsl(${hue2}), (${saturation}, ${luminosity}`);
    // const l3bg = hue3.map(v=>v*.4).map(v=>`hsl(${hue3}), (${saturation}, ${luminosity}`);
    // const l4bg = hue4.map(v=>v*.4).map(v=>`hsl(${hue4}), (${saturation}, ${luminosity}`);
    // const l5bg = hue5.map(v=>v*.4).map(v=>`hsl(${hue5}), (${saturation}, ${luminosity}`);

    //  use(level1HueRange)
    // .map(hueValue=>`hsl(${hueValue}), var(--primary-s), var(--primary-l))`)
    // .sub(hslValue=>document.documentElement.style.setProperty('--l1-bg', '2rem'))
    // .put(this.trash)

  }

}

customElements.define("theme-customizer", ThemeCustomizer);
function html(a,...b) { return (Array.from({ length: Math.max(a.length, b.length) }, (_, index) => [a[index], b[index]])).flat().join('') }  // For Code Highlighters (zed editor treats html`` as html and highlights the syntax)
