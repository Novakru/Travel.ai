import React from 'react';
import { useRouter } from 'next/router';
import Demo from '@app/demo';  // 导入实际的 Demo 组件
import FooterComponent from '@components/FooterComponent';
import dynamic from 'next/dynamic';
import '@styles/demo.css';

// 动态导入 Chatui 组件，禁用 SSR
const Chatui = dynamic(() => import('@components/Chatui'), { ssr: false });

const DemoPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // 获取URL中的id参数

    return (
        <>
            <div className="background-container"></div>
            <div id="root">
                <div className="main-content">
                    {/* 显示获取到的id */}
                    {/* <h1>Record ID: {id}</h1>   */}
                    <Demo recordId={id as string} />  {/* 将recordId传递给Demo组件 */}
                </div>
            </div>
        </>
    );
};

export default DemoPage;
