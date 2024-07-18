import React from 'react';
import FooterComponent from "./components/FooterComponent";
import dynamic from "next/dynamic";
import '../../styles/demo.css'; 

// 动态导入 Chatui 组件，禁用 SSR
const Chatui = dynamic(() => import('./components/Chatui'), { ssr: false });

const Demo: React.FC = () => {
    return (
        <>
            <div className="background-container"></div>
            <div id="root">
                <div className="main-content">
					<Chatui/>
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default Demo;
