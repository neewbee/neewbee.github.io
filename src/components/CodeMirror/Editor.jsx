import { EditorState, Compartment } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";

import { vim } from "@replit/codemirror-vim";

import { javascript } from "@codemirror/lang-javascript";

import { useEffect, useRef } from "react";

import { materialDark } from "./cm6-theme-material-dark.js";

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
      // doc: testDoc,
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
        // materialDark,
        // updateListenerExtension,
        themeConfig.of(materialDark),
        // syntaxHighlighting(defaultHighlightStyle),
      ],
    });

    let view = new EditorView({
      state: startState,
      parent: document.querySelector("#code-mirror"),

      // parent: document.body,
    });
  }, [ref]);

  return <div id="code-mirror" ref={ref}></div>;
}
