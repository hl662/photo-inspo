import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from "./Dashboard";
import Preferences from "./Preferences";
import Login from "./Login/Login";

export interface AuthenticationProps {
    token: string;
}

function App() {
    const [authProps, setAuthProps] = useState<AuthenticationProps>({token: ""});
    if (authProps.token === "") {
        return <Login setAuthProps={setAuthProps}/>;
    }
    return (
        <div className="App">
            <h1>Application</h1>
            <BrowserRouter>
                <Routes>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/preferences' element={<Preferences/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
