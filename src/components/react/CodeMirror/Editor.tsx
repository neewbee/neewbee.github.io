import * as React from "react";
import { useEffect, useRef } from "react";

import { EditorState, Compartment, type Extension } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";

import { vim } from "@replit/codemirror-vim";

import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";

import { materialDark } from "./themes/cm6-theme-material-dark.ts";
import { basicLight } from "./themes/cm6-theme-basic-light.ts";

import testJavascriptDoc from "./js.code.example.js";
import glsl from "../GLSLPart1/shader.glsl.ts";
import useColorMode from "../../../hooks/useColorMode.ts";

const themeConfig = new Compartment();
const editorMode = new Compartment();

interface Options {
  enableVim?: boolean;
  preferColorMode?: "dark" | "light";
}

function updateView(view: EditorView, options: Options) {
  const { enableVim, preferColorMode } = options;
  const vimModeExtensions: Extension[] = [];
  const colorSchemeExtensions: Extension[] = [];
  if (options.hasOwnProperty("enableVim")) {
    if (enableVim) {
      vimModeExtensions.push(vim({ status: true }));
    }
    view.dispatch({
      effects: editorMode.reconfigure(vimModeExtensions),
    });
  }

  if (options.hasOwnProperty("preferColorMode")) {
    if (preferColorMode === "dark") {
      colorSchemeExtensions.push(materialDark);
    } else {
      colorSchemeExtensions.push(basicLight);
    }
    view.dispatch({
      effects: themeConfig.reconfigure(colorSchemeExtensions),
    });
  }
}

interface Props {
  onChange: (code: string) => void;
  code: string;
}

export default function (props: Props) {
  const ref = useRef(null);
  const { onChange, code } = props;
  const [vimMode, setVimMode] = React.useState(true);
  const [codemirrorView, setCodeMirrorView] = React.useState<EditorView>();
  useEffect(() => {
    let updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const code = update.state.doc.toString();
        onChange(code);
        // Handle the event here
      }
    });

    // const theme = EditorView.theme({
    //   spe,
    // });

    let startState = EditorState.create({
      doc: code,
      // doc: testDoc,
      extensions: [
        editorMode.of([vim({ status: true })]),
        basicSetup,
        // javascript(),
        cpp(),
        // markdown({
        //   base: markdownLanguage,
        //   codeLanguages: languages,
        //   addKeymap: true,
        //   extensions: [],
        // }),
        // materialDark,
        updateListenerExtension,
        themeConfig.of([materialDark]),
        // syntaxHighlighting(defaultHighlightStyle),
      ],
    });

    const parent = document.querySelector("#code-mirror");
    if (parent !== null) {
      const view = new EditorView({
        state: startState,
        parent,
      });
      setCodeMirrorView(view);
    }
  }, [ref]);

  React.useEffect(() => {
    if (codemirrorView) {
      updateView(codemirrorView, {
        enableVim: vimMode,
        preferColorMode: colorMode,
      });
    }
  }, [codemirrorView, vimMode]);

  const [colorMode, setColorMode] = useColorMode();

  React.useEffect(() => {
    if (codemirrorView) {
      updateView(codemirrorView, { preferColorMode: colorMode });
    }
  }, [colorMode, codemirrorView]);

  return (
    <div>
      <div className="prose dark:prose-invert prose-slate flex flex-row items-center">
        <div className="flex flex-row items-center">
          <input
            checked={vimMode}
            onChange={(e) => setVimMode(e.target.checked)}
            type="checkbox"
            id="vimMode"
            name="vimMode"
            className="enabled:hover:border-gray-400 disabled:opacity-75"
          />
          <label htmlFor="vimMode" className="ml-2">
            vim mode
          </label>
        </div>
        <div className="flex flex-row items-center ml-4">
          <input
            checked={colorMode === "dark"}
            onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")}
            type="checkbox"
            id="darkMode"
            name="darkMode"
            className="enabled:hover:border-gray-400 disabled:opacity-75"
          />
          <label htmlFor="darkMode" className="ml-2">
            dark mode
          </label>
        </div>
      </div>
      <div id="code-mirror" ref={ref}></div>
    </div>
  );
}
