import * as React from "react";

import Editor from "../CodeMirror/Editor.tsx";
import shaderInitialCode from "./shader.glsl.ts";
import vertexInitialCode from "./vertex.glsl.ts";
import GLSLRender from "../GLSLRender/GLSLRender.tsx";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function () {
  const [shaderCode, setShaderCode] = React.useState(shaderInitialCode);
  const [vertexCode, setVertexCode] = React.useState(vertexInitialCode);

  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef && !containerRef.current) return;
    let camera, scene, renderer;

    let uniforms;

    init();
    animate();

    function init() {
      const container = containerRef.current;

      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      scene = new THREE.Scene();

      const geometry = new THREE.PlaneGeometry(2, 2);

      uniforms = {
        time: { value: 1.0 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexCode,
        fragmentShader: shaderCode,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    //

    function animate() {
      requestAnimationFrame(animate);

      uniforms["time"].value = performance.now() / 1000;

      renderer.render(scene, camera);
    }
    return () => containerRef.current.removeChild(renderer.domElement);
  }, [containerRef, shaderCode, vertexCode]);
  return (
    <div className={"w-full text-xs"}>
      <Editor code={shaderCode} onChange={setShaderCode}></Editor>
      <Editor code={vertexCode} onChange={setVertexCode}></Editor>
      {/*<div className="prose dark:prose-invert prose-slate">*/}
      {/*  <GLSLRender code={shaderCode}></GLSLRender>*/}
      {/*</div>*/}
      <div
        ref={containerRef}
        className="w-full"
        style={{ height: "300px" }}
      ></div>
    </div>
  );
}
