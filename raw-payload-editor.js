/**
@license
Copyright 2019 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import { ArcResizableMixin } from '@advanced-rest-client/arc-resizable-mixin/arc-resizable-mixin.js';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import { PayloadParserMixin } from '@advanced-rest-client/payload-parser-mixin/payload-parser-mixin.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-button/paper-button.js';
import '@advanced-rest-client/code-mirror/code-mirror.js';
import '@advanced-rest-client/code-mirror-linter/code-mirror-linter.js';
import linterStyles from '@advanced-rest-client/code-mirror-linter/lint-style.js';
/**
 * A raw payload input editor based on CodeMirror.
 *
 * The element additionally shows Encode / Decode buttons if current content type value contains
 * "x-www-form-urlencoded".
 *
 * The element listens for `content-type-changed` custom event and updates the `contentType` property
 * automatically. This event is commonly used in ARC elements.
 *
 * ### Example
 * ```
 * <raw-payload-editor content-type="application/json"></raw-payload-editor>
 * ```
 *
 * ### Styling
 * `<raw-payload-editor>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--raw-payload-editor` | Mixin applied to the element | `{}`
 * `--raw-payload-editor-encode-buttons` | Mixin applied to encode / decode buttons container | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @polymerBehavior Polymer.IronResizableBehavior
 * @appliesMixin EventsTargetMixin
 * @appliesMixin PayloadParserMixin
 */
class RawPayloadEditor extends ArcResizableMixin(PayloadParserMixin(EventsTargetMixin(LitElement))) {
  static get styles() {
    return [
      linterStyles,
      css`:host {
        display: block;
      }

      .action-buttons {
        margin: 8px 0;
      }

      *[hidden] {
        display: none !important;
      }`
    ];
  }

  render() {
    const { _encodeEnabled, _isJson } = this;
    return html`
    ${_encodeEnabled ? html`<div class="action-buttons" data-type="form">
      <paper-button @click="${this.encodeValue}"
        title="Encodes payload to x-www-form-urlencoded data">Encode payload</paper-button>
      <paper-button @click="${this.decodeValue}"
        title="Decodes payload to human readable form">Decode payload</paper-button>
    </div>` : undefined}
    ${_isJson ? html`<div class="action-buttons" data-type="json">
      <paper-button @click="${this.formatValue}" data-action="format-json"
        title="Formats JSON input.">Format JSON</paper-button>
      <paper-button @click="${this.minifyValue}" data-action="minify-json"
        title="Removed whitespaces from the input">Minify JSON</paper-button>
    </div>` : undefined}
    <code-mirror
      mode="application/json"
      @value-changed="${this._editorValueChanged}"
      gutters='["CodeMirror-lint-markers"]'></code-mirror>
    <paper-toast id="invalidJsonToast">JSON value is invalid. Cannot parse value.</paper-toast>`;
  }

  static get properties() {
    return {
      /**
       * Raw payload value
       */
      value: { type: String },
      /**
       * Content-Type header value. Determines current code mirror mode.
       */
      contentType: { type: String },
      // Computed value, true if `contentType` contains `x-www-form-urlencoded`
      _encodeEnabled: { type: Boolean },
      // Computed value, true if `contentType` contains `/json`
      _isJson: { type: Boolean }
    };
  }

