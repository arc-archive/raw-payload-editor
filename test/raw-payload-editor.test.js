import { fixture, assert, nextFrame } from '@open-wc/testing';
import '../raw-payload-editor.js';

describe('<raw-payload-editor>', function() {
  async function basicFixture() {
    return (await fixture(`<raw-payload-editor></raw-payload-editor>`));
  }

  async function encodeFixture() {
    return (await fixture(`
      <raw-payload-editor contenttype="application/x-www-form-urlencoded"></raw-payload-editor>
    `));
  }

  async function jsonFixture() {
    return (await fixture(`
      <raw-payload-editor contenttype="application/json"></raw-payload-editor>
    `));
  }

  function fire(name, detail, node) {
    const event = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail: detail
    });
    (node || document).dispatchEvent(event);
    return event;
  }

  describe('basic', function() {
    let element;

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('contentType is undefined', function() {
      assert.isUndefined(element.contentType);
    });

    it('_encodeEnabled is undefined', function() {
      assert.isUndefined(element._encodeEnabled);
    });

    it('Handling content-type-changed', function() {
      fire('content-type-changed', {
        value: 'text/plain'
      });
      assert.equal(element.contentType, 'text/plain');
    });

    it('Content type changes editor mode', function() {
      element.contentType = 'application/xml';
      assert.equal(element._editor.mode, element.contentType);
    });

    it('Content type with charset changes editor mode', function() {
      element.contentType = 'application/xml; charset="utf-8"';
      assert.equal(element._editor.mode, 'application/xml');
    });

    it('The _encodeEnabled is true for application/x-www-form-urlencoded', function() {
      element.contentType = 'application/x-www-form-urlencoded';
      assert.isTrue(element._encodeEnabled);
    });

    it('Code Mirror value changes after value change', function() {
      element.value = 'test';
      assert.equal(element._editor.value, element.value);
    });
  });

  describe('encoder-decoder', function() {
    let element;
    const decodedValue = 'x test=x value';
    const encodedValue = 'x+test=x+value';

    beforeEach(async () => {
      element = await encodeFixture();
      element.contentType = 'application/x-www-form-urlencoded';
      await nextFrame();
    });

    it('Action controls are rendered', function() {
      const container = element.shadowRoot.querySelector('.action-buttons[data-type="form"]');
      assert.ok(container);
    });

    it('Encodes parameters', function() {
      element.value = decodedValue;
      element.encodeValue();
      assert.equal(element.value, encodedValue);
    });

    it('Decodes parameters', function() {
      element.value = encodedValue;
      element.decodeValue();
      assert.equal(element.value, decodedValue);
    });
  });

  describe('JSON tranformer', function() {
    let element;
    beforeEach(async () => {
      element = await encodeFixture();
      element.contentType = 'application/json';
      await nextFrame();
    });

    it('Formatting controls are rendered', function() {
      const container = element.shadowRoot.querySelector('.action-buttons[data-type="json"]');
      assert.ok(container);
    });

    it('Formats JSON', async () => {
      const initialValue = '{"a":"b"}';
      element.value = initialValue;
      await nextFrame();
      const button = element.shadowRoot.querySelector('[data-action="format-json"]');
      button.click();
      assert.typeOf(element.value, 'string');
      assert.isAbove(element.value.length, 9);
    });

    it('Minifies JSON', async () => {
      const initialValue = '{\t"a":\n"b"\n\t}';
      const finalValue = '{"a":"b"}';
      element.value = initialValue;
      await nextFrame();
      const button = element.shadowRoot.querySelector('[data-action="minify-json"]');
      button.click();
      assert.equal(element.value, finalValue);
    });
  });

  describe('Linter', function() {
    let element;

    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('Setting JSON content type sets lint on the editor', function() {
      element.contentType = 'application/json';
      assert.typeOf(element._editor.lint, 'function');
    });

    it('Setting JSON content type sets gutters on the editor', function() {
      element.contentType = 'application/json';
      assert.deepEqual(element._editor.gutters, ['code-mirror-lint', 'CodeMirror-lint-markers']);
    });

    it('Clearing content type removes lint function', function(done) {
      element.contentType = 'application/json';
      setTimeout(() => {
        element.contentType = undefined;
        assert.isFalse(element._editor.lint);
        done();
      });
    });

    it('Clearing content type removes updates gutters', function(done) {
      element.contentType = 'application/json';
      setTimeout(() => {
        element.contentType = undefined;
        assert.deepEqual(element._editor.gutters, ['CodeMirror-lint-markers']);
        done();
      });
    });
  });

  describe('onvalue', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onvalue);
      const f = () => {};
      element.onvalue = f;
      assert.isTrue(element.onvalue === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onvalue = f;
      element.value = 'test';
      element.onvalue = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onvalue = f1;
      element.onvalue = f2;
      element.value = 'test';
      element.onvalue = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('is accessible in normal state', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible for application/x-www-form-urlencoded', async () => {
      const element = await encodeFixture();
      await assert.isAccessible(element);
    });

    it('is accessible for application/json', async () => {
      const element = await jsonFixture();
      await assert.isAccessible(element);
    });
  });
});
