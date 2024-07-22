import React, { useEffect, useState } from 'react';
import FooterComponent from "./components/FooterComponent";
import dynamic from "next/dynamic";
import '../../styles/demo.css';

const Chatui = dynamic(() => import('./components/Chatui'), { ssr: false });

const Demo: React.FC<{ recordId: string }> = ({ recordId }) => {
    const [sessionIds, setSessionIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchSessionIds = async () => {
            try {
                console.log(`Fetching session IDs for recordId: ${recordId}`);  // 打印 recordId
                const response = await fetch(`http://localhost:8000/get_sessions/${recordId}`);
                const data = await response.json();
                setSessionIds(data.sessionIds);
            } catch (error) {
                console.error('Error fetching session IDs:', error);
            }
        };

        fetchSessionIds();
    }, [recordId]);

    const handleSessionClick = (sessionId: string) => {
        if (sessionId !== recordId) {
            window.location.href = `http://127.0.0.1:3000/demo/${sessionId}`;
        }
    };

    const handleNewChatClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/new_session/${recordId}`, {
                method: 'POST'
            });
            const data = await response.json();
            const newSessionId = data.new_session_id;
            window.location.href = `http://127.0.0.1:3000/demo/${newSessionId}`;
        } catch (error) {
            console.error('Error creating new session:', error);
        }
    };

    return (
        <>
            <div className="background-container"></div>
            <div id="root">
                <div className="sidebar">
                    <button className="new-chat-button" onClick={handleNewChatClick}>New Chat</button>
                    <ul>
                        {sessionIds && sessionIds.map((id, index) => (
                            <li key={id}>
                                <button 
                                    className={id === recordId ? 'current-session' : 'session-button'} 
                                    onClick={() => handleSessionClick(id)}
                                    disabled={id === recordId}
                                >
                                    {`对话 ${index + 1}`}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="main-content">
                    <Chatui recordId={recordId} />
                </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default Demo;
