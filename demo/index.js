import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '../raw-payload-editor.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this._componentName = 'raw-payload-editor';
    this._ctHandler = this._ctHandler.bind(this);
    this._valueHandler = this._valueHandler.bind(this);
  }

  get contentType() {
    return this._contentType;
  }

  set contentType(value) {
    this._setObservableProperty('contentType', value);
  }

  get payload() {
    return this._payload;
  }

  set payload(value) {
    this._setObservableProperty('payload', value);
  }

  _ctHandler(e) {
    this.contentType = e.detail.value;
  }

  _valueHandler(e) {
    this.payload = e.detail.value;
  }

  contentTemplate() {
    const { contentType, payload } = this;
    return html`
    <content-type-selector @contenttype-changed="${this._ctHandler}"></content-type-selector>
    <raw-payload-editor .contenttype="${contentType}" @value-changed="${this._valueHandler}"></raw-payload-editor>
    <output>${payload}</output>`;
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
