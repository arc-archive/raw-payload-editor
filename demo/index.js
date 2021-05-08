import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '../raw-payload-editor.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'contentType',
      'payload',
      'withActions'
    ]);
    this.demoStates = ['Material design', 'Anypoint'];
    this.componentName = 'raw-payload-editor';
    this._ctHandler = this._ctHandler.bind(this);
    this._valueHandler = this._valueHandler.bind(this);
  }

  _ctHandler(e) {
    this.contentType = e.detail.value;
  }

  _valueHandler(e) {
    this.payload = e.detail.value;
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
          @state-changed="${this._demoStateHandler}"
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
              >Add parameter</anypoint-button>
              <anypoint-button
                slot="content-action"
                ?compatibility="${compatibility}"
              >Copy</anypoint-button>
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
