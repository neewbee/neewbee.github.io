import * as React from "react";

import Editor from "../CodeMirror/Editor.tsx";
import sourceCode from "./shader.glsl.ts";
import GLSLRender from "../GLSLRender/GLSLRender.tsx";

export default function () {
  const [code, setSourceCode] = React.useState(sourceCode);
  const onChange = (code: string) => {
    setSourceCode(code);
  };
  return (
    <div>
      <Editor code={code} onChange={onChange}></Editor>
      <div className="prose dark:prose-invert prose-slate">
        <GLSLRender code={code}></GLSLRender>
      </div>
    </div>
  );
}
