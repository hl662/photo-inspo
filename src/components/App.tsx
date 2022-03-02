import React from 'react';
import './App.css';
import 'antd/dist/antd.less'; // or 'antd/dist/antd.less'
import Main from "./Main/Main";


function App() {
    return (
        // <Main > // include the browser router
        // https://stackoverflow.com/questions/59674690/react-router-with-ant-design-sider-how-to-populate-content-section-with-compo
        <div className="Main">
            <Main/>
        </div>
    );
}

export default App;
