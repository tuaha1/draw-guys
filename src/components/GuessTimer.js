import { useEffect, useState } from "react";

function GuessTimer(props) {

    const socket = props.socket;
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        socket.on("receiveTimerData", (data) => {
            setTimer(data);
        })
    }, [])

    return (
        <div className="progress" style={{ height: "20px" }}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${timer}%`, color: "pink", backgroundColor: "pink" }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>
    )
}

export default GuessTimer;