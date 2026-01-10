// import { useEffect, useLayoutEffect, useState } from 'react';
// import { data } from 'react-router-dom';
// import rough from 'roughjs';

// const roughGenrator = rough.generator();


// const WhiteBoard = ({
//   canvasref,
//    ctxref,
//     elements,
//      setElements,
//       tool,
//        color,
//        user,
//         socket,
//        }) => {

//    const [img, setImg] = useState(null);  
//    const [isdrawing , setIsdrawing]  = useState(false);      //check user is drawing or not
    
//    console.log(data);
//    useEffect(() => {
//      socket.on("whiteBoardDataResponce", (data) => {
//         if(data?.imgURL){
//           setImg(data.imgURL);
//         } 
//      });
//     },[socket]);

// useEffect(() => {
//   if (user?.presenter && ctxref.current) {
//     ctxref.current.strokeStyle = color;
//   }
// }, [color, user, ctxref]);

//        useEffect(() => {     //Runs this code only once when the component first loads (like componentDidMount)
//          if (!user?.presenter) return; // viewers skip setup
//       if (!canvasref.current) return; // Ensure canvas is ready


//         const canvas = canvasref.current;
//         canvas.height = window.innerHeight*2;
//         canvas.width = window.innerWidth*2;
//         const ctx  = canvas.getContext("2d");  //You get basic drawing tools (lines, arcs, etc.)
//         ctxref.current = ctx; //	Stores this context in a React ref so it can be used outside of this effect later
        
//         //for stoke ki line width ko shi krne ke liye
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 2;
//         ctx.lineCap = "round";
     
//     }, [color,ctxref,canvasref,user]);
  
    

//    useLayoutEffect(() => {  //This effect runs every time the elements array changes, like when the user draws.
    
//        if (!user?.presenter || !canvasref.current || !ctxref.current) return; // viewers skip drawing

//        const roughCanvas = rough.canvas(canvasref.current); // this is canvas wrapper Wraps your actual <canvas> element with RoughJS so you can draw in a hand-drawn style.
     
//       //looping
//            // for line deleting previous one
//            if(elements.length > 0){
//             ctxref.current.clearRect(
//               0,
//               0,
//               canvasref.current.width,
//               canvasref.current.height
//             );
//            }

//           elements.forEach(element => {
//             if(element.type=="pencil"){
//                   roughCanvas.linearPath(element.path,
//                     {        // pass some props
//                      stroke: element.stroke,
//                      strokeWidth: 5,
//                      roughness: 0,
//                     }
//                   );  //for pencil ke liey
//             }
//             else if(element.type=="line"){
//               roughCanvas.draw(
//               roughGenrator.line(
//                  element.offsetX,
//                  element.offsetY,
//                  element.width, 
//                  element.height,
//                  {        // pass some props
//                   stroke: element.stroke,
//                   strokeWidth: 5,
//                   roughness: 0,
//                  }
//                )
//               );

//             }
//             else if(element.type=="rect"){
//               roughCanvas.draw(
//               roughGenrator.rectangle(
//                  element.offsetX,
//                  element.offsetY,
//                  element.width, 
//                  element.height,
//                  {        // pass some props
//                   stroke: element.stroke,
//                   strokeWidth: 5,
//                   roughness: 0,
//                  }
//                )
//               );

//             }
         
//            });
       
//         const canvasImage = canvasref.current.toDataURL();
//         socket.emit("whiteBoardData" , canvasImage);
   


       
//     },[elements,user,socket,canvasref,ctxref]);

                                   
//   const handleMouseDown = (e) => {      //mtlb user cclik krta h
   
//     // click krne pr element genrate krna h
//     if (!user?.presenter) return;
//    const {offsetX, offsetY } = e.nativeEvent;
  
  
//    if(tool=="pencil"){
//        setElements((prevElements) => [
//         ...prevElements,
//         {
//           type: "pencil",
//           offsetX,
//           offsetY,
//           path: [[offsetX,offsetY]],
//           stroke: color,
//         },
//       ]);
//     }
     
//     else if(tool=="line"){
//       setElements((prevElements) => [
//       ...prevElements,    //set object
//         {
//           type: "line",
//           offsetX,
//           offsetY,
//           width:offsetX,
//           height: offsetY,
//           stroke: color,
//         },

//       ] );
//     }

//     else if(tool == "rect"){
//       setElements((prevElements) => [
//         ...prevElements,
//         {
//           type: "rect",
//           offsetX,
//           offsetY,
//           width: 0,
//           height: 0,
//           stroke: color,
//         },
//       ]);
//     }


//     setIsdrawing(true);
// };
  
//   const handleMouseMove = (e) => {
//  if (!user?.presenter || !isdrawing) return;

//      const {offsetX, offsetY } = e.nativeEvent;

//       //path of last element
//       //penncil  
//       if(tool == "pencil"){
//       const { path } = elements[elements.length-1];   //lastpath
//       const newPath = [...path,[offsetX,offsetY]];
     
//       setElements((prevElements) => 
//         prevElements.map((ele,index) => {
//             if(index === prevElements.length-1){
//                 return {
//                     ...ele,
//                     path: newPath,
//                 }
//             }
//             else{
//                 return ele;
//             }
//         })
    
