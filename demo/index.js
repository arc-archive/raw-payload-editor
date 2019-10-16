import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '../raw-payload-editor.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'contentType',
      'payload',
      'withActions'
    ]);
    this.demoStates = ['Material design', 'Anypoint'];
    this._componentName = 'raw-payload-editor';
    this._ctHandler = this._ctHandler.bind(this);
    this._valueHandler = this._valueHandler.bind(this);
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
  }

  _ctHandler(e) {
    this.contentType = e.detail.value;
  }

  _valueHandler(e) {
    this.payload = e.detail.value;
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.compatibility = state === 1;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      contentType,
      payload,
      withActions
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the certificates panel element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <div class="demo-content" slot="content">
            <content-type-selector
              @contenttype-changed="${this._ctHandler}"
              ?compatibility="${compatibility}"
            ></content-type-selector>
            <raw-payload-editor
              ?compatibility="${compatibility}"
              .contenttype="${contentType}"
              @value-changed="${this._valueHandler}"
              lineNumbers
            >
            ${withActions ? html`
              <anypoint-button
                slot="content-action"
                ?compatibility="${compatibility}"
              >Add parameter<anypoint-button>
              <anypoint-button
                slot="content-action"
                ?compatibility="${compatibility}"
              >Copy<anypoint-button>
            ` : ''}
            </raw-payload-editor>
          </div>

        <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="withActions"
            @change="${this._toggleMainOption}"
            >Content actions</anypoint-checkbox
          >
        </arc-interactive-demo>

        <output>${payload}</output>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Raw payload editor</h2>
      ${this._demoTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;

setTimeout(() => {
  document.body.dispatchEvent(new CustomEvent('content-type-changed', {
    bubbles: true,
    cancelable: true,
    detail: {
      value: 'application/json'
    }
  }));
}, 100);
