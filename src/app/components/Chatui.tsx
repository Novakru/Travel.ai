<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import React from "react";
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
import Chat, { Bubble, useMessages } from "@chatui/core";
import "@chatui/core/dist/index.css";
import "../../../styles/Chatui.css"; // 确保你有这个CSS文件
import { ChakraProvider } from "@chakra-ui/react";
import { Stepper, Step, Button } from '@chatui/core';
import { RemoteRunnable } from "@langchain/core/runnables/remote";
import axios from 'axios';
import TrainTicketCard from "./TrainTicketCard";
import HotelCard from "./HotelCard";
<<<<<<< HEAD
import { useRouter } from 'next/router';
=======
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5

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

const Chatui: React.FC<{ recordId: string }> = ({ recordId }) => {
  const { messages, appendMsg, updateMsg, deleteMsg, setTyping } = useMessages(initialMessages);
  const [historyString, setHistoryString] = useState("");

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
      console.log('Itinerary:', itinerary);

      // 将 result.content 发送到 http://127.0.0.1:5000/map/data
      try {
        const response = await axios.post('http://127.0.0.1:5000/map/data', {
          data: itinerary
        });
        console.log('Data sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending data:', error);
      }

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

<<<<<<< HEAD
  useEffect(() => {
    if (recordId) {
      const fetchMessages = async () => {
        try {
          console.log(`Fetching messages for session ID: ${recordId}`);
          const response = await fetch(`http://127.0.0.1:8000/chat/${recordId}`);
          if (!response.ok) {
            throw new Error(`Error fetching messages: ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Fetched messages:', data);
          const storedMessages = data.messages.map((message) => ({
            type: message.type,
            content: JSON.parse(message.content),
            position: message.position,
            user: JSON.parse(message.user),
          }));
          storedMessages.forEach(message => appendMsg(message));
          
          // 更新 historyString
          const historyStr = storedMessages.map(msg => {
            const prefix = msg.position === 'right' ? '用户: ' : '助手: ';
            return `${prefix}${msg.content.text || msg.content.html || ''}`;
          }).join('\n');
          setHistoryString(historyStr);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [recordId, appendMsg]);

  async function handleSend(type: string, val: string) {
=======
  const handleSend = async (type, val) => {
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
    if (type === "text" && val.trim()) {
      const newMsg = {
        type: "text",
        content: { text: val },
        position: "right",
        user: { avatar: "https://th.bing.com/th/id/OIP.usJ6wLxeHm0K6XYCHUAoegAAAA?rs=1&pid=ImgDetMain" },
      };

<<<<<<< HEAD
        if (val.includes("🚗自驾游路线") || val.includes("🗺景区分布")) {
=======
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
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
          appendMsg({
            type: "custom-button",
            content: { text: '前往地图主页探索自驾游路线🚗和景区分布🌊吧！' },
            position: "left",
            user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
          });
        } 

        else if (val.includes("🚝高铁出行")) {
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
<<<<<<< HEAD
      
        else if (val.includes("🏠酒店预约")) {
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
      
      
      else {
        appendMsg(newMsg);
        console.log('Sending message:', newMsg);

        try {
          const response = await fetch(`http://127.0.0.1:8000/chat/${recordId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMsg)
          });
          if (!response.ok) {
            throw new Error(`Error storing message: ${response.statusText}`);
          }
          console.log('Message stored successfully');
        } catch (error) {
          console.error('Error storing message:', error);
        }

        // 调用大模型生成回答
        await generateModelResponse(val);
=======
      } catch (error) {
        console.error('Fetch error:', error);
        deleteMsg(placeholderId);
        appendMsg({
          type: "text",
          content: { text: '对不起，出现了一些错误，请稍后再试。' },
          position: "left",
          user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
        });
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
      }
    }
  };

<<<<<<< HEAD
  async function generateModelResponse(userInput) {
    const placeholderId = `msg-placeholder-${Date.now()}`;
    const placeholderMsg = {
      type: "text",
      content: { text: '...' },
      position: "left",
      user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
      _id: placeholderId,
    };
    appendMsg(placeholderMsg);

    try {
      const data = {
        input: {
          history: historyString,
          input: userInput,
        },
        config: {}
      };
      console.log('Sending request with data:', data);

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
          reader.read().then(async ({ done, value }) => {
            if (done) {
              console.log('Stream closed');
              const filteredContent = filterMarkdownSymbols(resContent);
              const updateContent = {
                type: "html",
                content: { html: filteredContent.replace(/\n/g, '<br>') },
                position: "left",
                user: { avatar: "https://th.bing.com/th/id/OIP.T6WSFFONzxp1SsgBPAw-QwAAAA?rs=1&pid=ImgDetMain" },
              };
              updateMsg(placeholderId, updateContent);


              // 将大模型的回答发送到后端存储
              try {
                const response = await fetch(`http://127.0.0.1:8000/chat/${recordId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(updateContent)
                });
                if (!response.ok) {
                  throw new Error(`Error storing message: ${response.statusText}`);
                }
                console.log('Message stored successfully');
              } catch (error) {
                console.error('Error storing message:', error);
              }

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

  function handleQuickReplyClick(item: any) {
=======
  const handleQuickReplyClick = (item) => {
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
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
<<<<<<< HEAD
=======
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
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
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
<<<<<<< HEAD
=======
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
>>>>>>> 5e223193ba613010e1f290cf06c072398759b0b5
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
