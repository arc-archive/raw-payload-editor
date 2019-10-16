import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '../raw-payload-editor.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'contentType',
      'payload'
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
      payload
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
            ></raw-payload-editor>
          </div>
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
