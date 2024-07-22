import React from "react";
import Chat, { Bubble, useMessages } from "@chatui/core";
import "@chatui/core/dist/index.css";
import "../../../styles/Chatui.css"; // 确保你有这个CSS文件
import { ChakraProvider } from "@chakra-ui/react";
import { Stepper, Step, Button } from '@chatui/core';
import { RemoteRunnable } from "@langchain/core/runnables/remote";
import axios from 'axios';
import TrainTicketCard from "./TrainTicketCard";
import HotelCard from "./HotelCard";

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

const filterMarkdownSymbols = (text) => {
  return text.replace(/[#*]/g, '');
};

const Chatui = () => {
  const { messages, appendMsg, updateMsg, deleteMsg, setTyping } = useMessages(initialMessages);

  const appendStepper = async (plan) => {
    setTyping(true);
    const chain = new RemoteRunnable({
      url: `http://127.0.0.1:8000/chain/tagging`,
    });

    try {
      const result = await chain.invoke({
        input: plan,
      });

      console.log('Chain result:', result.content);

      let itinerary = typeof (result.content) === 'string' ? result.content : JSON.stringify(result.content);

      itinerary = itinerary.replace(/```json|```/g, '');
      itinerary = JSON.parse(itinerary);

      Object.keys(itinerary).forEach((day, dayIndex) => {
        const steps = [];
        const activities = itinerary[day];
        Object.keys(activities).forEach(time => {
          const timeActivities = activities[time];
          if (Array.isArray(timeActivities)) {
            timeActivities.forEach(activity => {
              steps.push({
                title: activity.时间,
                desc: activity.地点
              });
            });
          }
        });

        appendMsg({
          type: "text",
          content: { text: `开启第 ${dayIndex + 1}天的旅程吧！😙` },
          position: "left",
          user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        });

        appendMsg({
          type: "stepper",
          content: { steps },
          position: "left",
          user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        });
      });
      setTyping(false);
    } catch (error) {
      console.error("Error invoking chain:", error);
    }
  };

  const handleSend = async (type, val) => {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
        user: { avatar: "https://th.bing.com/th/id/OIP.usJ6wLxeHm0K6XYCHUAoegAAAA?rs=1&pid=ImgDetMain" },
      });

      if (val.includes("高铁出行")) {
        const trainTickets = [
          {
            from: "杭州东",
            to: "北京",
            depTime: "07:10",
            arrTime: "13:05",
            bestPrice: 538.5,
            isRecommended: true,
            description: "直达高铁，无需换乘"
          },
          {
            from: "杭州东",
            to: "北京",
            depTime: "08:24",
            arrTime: "13:38",
            bestPrice: 538.5,
            description: "途径多个景点，风景优美"
          }
        ];

        trainTickets.forEach(ticket => {
          appendMsg({
            type: "train-ticket",
            content: { ticket },
            position: "left",
            user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
          });
        });

        return;
      }

      if (val.includes("酒店预约")) {
        const hotel = {
          imageUrl: "https://bit.ly/2k1H1t6",
          location: "Cape Town",
          name: "Modern, Chic Penthouse with Mountain, City & Sea Views",
          price: "$119",
          rating: "4.84",
          reviews: 190
        };

        appendMsg({
          type: "hotel-card",
          content: { hotel },
          position: "left",
          user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        });

        return;
      }

      const placeholderId = `msg-placeholder-${Date.now()}`;
      appendMsg({
        type: "text",
        content: { text: '...' },
        position: "left",
        user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        _id: placeholderId,
      });

      try {
        const data = {
          input: {
            input: val,
          },
          config: {}
        };

        const response = await fetch('http://127.0.0.1:8000/chain/tagging_pure/stream_log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let resContent = '';

          function read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                console.log('Stream closed');
                const filteredContent = filterMarkdownSymbols(resContent);
                updateMsg(placeholderId, {
                  type: "html",
                  content: { html: filteredContent.replace(/\n/g, '<br>') },
                  position: "left",
                  user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
                });

                appendStepper(filteredContent);

                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              chunk.split('\r\n').forEach(eventString => {
                if (eventString && eventString.startsWith('data: ')) {
                  const str = eventString.substring("data: ".length);
                  const data = JSON.parse(str);
                  for (const item of data.ops) {
                    if (item.op === "add" && item.path === "/logs/ChatOpenAI/streamed_output_str/-") {
                      resContent += item.value.replace(/\n/g, '<br>');
                    }
                    if (item.op === "add" && item.path === "/logs/PydanticToolsParser/final_output") {
                      if (String(item.value.output) !== "null" && String(item.value.output) !== "undefined") {
                        resContent = JSON.stringify(item.value.output, null, 2).replace(/\n/g, '<br>');
                        break;
                      }
                    }
                  }
                }
              });

              const filteredContent = filterMarkdownSymbols(resContent);
              updateMsg(placeholderId, {
                type: "html",
                content: { html: filteredContent.replace(/\n/g, '<br>') },
                position: "left",
                user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
              });

              read();
            }).catch(error => {
              console.error('Stream error', error);
            });
          }

          read();
        } else {
          const errorText = await response.text();
          console.error('Server error:', errorText);
          deleteMsg(placeholderId);
          appendMsg({
            type: "text",
            content: { text: '对不起，出现了一些错误，请稍后再试。' },
            position: "left",
            user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
          });
        }
      } catch (error) {
        console.error('Fetch error:', error);
        deleteMsg(placeholderId);
        appendMsg({
          type: "text",
          content: { text: '对不起，出现了一些错误，请稍后再试。' },
          position: "left",
          user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        });
      }
    }
  };

  const handleQuickReplyClick = (item) => {
    handleSend("text", item.name);
  };

  const renderMessageContent = (msg) => {
    const { type, content, position } = msg;
    const bubbleClass = position === "right" ? "bubble-right" : "bubble-left";

    switch (type) {
      case "text":
        return <Bubble className={bubbleClass} content={content.text} />;
      case "html":
        return <Bubble className={bubbleClass} content={<div dangerouslySetInnerHTML={{ __html: content.html }} />} />;
      case "image":
        return (
          <Bubble className={bubbleClass} type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case "stepper":
        return (
          <Bubble className={bubbleClass} content={
            <Stepper current={2}>
              {content.steps.map((step, index) => (
                <Step key={index} title={step.title} desc={step.desc} />
              ))}
            </Stepper>
          } />
        );
      case "custom-button":
        return (
          <Bubble className={bubbleClass} content={
            <div>
              <h1 className="mb-2"> ✨✨ 点击下方按钮，有更好的用户体验哦！</h1>
              <Button
                block
                onClick={() => { window.location.href = '/map'; }}
              >
                {content.text}
              </Button>
            </div>
          } />
        );
      case "train-ticket":
        return (          
          <Bubble className={bubbleClass} content={
            <TrainTicketCard ticket={content.ticket} />
          } />
        );
      case "hotel-card":
        return (
          <Bubble className={bubbleClass} content={
            <HotelCard hotel={content.hotel} />
          } />
        );
      default:
        return null;
    }
  };

  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
};

export default Chatui;
