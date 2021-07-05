import Head from "next/head";
import Tippy from "@tippyjs/react";
import { useEffect, useState, useRef } from "react";

import "tippy.js/dist/tippy.css";

export default function Home() {
  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);
  const [mode, setMode] = useState("pen");
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [painting, setPainting] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const colorRef = useRef(null);

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    const cnv = document.getElementById("canvas");
    setCanvas(cnv);
    setCtx(cnv.getContext("2d"));

    updateWidthAndHeight();
    window.addEventListener("resize", updateWidthAndHeight);

    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, []);

  const draw = (e) => {
    if (!painting) return;

    if (mode === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = lineWidth;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 4;
    }

    ctx.strokeStyle = lineColor;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  };

  const clearCanvas = () => {
    setPainting(false);
    ctx.clearRect(
      0,
      0,
      (canvas.width = window.innerWidth),
      (canvas.height = window.innerHeight)
    );
  };

  const changeLineWidth = ({ target }) => {
    setLineWidth(target.value);
  };

  const onColorChange = ({ target }) => {
    setLineColor(target.value);
  };

  const downloadImage = () => {
    let url = canvas.toDataURL("image/jpg");
    var a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "board.jpg");
    a.click();
  };

  const handleClr = () => {
    colorRef.current.click();
  };

  return (
    <div className="container">
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />

        <title>Whiteboard</title>
      </Head>

      <canvas
        onTouchEnd={() => {
          setPainting(false);
          ctx.beginPath();
        }}
        onTouchStart={() => {
          setPainting(true);
        }}
        onTouchMove={(e) => draw(e.touches[0])}
        onMouseUp={() => {
          setPainting(false);
          ctx.beginPath();
        }}
        onMouseDown={() => setPainting(true)}
        onMouseMove={draw}
        height={height}
        width={width}
        id="canvas"
      ></canvas>

      <div className="tool-bar">
        <Tippy content="Picker">
          <button id="picker" onClick={handleClr}>
            <input
              onChange={onColorChange}
              ref={colorRef}
              type="color"
              name=""
              id=""
            />
          </button>
        </Tippy>
        <Tippy content="Pen">
          <button
            className={mode === "pen" ? "active" : ""}
            id="ball-pen"
            onClick={() => setMode("pen")}
          >
            <i className="ri-ball-pen-fill"></i>
          </button>
        </Tippy>
        <Tippy content="Eraser">
          <button
            className={mode === "pen" ? "" : "active"}
            id="eraser"
            onClick={() => {
              if (lineWidth < 5) {
                setLineWidth(5);
                setTooltipVisible(true);
                setTimeout(() => setTooltipVisible(false), 2000);
              }

              setMode("eraser");
            }}
          >
            <i className="ri-eraser-fill"></i>
          </button>
        </Tippy>
        <Tippy visible={tooltipVisible} content={lineWidth} interactive={true}>
          <button
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            id="stroke"
          >
            <input
              onChange={changeLineWidth}
              min="1"
              max="20"
              value={lineWidth}
              type="range"
              name="stroke"
            />
          </button>
        </Tippy>
        <Tippy content="Reset Canvas">
          <button id="reset_button" onClick={clearCanvas}>
            <i className="ri-refresh-line"></i>
          </button>
        </Tippy>

        <Tippy content="Download">
          <button onClick={downloadImage}>
            <i className="ri-download-2-fill"></i>
          </button>
        </Tippy>

        <Tippy content="Source">
          <button
            onClick={() =>
              window.open(
                "https://github.com/officialpiyush/whiteboard",
                "_blank"
              )
            }
          >
            <i className="ri-github-fill"></i>
          </button>
        </Tippy>
      </div>
    </div>
  );
}
