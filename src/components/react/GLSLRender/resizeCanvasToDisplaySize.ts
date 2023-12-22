import { type RefObject, useEffect, useState } from "react";
import type { RenderCanvasReturn } from "./GLSLRender.tsx";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>;
  callback: () => RenderCanvasReturn;
}

export function resizeCanvasToDisplaySize(
  props: Props,
): RenderCanvasReturn | undefined {
  const { canvasRef, callback } = props;
  const [returnCanvas, setReturnCanvas] = useState<
    RenderCanvasReturn | undefined
  >();

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      const canvasToDisplaySizeMap = new Map<HTMLCanvasElement, number[]>([
        [canvasElement, [400, 400]],
      ]);

      const updateCanvasSize = () => {
        const [displayWidth, displayHeight] =
          canvasToDisplaySizeMap.get(canvasElement) || [];
        canvasElement.width = displayWidth;
        canvasElement.height = displayHeight;
        setReturnCanvas(callback());
      };

      function onResize(entries: ResizeObserverEntry[]) {
        for (const entry of entries) {
          let width: number;
          let height: number;
          let dpr = window.devicePixelRatio;
          if (entry.devicePixelContentBoxSize) {
            // NOTE: Only this path gives the correct answer
            // The other paths are an imperfect fallback
            // for browsers that don't provide anyway to do this
            width = entry.devicePixelContentBoxSize[0].inlineSize;
            height = entry.devicePixelContentBoxSize[0].blockSize;
            dpr = 1; // it's already in width and height
          } else if (entry.contentBoxSize) {
            if (entry.contentBoxSize[0]) {
              width = entry.contentBoxSize[0].inlineSize;
              height = entry.contentBoxSize[0].blockSize;
            } else {
              // legacy
              // @ts-ignore
              width = entry.contentBoxSize.inlineSize;
              // @ts-ignore
              height = entry.contentBoxSize.blockSize;
            }
          } else {
            // legacy
            width = entry.contentRect.width;
            height = entry.contentRect.height;
          }
          const displayWidth = Math.round(width * dpr);
          const displayHeight = Math.round(height * dpr);
          canvasToDisplaySizeMap.set(entry.target as HTMLCanvasElement, [
            displayWidth,
            displayHeight,
          ]);
          updateCanvasSize();
        }
      }

      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(canvasElement, { box: "content-box" });

      return () => resizeObserver.unobserve(canvasElement);
    }
  }, [canvasRef]);

  return returnCanvas;
}
