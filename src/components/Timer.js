import { useEffect, useState } from "react";

function Timer(props) {
    const socket = props.socket;
    const nextPlayer = props.nextPlayer;
    const [timer, setTimer] = useState(0);

    var interval;

    if (nextPlayer === true) {
        clearInterval(interval);
        socket.emit("drawing done", socket.id);
    }

    function startTimer(duration) {
        var start = Date.now();

        interval = setInterval(function () {
            // var elapsed = Math.floor((Date.now() - start) / 500);
            var elapsed = Math.floor((Date.now() - start) / 500);


            if (elapsed >= duration) {
                clearInterval(interval);
                socket.emit("drawing done", socket.id);
                return;
            }

            setTimer(elapsed);
            socket.emit("time data", elapsed);
        }, 1000);
    }

    useEffect(() => {
        clearInterval(interval);
        startTimer(100);
    }, []);

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
    );
}

export default Timer;