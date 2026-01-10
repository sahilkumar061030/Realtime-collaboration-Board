import React, { useLayoutEffect, useState, useEffect, useRef } from "react";

const Canvas = ({ canvasRef, ctx, color, setElements, elements, tool, socket, lineWidth }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeRecognitionEnabled, setShapeRecognitionEnabled] = useState(true);
  const containerRef = useRef(null);

  // Get responsive canvas dimensions
  const getCanvasDimensions = () => {
    if (typeof window === 'undefined') return { width: 800, height: 600 };
    
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    return {
      width: isMobile ? width - 20 : isTablet ? width - 60 : width - 100,
      height: isMobile ? window.innerHeight - 200 : isTablet ? window.innerHeight - 250 : window.innerHeight - 300
    };
  };

  // Initialize canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    ctx.current = context;

    const dimensions = getCanvasDimensions();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);

      const newDimensions = getCanvasDimensions();
      canvas.width = newDimensions.width;
      canvas.height = newDimensions.height;
      
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    if (!ctx.current || !canvasRef.current) return;

    const context = ctx.current;
    const canvas = canvasRef.current;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (element.type === "pencil") {
        drawPencil(element);
      } else if (element.type === "line") {
        drawLine(element);
      } else if (element.type === "rect") {
        drawRect(element);
      } else if (element.type === "circle") {
        drawCircle(element);
      } else if (element.type === "eraser") {
        drawEraser(element);
      }
    });
  }, [elements]);

  useEffect(() => {
    if (!socket) return;

    const handleWhiteboardData = (data) => {
      console.log("Received whiteboard data:", data);
      setElements((prevElements) => [...prevElements, data]);
    };

    socket.on("whiteboardData", handleWhiteboardData);
    socket.emit("get-canvas-state");

    socket.on("canvas-state", (canvasState) => {
      console.log("Received canvas state:", canvasState);
      if (canvasState && canvasState.length > 0) {
        setElements(canvasState);
      }
    });

    return () => {
      socket.off("whiteboardData", handleWhiteboardData);
      socket.off("canvas-state");
    };
  }, [socket, setElements]);

  // SHAPE RECOGNITION ALGORITHM
  const detectShape = (path) => {
    if (!shapeRecognitionEnabled || path.length < 10) return null;
    
    const points = path;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    if (width < 30 && height < 30) return null;
    
    const totalPathLength = points.reduce((sum, point, i) => {
      if (i === 0) return 0;
      return sum + Math.sqrt(
        Math.pow(point.x - points[i-1].x, 2) + 
        Math.pow(point.y - points[i-1].y, 2)
      );
    }, 0);
    
    const directDistance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + 
      Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    if (totalPathLength > 0 && (directDistance / totalPathLength) > 0.7) {
      return { 
        type: 'line', 
        offsetX: firstPoint.x,
        offsetY: firstPoint.y,
        width: lastPoint.x - firstPoint.x,
        height: lastPoint.y - firstPoint.y
      };
    }
    
    const distToStart = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + 
      Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    if (distToStart < Math.max(width, height) * 0.2) {
      const aspectRatio = width / height;
      
      if (aspectRatio > 0.8 && aspectRatio < 1.2) {
        return { 
          type: 'circle',
          offsetX: minX,
          offsetY: minY,
          width: width,
          height: height
        };
      }
      
      return { 
        type: 'rect',
        offsetX: minX,
        offsetY: minY,
        width: width,
        height: height
      };
    }
    
    return null;
  };

  const drawPencil = (element) => {
    if (!ctx.current) return;
    
    const { path, color: elementColor, lineWidth: width } = element;
    if (!path || path.length < 2) return;

    ctx.current.strokeStyle = elementColor;
    ctx.current.lineWidth = width || 2;
    ctx.current.lineCap = "round";
    ctx.current.lineJoin = "round";

    ctx.current.beginPath();
    ctx.current.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.current.lineTo(path[i].x, path[i].y);
    }

    ctx.current.stroke();
    ctx.current.closePath();
  };

  const drawLine = (element) => {
    if (!ctx.current) return;
    
    const { offsetX, offsetY, width, height, color: elementColor, lineWidth: lWidth } = element;

    ctx.current.strokeStyle = elementColor;
    ctx.current.lineWidth = lWidth || 2;
    ctx.current.lineCap = "round";
    ctx.current.beginPath();
    ctx.current.moveTo(offsetX, offsetY);
    ctx.current.lineTo(offsetX + width, offsetY + height);
    ctx.current.stroke();
    ctx.current.closePath();
  };

  const drawRect = (element) => {
    if (!ctx.current) return;
    
    const { offsetX, offsetY, width, height, color: elementColor, lineWidth: lWidth } = element;

    ctx.current.strokeStyle = elementColor;
    ctx.current.lineWidth = lWidth || 2;
    ctx.current.strokeRect(offsetX, offsetY, width, height);
  };

  const drawCircle = (element) => {
    if (!ctx.current) return;
    
    const { offsetX, offsetY, width, height, color: elementColor, lineWidth: lWidth } = element;

    const radiusX = Math.abs(width / 2);
    const radiusY = Math.abs(height / 2);
    const centerX = offsetX + width / 2;
    const centerY = offsetY + height / 2;

    ctx.current.strokeStyle = elementColor;
    ctx.current.lineWidth = lWidth || 2;
    ctx.current.beginPath();
    ctx.current.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.current.stroke();
    ctx.current.closePath();
  };

  const drawEraser = (element) => {
    if (!ctx.current) return;
    
    const { path, lineWidth: width } = element;
    if (!path || path.length < 2) return;

    ctx.current.strokeStyle = "white";
    ctx.current.lineWidth = width || 10;
    ctx.current.lineCap = "round";
    ctx.current.lineJoin = "round";

    ctx.current.beginPath();
    ctx.current.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.current.lineTo(path[i].x, path[i].y);
    }

    ctx.current.stroke();
    ctx.current.closePath();
  };

  // Get coordinates from mouse or touch event
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length > 0) {
      // Touch event
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);

    if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: tool,
          offsetX,
          offsetY,
          path: [{ x: offsetX, y: offsetY }],
          color,
          lineWidth: parseInt(lineWidth),
        },
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        { 
          type: tool, 
          offsetX, 
          offsetY, 
          width: 0, 
          height: 0, 
          color,
          lineWidth: parseInt(lineWidth)
        },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { offsetX, offsetY } = getCoordinates(e);

    if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) => {
        const newElements = [...prevElements];
        const currentElement = newElements[newElements.length - 1];
        if (currentElement && currentElement.path) {
          currentElement.path = [...currentElement.path, { x: offsetX, y: offsetY }];
        }
        return newElements;
      });
    } else {
      setElements((prevElements) => {
        const newElements = [...prevElements];
        const index = newElements.length - 1;
        if (index >= 0) {
          const { offsetX: startX, offsetY: startY } = newElements[index];
          newElements[index] = {
            ...newElements[index],
            width: offsetX - startX,
            height: offsetY - startY,
          };
        }
        return newElements;
      });
    }
  };

  const handleEnd = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    setIsDrawing(false);

    if (tool === "pencil" && shapeRecognitionEnabled && elements.length > 0) {
      const currentElement = elements[elements.length - 1];
      
      if (currentElement.path && currentElement.path.length > 10) {
        const detectedShape = detectShape(currentElement.path);
        
        if (detectedShape) {
          setElements((prevElements) => {
            const newElements = [...prevElements];
            newElements[newElements.length - 1] = {
              ...detectedShape,
              color: currentElement.color,
              lineWidth: currentElement.lineWidth
            };
            return newElements;
          });
          
          console.log("✨ Shape detected and converted:", detectedShape.type);
        }
      }
    }

    if (socket && elements.length > 0) {
      const currentElement = elements[elements.length - 1];
      console.log("Emitting drawing:", currentElement);
      socket.emit("whiteboardData", currentElement);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" ref={containerRef}>
      {/* Top Horizontal Toolbar */}
      <div className="bg-white border-b border-gray-300 shadow-sm px-2 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center">
          {/* Shape Recognition Toggle */}
          <label className="flex items-center gap-1 sm:gap-2 bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              checked={shapeRecognitionEnabled}
              onChange={(e) => setShapeRecognitionEnabled(e.target.checked)}
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-xs sm:text-sm font-medium text-blue-700 whitespace-nowrap">
              ✨ AI Shape
            </span>
          </label>
        </div>
      </div>
      
      {/* Canvas Container */}
      <div className="flex-1 flex justify-center items-center p-2 sm:p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="border-2 border-gray-300 rounded-lg shadow-inner touch-none max-w-full max-h-full"
          style={{ 
            cursor: tool === "eraser" ? "not-allowed" : "crosshair",
            backgroundColor: "white"
          }}
        />
      </div>
    </div>
  );
};

export default Canvas;