import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm"

const generator = rough.generator();

function createElement(x1, y1, x2, y2, type) {
    let roughElement;

    if (type === "line") {
        roughElement = generator.line(x1, y1, x2, y2);
    } else if (type === "rectangle") {
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    } else if (type === "circle") {
        roughElement = generator.circle(x1, y1, x2 - x1, y2 - y1);
    }

    return { x1, y1, x2, y2, roughElement };
}

function CanvasBoard(props) {
    const socket = props.socket;
    const shouldDraw = props.shouldDraw;

    const [elements, setElements] = useState([]);
    const [isDrawing, setDrawing] = useState(false);
    const [elementType, setElementType] = useState('line');

    useLayoutEffect(() => {
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);
        elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
    }, [elements])

    useEffect(() => {
        socket.on("receiveDrawingData", (data) => {
            setElements(data.elements);
        })

    }, [socket])

    const handleMouseDown = (e) => {
        setDrawing(true);
        const offsetX = e.nativeEvent.offsetX;
        const offsetY = e.nativeEvent.offsetY;
        const element = createElement(offsetX, offsetY, offsetX, offsetY, elementType);
        setElements(prevState => [...prevState, element]);
        socket.emit("sendDrawingData", { elements });
    }

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const offsetX = e.nativeEvent.offsetX;
        const offsetY = e.nativeEvent.offsetY;
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        const updatedElement = createElement(x1, y1, offsetX, offsetY, elementType);

        const elementCopy = [...elements];
        elementCopy[index] = updatedElement;
        setElements(elementCopy);
        socket.emit("sendDrawingData", { elements });
    }

    const handleMouseUp = () => {
        setDrawing(false);
    }

    const clearScreen = () => {
        socket.emit("clearScreen");
    }

    const undoElement = () => {
        socket.emit("undoElements", { elements })
    }

    return <div>
        <canvas
            width={1200}
            height={700}
            style={{ margin: "auto" }}
            className="border rounded"
            id={"myCanvas"}
            onMouseDown={shouldDraw ? handleMouseDown : () => { }}
            onMouseMove={shouldDraw ? handleMouseMove : () => { }}
            onMouseUp={shouldDraw ? handleMouseUp : () => { }}
        >
        </canvas>
        <div style={{ display: `${shouldDraw ? "flex" : "none"}`, justifyContent: "space-between" }} className="border rounded p-3">

            <div>
                <input
                    type="radio"
                    id="btn-line"
                    className="btn-check"
                    checked={elementType === "line"}
                    onChange={() => {
                        setElementType("line")
                    }} />
                <label className="btn btn-sm rounded-2" for="btn-line">line</label>

                <input
                    type="radio"
                    id="btn-rectangle"
                    className="btn-check"
                    checked={elementType === "rectangle"}
                    onChange={() => {
                        setElementType("rectangle")
                    }} />
                <label className="btn btn-sm rounded-2" for="btn-rectangle" >rectangle</label>

                <input
                    type="radio"
                    className="btn-check"
                    id="btn-circle"
                    checked={elementType === "circle"}
                    onChange={() => {
                        setElementType("circle")
                    }} />
                <label class="btn btn-sm rounded-2" for="btn-circle">circle</label>
            </div>

            <div>
                <button className="btn btn-sm " onClick={clearScreen}> clear screen </button>
                <button className="btn btn-sm " onClick={undoElement}> undo </button>
            </div>

        </div>
    </div>
}

export default CanvasBoard;