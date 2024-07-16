import React from 'react';
import MainComponent from "./components/MainComponent";
import FooterComponent from "./components/FooterComponent";
import './demo.css'; 

const Demo: React.FC = () => {
    return (
        <>
            <div className="background-container"></div>
            <div id="root">
                <div className="main-content">
                    <MainComponent />
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default Demo;
