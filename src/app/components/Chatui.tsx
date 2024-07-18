import React, { useEffect } from "react";
import Chat, { Bubble, useMessages } from "@chatui/core";
import "@chatui/core/dist/index.css";
import "../../../styles/Chatui.css"; // 确保你有这个CSS文件

const initialMessages = [
  {
    type: "text",
    content: { text: "主人好，我是Trip Genius✨，你的贴心小助手~" },
    user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
    position: "left",
  },
];

const defaultQuickReplies = [
  {
    name: "🎉北京三日游",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "🚗自驾游路线",
    isNew: true,
  },
  {
    name: "🗺景区分布",
  },
  {
    name: "🏠酒店预约",
  },
  {
    name: "🚝高铁出行",
  },
];

const Chatui = () => {
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  useEffect(() => {
    console.log("window.innerHeight", window.innerHeight);
  }, []);

  async function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
        user: { avatar: "https://th.bing.com/th/id/OIP.usJ6wLxeHm0K6XYCHUAoegAAAA?rs=1&pid=ImgDetMain" },
      });

      setTyping(true);

      try {
        const response = await fetch('http://127.0.0.1:5000/langserve/recommend-travel-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location: val }),
        });

        if (response.ok) {
          const result = await response.json();
          appendMsg({
            type: "text",
            content: { text: result.response },
            position: "left",
            user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
          });
        } else {
          appendMsg({
            type: "text",
            content: { text: '对不起，出现了一些错误，请稍后再试。' },
            position: "left",
            user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
          });
        }
      } catch (error) {
        console.error('Fetch error:', error);
        appendMsg({
          type: "text",
          content: { text: '对不起，出现了一些错误，请稍后再试。' },
          position: "left",
          user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        });
      } finally {
        setTyping(false);
      }
    }
  }

  function handleQuickReplyClick(item) {
    handleSend("text", item.name);
  }

  function renderMessageContent(msg) {
    const { type, content, position } = msg;
    const bubbleClass = position === "right" ? "bubble-right" : "bubble-left";

    switch (type) {
      case "text":
        return <Bubble className={bubbleClass} content={content.text} />;
      case "image":
        return (
          <Bubble className={bubbleClass} type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  return (
    <div className="chatui-container">
      <Chat
        navbar={{ title: "Trip Genius✨" }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        quickReplies={defaultQuickReplies}
        onQuickReplyClick={handleQuickReplyClick}
        onSend={handleSend}
      />
    </div>
  );
};

export default Chatui;
