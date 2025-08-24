// we must use the template element as it only requires: shadow.appendChild(template.content.cloneNode(true));
const template = document.createElement('template');
template.innerHTML = `

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

  <table class="table">
    <thead>
      <tr id="tableHeader">
        <th scope="col">#</th>
      </tr>
    </thead>
    <tbody id="tableBody">

    </tbody>
  </table>
`;

export class ThemeGrid extends HTMLElement {

  #rows = [
    {id: 'level5'},
    {id: 'level4'},
    {id: 'level3'},
    {id: 'level2'},
    {id: 'level1'},
  ];

  // level5,  level4,  level3,  level2,  level1
 // caption,  backdrop,  background,  raised,  foreground,  text,  link,  info,  success,  warning,  danger,  muted,
  #columns = [
    {id: 'caption'},
    {id: 'backdrop'},
    {id: 'background'},
    {id: 'raised'},
    {id: 'foreground'},
    {id: 'text'},
    {id: 'link'},
    // {id: 'info'},
    // {id: 'success'},
    // {id: 'warning'},
    // {id: 'danger'},
    // {id: 'muted'},
  ];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.tableHeader = shadow.querySelector('#tableHeader');
    this.tableBody = shadow.querySelector('#tableBody');

    this.initializeTable();

  }

  initializeTable() {

    this.renderTableHeaders();
    this.renderVarianceSteppers();
    this.renderTableRows();

  }


  renderTableHeaders(){
    for (const { id } of this.#columns) {
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = id;
      this.tableHeader.appendChild(th)
    }
  }

  renderVarianceSteppers(){
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.textContent = 'variance';
    tr.appendChild(th);

    for (const { id } of this.#columns) {
      const td = document.createElement('td');

      const variance = document.createElement('input')
      variance.setAttribute('type', 'number')
      variance.setAttribute('min', '0')
      variance.setAttribute('max', '1')
      variance.setAttribute('step', '0.01')
      variance.setAttribute('value', '0.01')
      td.appendChild(variance);

      tr.appendChild(td)
    }

      this.tableBody.appendChild(tr)

  }

  renderTableRows(){
    for (const { id: rowId } of this.#rows) {



      const tr = document.createElement('tr');

      const th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.textContent = rowId;
      tr.appendChild(th);

    for (const { id:colId } of this.#columns) {
      const td = document.createElement('td');
      td.classList.add(`${rowId}-${colId}`)
      const inkWell = document.createElement('input')
      inkWell.setAttribute('type', 'color')
      // td.appendChild(inkWell);

      tr.appendChild(td);
    }

      this.tableBody.appendChild(tr)
    }
  }




  connectedCallback() {
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // if (name === ...) { this.#...
  }

  #internal(){
    this.dispatchEvent(new CustomEvent("something", { bubbles: true }));
  }
}