  get _editor() {
    return this.shadowRoot.querySelector('code-mirror');
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const old = this._value;
    if (old === value) {
      return;
    }
    this._value = value;
    this._valueChanged(value);
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value
      }
    }));
  }

  get contentType() {
    return this._contentType;
  }

  set contentType(value) {
    const old = this._contentType;
    if (old === value) {
      return;
    }
    this._contentType = value;
    this._onContentTypeChanged(value);
    this._encodeEnabled = this.__computeIs(value, 'x-www-form-urlencoded');
    this._isJson = this._computeIsJson(value);
  }

  get onvalue() {
    return this._onValue;
  }

  set onvalue(value) {
    if (this._onValue) {
      this.removeEventListener('value-changed', this._onValue);
    }
    if (typeof value !== 'function') {
      this._onValue = null;
      return;
    }
    this._onValue = value;
    this.addEventListener('value-changed', this._onValue);
  }

  constructor() {
    super();
    this._contentTypeHandler = this._contentTypeHandler.bind(this);
    this._resizeHandler = this._resizeHandler.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('content-type-changed', this._contentTypeHandler);
    this.addEventListener('iron-resize', this._resizeHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('content-type-changed', this._contentTypeHandler);
    this.removeEventListener('iron-resize', this._resizeHandler);
  }

  firstUpdated() {
    this.refresh();
    if (this.contentType) {
      this._onContentTypeChanged(this.contentType);
    }
  }

  /**
   * Forces render code-mirror content.
   * Should be used to when the element becomes visible after being hidden.
   */
  refresh() {
    this._editor.refresh();
  }

  /**
   * Changes CodeMirror mode when the content type value is updated.
   *
   * @param {String} ct
   */
  _onContentTypeChanged(ct) {
    const editor = this._editor;
    if (!editor) {
      return;
    }
    this._setupLinter(ct);
    if (!ct) {
      return;
    }
    if (ct.indexOf && ct.indexOf(';') !== -1) {
      ct = ct.substr(0, ct.indexOf(';'));
    }
    this._editor.mode = ct;
  }

  _computeIsJson(ct) {
    return this.__computeIs(ct, '/json');
  }

  __computeIs(ct, needle) {
    if (!ct) {
      return false;
    }
    if (ct.indexOf && ct.indexOf(needle) !== -1) {
      return true;
    }
    return false;
  }

  /**
   * Handler for the `content-type-changed` event. Sets the `contentType` property.
   *
   * @param {CustomEvent} e
   */
  _contentTypeHandler(e) {
    this.contentType = e.detail.value;
  }
  /**
   * Handler for value change.
   * If the element is opened then it will fire change event.
   *
   * @param {String} value
   */
  _valueChanged(value) {
    if (this.__editorValueChange || !this.shadowRoot) {
      return;
    }
    this._editor.value = value;
  }
  /**
   * Called when the editor fires change event
   *
   * @param {CustomEvent} e
   */
  _editorValueChanged(e) {
    e.stopPropagation();
    this.__editorValueChange = true;
    this.value = e.detail.value;
    this.__editorValueChange = false;
  }

  _setupLinter(ct) {
    /* global CodeMirror */
    const editor = this._editor;
    if (this._computeIsJson(ct)) {
      editor.lint = CodeMirror.lint.json;
      editor.gutters = ['code-mirror-lint', 'CodeMirror-lint-markers'];
    } else {
      editor.lint = false;
      editor.gutters = ['CodeMirror-lint-markers'];
    }
    editor.refresh();
  }
  /**
   * Formats current value as it is a JSON object.
   */
  formatValue() {
    try {
      let value = this.value;
      value = JSON.parse(value);
      value = JSON.stringify(value, null, 2);
      this.value = value;
      this.refresh();
    } catch (e) {
      this.shadowRoot.querySelector('#invalidJsonToast').opened = true;
    }
  }
  /**
   * Minifies JSON value by removing whitespaces.
   */
  minifyValue() {
    try {
      let value = this.value;
      value = JSON.parse(value);
      value = JSON.stringify(value);
      this.value = value;
      this.refresh();
    } catch (e) {
      this.shadowRoot.querySelector('#invalidJsonToast').opened = true;
    }
  }

  _resizeHandler() {
    this.refresh();
  }

  /**
   * URL encodes payload value and resets the same value property.
   * This should be used only for payloads with x-www-form-urlencoded content-type.
   */
  encodeValue() {
    const value = this.encodeUrlEncoded(this.value);
    this.__internalChange = true;
    this.value = value;
    this.__internalChange = false;
  }
  /**
   * URL decodes payload value and resets the same value property.
   * This should be used only for payloads with x-www-form-urlencoded content-type.
   */
  decodeValue() {
    const value = this.decodeUrlEncoded(this.value);
    this.__internalChange = true;
    this.value = value;
    this.__internalChange = false;
  }
}
window.customElements.define('raw-payload-editor', RawPayloadEditor);
