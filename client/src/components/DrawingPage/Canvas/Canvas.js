// import { clear } from 'console';
import React, { useEffect, useRef, useState } from 'react';
import {MDBIcon } from "mdbreact";

import './Canvas.css';

const Canvas = ({name, socket}) => {

    const [isDrawing, setIsDrawing] = useState(false);
    const [colour, setColour] = useState("black");
    const [canvasClear, setCanvasClear] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [currentDraw, setCurrentDraw] = useState({x: 0, y: 0});
    const [currentMove, setCurrentMove] = useState({x: 0, y: 0});
    const [canvasOccupied, setCanvasOccupied] = useState(false);
    const [userScale, setUserScale] = useState(null);
    const scale = useRef(null);




    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
        canvas.style.width = `${canvas.parentNode.offsetWidth}px`;
        canvas.style.height = `${canvas.parentNode.offsetHeight}px`;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 3;
        contextRef.current = context;
    }, [])



    useEffect (() => {
       
        socket.on('canvas-move-frontend', (x, y) => {
            setCurrentMove(prev => ({
                ...prev, x:x, y:y
            }));
        });

        socket.on('canvas-draw-frontend', (x, y) => { 
            setCurrentDraw(prev => ({
                ...prev, x:x, y:y
            }));
        });

        socket.on('canvas-colour-frontend', colour => {
            setColour(colour);
        });

        socket.on('canvas-clear-frontend', clearCanvas => {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setIsDrawing(false);
            contextRef.current.beginPath();
        });

        socket.on('scale-backend', (scale) => {
            setUserScale(scale);
        });

        socket.on('canvasOccupied-frontend' , status =>{
            setCanvasOccupied(status);
          });

        // eslint-disable-next-line
    }, [])

    useEffect( () => {
        scale.current = canvasRef.current.width / userScale;
    }, [userScale])


    useEffect (() => {
        const x = currentDraw.x * scale.current;
        const y = currentDraw.y * scale.current;

        
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    }, [currentDraw])

    useEffect (() => {
        const x = currentMove.x * scale.current;
        const y = currentMove.y * scale.current;
        contextRef.current.moveTo(x, y);
    }, [currentMove])






    // Local drawing
    const startDrawing = ({nativeEvent}) => {
        if(canvasOccupied){return;}
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        socket.emit("canvasOccupied-backend", true);
        socket.emit('canvas-move-backend', offsetX, offsetY);
        socket.emit('user-drawing-backend', name);
        socket.emit('scale', canvasRef.current.width);
        
    }



    const draw = ({nativeEvent}) => {
        if(!isDrawing){return;}

        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        socket.emit('canvas-draw-backend', offsetX, offsetY);
        


    }


    const finishDrawing = () => {
        setIsDrawing(false);
        socket.emit("canvasOccupied-backend", false);
        socket.emit('user-drawing-backend', "");
    } 


    useEffect(() => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        socket.emit('canvas-clear-backend', canvasClear);
        setIsDrawing(false);
        contextRef.current.beginPath();
    }, [canvasClear]);



    useEffect(() => {
        contextRef.current.beginPath();
        contextRef.current.strokeStyle = colour;
        socket.emit('canvas-colour-backend', colour);

    }, [colour])

    return (
       
        <div className="canvas-col">
            <canvas className="drawing-canvas" onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} ref={canvasRef}/>
            <div className="colours">
                <MDBIcon icon="tint" className="colour" id="black" onClick={() => setColour("black")}/>
                <MDBIcon icon="tint" className="colour" id="blue" onClick={() => setColour("blue")}/>
                <MDBIcon icon="tint" className="colour" id="red" onClick={() => setColour("red")}/>
                <MDBIcon icon="tint" className="colour" id="green" onClick={() => setColour("green")}/>
                <MDBIcon icon="tint" className="colour" id="yellow" onClick={() => setColour("darkkhaki")}/>
                <MDBIcon icon="tint-slash" className="colour" id="clear" onClick={() => setCanvasClear(!canvasClear)}/>
            </div>
        </div>
    )


}

export default Canvas;
