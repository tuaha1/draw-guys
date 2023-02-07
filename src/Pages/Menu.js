import { useNavigate } from 'react-router-dom';
import { useState } from "react"

function Menu() {

    const [input, setInput] = useState('');
    const history = useNavigate();

    const handleClick = () => {
        if (input === '') {
            return;
        }
        history("/main", { state: { nickname: input } });
    }

    const updateChange = (e) => {
        setInput(e.target.value);
    }

    return <div style={{ paddingTop: "5%" }}>
        <center>
            <div style={{ width: "20%" }}>
                <h1>Draw Guys</h1>
                <input className='form-control mb-1' style={{ width: "100%" }} value={input} onChange={updateChange} placeholder="Enter your name"></input>
                <button style={{ width: "100%" }} className='btn btn-primary' onClick={handleClick}>Enter Game</button>
            </div>
        </center>
    </div>
}

export default Menu;