//        )}


//      else if(tool=="line"){
//       setElements((prevElements) => 
//        prevElements.map((ele,index) => {
//         if(index ==elements.length-1){
//           return {
//             ...ele,
//             width: offsetX,
//             height: offsetY,
//           };
//         }
//         else{
//           return ele;
//         }
//        })
//       )}

//       else if(tool=="rect"){
//       setElements((prevElements) => 
//        prevElements.map((ele,index) => {
//         if(index ==elements.length-1){
//           return {
//             ...ele,
//             width: offsetX- ele.offsetX,  // minus kiya h
//             height: offsetY-ele.offsetY,
//           };
//         }
//         else{
//           return ele;
//         }
//        })
//       )}
   
    

//   } ; 
  

//   const handleMouseup = (e) => {
//     if (!user?.presenter) return;
//       setIsdrawing(false);
//   };



//    if (!user?.presenter) {
//     return (
//       <div className="bg-blend-darken border border-dark h-100 w-100 overflow-hidden">
//         <img
//           src={img}
//           alt="Real Time board Image shared by presenter"
//           className="wd-100 h-100"
//         />
//       </div>
//     );
//   }

    






//     return (

//     <>
//                       {/* {JSON.stringify(elements)}  You might be using JSON.stringify(element) in JSX just to display the raw object data on the screen for debugging. */}
//    <div    
//     onMouseDown={handleMouseDown}
//     onMouseMove={handleMouseMove}
//     onMouseUp={handleMouseup}
//     className="bg-blend-darken border border-dark  h-100 w-100 overflow-hidden"
//     >
//     <canvas 
//     ref={canvasref} 

//     > </canvas>   


//    </div>
 
//     </>

//   )

// };

// export default WhiteBoard;




import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasref,
  ctxref,
  elements,
  setElements,
  tool,
  color,
  user,
  socket,
}) => {
  const [img, setImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Listen for board updates from presenter
  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      console.log("Received from server:", data);
      if (data?.imgURL) {
        setImg(data.imgURL);
      }
    });
  }, [socket]);

  // Set stroke color when presenter changes color
  useEffect(() => {
    if (user?.presenter && ctxref.current) {
      ctxref.current.strokeStyle = color;
    }
  }, [color, user, ctxref]);

  // Canvas setup
  useEffect(() => {
    if (!user?.presenter) return;
    if (!canvasref.current) return;

    const canvas = canvasref.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth ;
    const ctx = canvas.getContext("2d");
    ctxref.current = ctx;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, [color, ctxref, canvasref, user]);

  // Draw elements
  useLayoutEffect(() => {
    if (!user?.presenter || !canvasref.current || !ctxref.current) return;

    const roughCanvas = rough.canvas(canvasref.current);

    if (elements.length > 0) {
      ctxref.current.clearRect(
        0,
        0,
        canvasref.current.width,
        canvasref.current.height
      );
    }

    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            { stroke: element.stroke, strokeWidth: 5, roughness: 0 }
          )
        );
      } else if (element.type === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            { stroke: element.stroke, strokeWidth: 5, roughness: 0 }
          )
        );
      }
    });

    // Send image to viewers
    const canvasImage = canvasref.current.toDataURL();
    socket.emit("whiteBoardData", canvasImage);
  }, [elements, user, socket, canvasref, ctxref]);

  // Mouse events
  const handleMouseDown = (e) => {
    if (!user?.presenter) return;
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prev) => [
        ...prev,
        { type: "line", offsetX, offsetY, width: offsetX, height: offsetY, stroke: color },
      ]);
    } else if (tool === "rect") {
      setElements((prev) => [
        ...prev,
        { type: "rect", offsetX, offsetY, width: 0, height: 0, stroke: color },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!user?.presenter || !isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    setElements((prev) =>
      prev.map((ele, index) => {
        if (index === prev.length - 1) {
          if (tool === "pencil") {
            return { ...ele, path: [...ele.path, [offsetX, offsetY]] };
          } else if (tool === "line") {
            return { ...ele, width: offsetX, height: offsetY };
          } else if (tool === "rect") {
            return {
              ...ele,
              width: offsetX - ele.offsetX,
              height: offsetY - ele.offsetY,
            };
          }
        }
        return ele;
      })
    );
  };

  const handleMouseUp = () => {
    if (!user?.presenter) return;
    setIsDrawing(false);
  };

  // Viewer mode
  if (!user?.presenter) {
    return (
      <div className="bg-blend-darken border border-dark h-full w-full overflow-hidden">
        {img ? (
          <img
            src={img}
            alt="Real Time board"
            // className="wd-100 h-100"
           
            style={{
              height: window.innerHeight *2,
              width: window.innerWidth*2,
              objectFit : "contain",
            }}
          
          
          />
        ) : (
          <p>Waiting for presenter...</p>
        )}
      </div>
    );
  }

  // Presenter mode
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="bg-blend-darken border border-dark h-100 w-100 overflow-hidden"
    >
      <canvas ref={canvasref}></canvas>
    </div>
  );
};

export default WhiteBoard;
