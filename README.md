[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/raw-payload-editor.svg)](https://www.npmjs.com/package/@advanced-rest-client/raw-payload-editor)

[![Build Status](https://travis-ci.org/advanced-rest-client/raw-payload-editor.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/raw-payload-editor)  

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/raw-payload-editor)

## &lt;raw-payload-editor&gt;

An element with CodeMirror editor to allow the user to enter HTTP message body.

**See breaking changes and list of required dependencies at the bottom of this document**

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/raw-payload-editor
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/raw-payload-editor/raw-payload-editor.js';
    </script>
  </head>
  <body>
    <raw-payload-editor content-type="application/json"></raw-payload-editor>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/raw-payload-editor/raw-payload-editor.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <raw-payload-editor content-type="application/json"></raw-payload-editor>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/raw-payload-editor
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```

## Breaking Changes in v3

Due to completely different dependencies import algorithm the CodeMirror and it's dependencies has to
be included to the web application manually, outside the component.

Web Components are ES6 modules and libraries like CodeMirror are not adjusted to
new spec. Therefore importing the library inside the component won't make it work
(no reference is created).

```html
<!-- CodeMirror + modes loader -->
<script src="node_modules/codemirror/lib/codemirror.js"></script>
<script src="node_modules/codemirror/addon/mode/loadmode.js"></script>
<script src="node_modules/codemirror/mode/meta.js"></script>
<!--Default set of parsers, add as many as you need -->
<script src="node_modules/codemirror/mode/javascript/javascript.js"></script>
<script src="node_modules/codemirror/mode/xml/xml.js"></script>
<script src="node_modules/codemirror/mode/htmlmixed/htmlmixed.js"></script>
<!-- JSON linter -->
<script src="node_modules/jsonlint/lib/jsonlint.js"></script>
<script src="node_modules/codemirror/addon/lint/lint.js"></script>
<script src="node_modules/codemirror/addon/lint/json-lint.js"></script>
```
Finally, you should set the path to CodeMirror modes. When content type change
this path is used to load syntax highlighter. If you list all modes in the scripts
above then this is not required.
```html
<script>
CodeMirror.modeURL = 'node_modules/codemirror/mode/%N/%N.js';
</script>
```

The `jsonlint` library is a dependency of `@advanced-rest-client/code-mirror-linter`
already included in the dependency graph of this element.
