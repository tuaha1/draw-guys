import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link }
    from 'react-router-dom';
import App from './App';

function FrontPage() {
    return <Router>
        <Routes>
            <Route path='/' element={<AskForUser />}></Route>
            <Route path='/app' element={<App />}></Route>
        </Routes>
    </Router>
}

function AskForUser() {

    const [userName, setUserName] = useState();

    const getText = (e) => {
        setUserName(e.target.value);
    }

    return <div>
        <div className="row justify-content-center">
            <div className="col-4" style={{ padding: "5% 0%", backgroundColor: "#FFD4B2", margin: "50px", padding: "20px", borderRadius: "20px" }}>
                <h1 style={{ textAlign: "center", fontFamily: 'Open Sans', color: "#3C2A21" }}>Draw-Guys</h1>
                <input style={{ margin: "5px 0px" }} type="text" placeholder="Enter your name" class="form-control" value={userName} onChange={getText} />
                <Link to={"/app"} ><button className="btn btn-primary" style={{ width: "100%" }}>Submit</button></Link>
            </div>
        </div>
    </ div >
}

export default FrontPage;