import { useEffect, useRef, useState } from "react";

function getImage({ src, width, height }) {
  return new Promise(function (resolve, reject) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    // img.width = width;
    // img.height = height;
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(img);
    };
    img.src = src;
  });
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function setupCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  // const dpr = window.devicePixelRatio || 1;
  // // Get the size of the canvas in CSS pixels.
  // const rect = canvas.getBoundingClientRect();
  // // Give the canvas pixel dimensions of their CSS
  // // size * the device pixel ratio.
  // canvas.width = rect.width * dpr;
  // canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  // ctx.scale(dpr, dpr);
  return ctx;
}

function pixelate({
  width,
  height,
  context,
  imgData,
  resolution,
  size: defaultSize,
  alpha: defaultAlpha,
  offset: defaultOffset,
}) {
  const w = width;
  const h = height;
  const ctx = context;

  // option defaults
  const res = resolution || 16;
  const size = defaultSize || res;
  const alpha = defaultAlpha || 1;
  const offset = defaultOffset || 0;
  const cols = w / res + 1;
  const rows = h / res + 1;
  const halfSize = size / 2;
  const offsetX = offset ? offset.x || 0 : 0;
  const offsetY = offset ? offset.y || 0 : 0;

  let row, col, x, y, pixelY, pixelX, pixelIndex, red, green, blue, pixelAlpha;
  for (row = 0; row < rows; row++) {
    y = (row - 0.5) * res + offsetY;
    // normalize y so shapes around edges get color
    pixelY = Math.max(Math.min(y, h - 1), 0);

    for (col = 0; col < cols; col++) {
      x = (col - 0.5) * res + offsetX;
      // normalize y so shapes around edges get color
      pixelX = Math.max(Math.min(x, w - 1), 0);
      pixelIndex = (pixelX + pixelY * w) * 4;
      red = imgData[pixelIndex];
      green = imgData[pixelIndex + 1];
      blue = imgData[pixelIndex + 2];
      pixelAlpha = alpha * (imgData[pixelIndex + 3] / 255);
      ctx.fillStyle =
        "rgba(" + red + "," + green + "," + blue + "," + pixelAlpha + ")";

      ctx.fillRect(x - halfSize, y - halfSize, size, size);
    } // col
  } // row
}

export default function Pixelate(props) {
  const { src, width, height, style } = props;
  const ref = useRef();
  const [resolution, setResolution] = useState(8);
  const contextRef = useRef();
  const imageDataRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const [delay, setDelay] = useState(50);
  useEffect(() => {
    if (!ref.current) return;
    async function t() {
      if (!ref.current) return;
      if (!contextRef.current) {
        contextRef.current = setupCanvas(ref.current);
      }
    }
    t().then((r) => () => {});
  }, [ref.current]);

  useEffect(() => {
    async function t() {
      let imgData;

      if (!contextRef.current) return;
      const context = contextRef.current;
      const img = await getImage({ src, width, height });
      contextRef.current.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        width,
        height,
      );
      if (!imageDataRef) return;
      if (!imageDataRef.current) {
        imageDataRef.current = context.getImageData(0, 0, width, height).data;
      }
      imgData = imageDataRef.current;
      if (resolution !== 0) {
        context.clearRect(0, 0, width, height);
        pixelate({
          width,
          height,
          context,
          imgData,
          // size: 8,
          // offset: { x: 0, y: 0 },
          resolution,
        });
      }
    }
    t().then((r) => () => {});
  }, [contextRef, resolution]);

  useEffect(() => {
    const upbound = 20;
    const lowerbound = 0;
    if (isHovering) {
      let id = setInterval(() => {
        setResolution((v) =>
          v <= lowerbound ? (clearInterval(id), lowerbound) : v - 2,
        );
      }, delay);
      return () => clearInterval(id);
    } else {
      let id = setInterval(() => {
        setResolution((v) =>
          v >= upbound ? (clearInterval(id), upbound) : v + 2,
        );
      }, delay);
      return () => clearInterval(id);
    }
  }, [isHovering]);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        overflow: "hidden",
        borderRadius: `${width}px`,
        ...style,
      }}
    >
      <canvas
        style={{ position: "absolute", inset: 0 }}
        ref={ref}
        width={width}
        height={height}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      ></canvas>
    </div>
  );
}
