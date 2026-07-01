import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/keymap/vim';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/javascript-lint';

const examples = {
  javascript: `// JavaScript Example\nfunction greet(name) {\n  return 'Hello, ' + name + '!';\n}\n\nconsole.log(greet('World')); // Output: Hello, World!\n`,
  python: `# Python Example\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet('World'))  # Output: Hello, World!\n`,
  htmlmixed: `<!-- HTML Example -->\n<!DOCTYPE html>\n<html>\n  <head><title>Hello</title></head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>\n`,
  css: `/* CSS Example */\nbody {\n  background: #282c34;\n  color: #abb2bf;\n}`
};

const themes = ['dracula', 'monokai', 'material', 'default'];
const modes = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'htmlmixed', label: 'HTML' },
  { value: 'css', label: 'CSS' }
];
const keymaps = ['default', 'vim', 'emacs', 'sublime'];

const CollaborativeEditor = () => {
  const [mode, setMode] = useState('javascript');
  const [theme, setTheme] = useState('dracula');
  const [keymap, setKeymap] = useState('default');
  const [value, setValue] = useState(examples.javascript);

  return (
    <div>
      <h2>Collaborative Code Editor (CodeMirror 5)</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Language: </label>
        <select value={mode} onChange={e => { setMode(e.target.value); setValue(examples[e.target.value]); }}>
          {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <label style={{ marginLeft: 16 }}>Theme: </label>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          {themes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <label style={{ marginLeft: 16 }}>Keymap: </label>
        <select value={keymap} onChange={e => setKeymap(e.target.value)}>
          {keymaps.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <CodeMirror
        value={value}
        options={{
          mode,
          theme,
          keyMap: keymap,
          lineNumbers: true,
          autoCloseBrackets: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          extraKeys: { 'Ctrl-Space': 'autocomplete' },
        }}
        onBeforeChange={(editor, data, value) => setValue(value)}
      />
    </div>
  );
};

export default CollaborativeEditor;
