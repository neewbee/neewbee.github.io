import * as React from "react";

import Editor from "../CodeMirror/Editor.tsx";
import shaderInitialCode from "./shader.glsl.ts";
import vertexInitialCode from "./vertex.glsl.ts";
import GLSLRender from "../GLSLRender/GLSLRender.tsx";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
const clock = new THREE.Clock();

export default function () {
  const [shaderCode, setShaderCode] = React.useState(shaderInitialCode);
  const [vertexCode, setVertexCode] = React.useState(vertexInitialCode);

  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef && !containerRef.current) return;
    let camera, scene, renderer;

    let uniforms, material;

    init();
    animate();

    function init() {
      const container = containerRef.current;

      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      scene = new THREE.Scene();

      const geometry = new THREE.PlaneGeometry(2, 2);

      uniforms = {
        u_resolution: { value: { x: null, y: null } },
        u_time: { value: null },
      };

      material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexCode,
        fragmentShader: shaderCode,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      var DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setViewport(
        0,
        0,
        container.clientWidth * 2,
        container.clientHeight * 2,
      );

      container.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
      if (uniforms.u_resolution !== undefined) {
        uniforms.u_resolution.value.x = containerRef.current.clientWidth * 2;
        uniforms.u_resolution.value.y = containerRef.current.clientHeight * 2;
        console.log("uniforms", uniforms);
      }
    }

    //

    function animate() {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();

      if (uniforms.u_resolution !== undefined) {
        uniforms.u_resolution.value.x =
          containerRef.current.clientWidth * window.devicePixelRatio;
        uniforms.u_resolution.value.y =
          containerRef.current.clientHeight * window.devicePixelRatio;
      }
      renderer.render(scene, camera);
    }
    return () => {
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [containerRef, shaderCode, vertexCode]);
  return (
    <div className={"w-full text-xs"}>
      <p>
        在学习前端可视化的过程中，除了线性代数之外，有一个很有意思的主题就是
        shader。你可以更改下面的代码来查看不同的效果
      </p>
      <Editor code={shaderCode} onChange={setShaderCode}></Editor>
      {/*<Editor code={vertexCode} onChange={setVertexCode}></Editor>*/}
      {/*<div className="prose dark:prose-invert prose-slate">*/}
      {/*  <GLSLRender code={shaderCode}></GLSLRender>*/}
      {/*</div>*/}
      <div
        ref={containerRef}
        className="w-full"
        style={{ height: "600px" }}
      ></div>
    </div>
  );
}
