import { EditorState, Compartment } from "@codemirror/state";
import { keymap, drawSelection } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { markdownLanguage } from "@codemirror/lang-markdown";
import { vim } from "@replit/codemirror-vim";

import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";

import { defaultKeymap } from "@codemirror/commands";
import { useEffect, useRef } from "react";

import { materialDark } from "cm6-theme-material-dark";

import testDoc from "./testDoc.js";
import testJavascriptDoc from "./js.code.example";
const themeConfig = new Compartment();

export default function () {
  const ref = useRef();
  useEffect(() => {
    let updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const code = update.state.doc.toString();
        console.log(code);
        // Handle the event here
      }
    });

    // const theme = EditorView.theme({
    //   spe,
    // });

    let startState = EditorState.create({
      doc: testJavascriptDoc,
      // doc: testJavascriptDoc,
      extensions: [
        vim(),
        basicSetup,
        javascript(),
        // markdown({
        //   base: markdownLanguage,
        //   codeLanguages: languages,
        //   addKeymap: true,
        //   extensions: [],
        // }),
        updateListenerExtension,
        // themeConfig.of(materialDark),
        syntaxHighlighting(defaultHighlightStyle),
      ],
    });

    let view = new EditorView({
      state: startState,
      parent: document.querySelector("#code-mirror"),

      // parent: document.body,
    });

    console.log(ref);
  }, [ref]);
  console.log("ref", ref);
  return <div id="code-mirror" ref={ref}></div>;
}
