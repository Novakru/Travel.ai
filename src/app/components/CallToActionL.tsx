import React from 'react';

const CallToActionR = ({
  mediaSrc = '/video/testvideo.mp4', // Default video file path
  title = 'CHAT-UI',
  content = '采用对话式的交互方式，通过新增加卡片ui,行程日期规划卡片，增强用户的体验感和获得感，同时综合利用各种平台与信息渠道，提供例如火车票售价等贴心服务，确保一站式解决出行烦恼。',
  buttonText = 'Explore our Trip Genius '
}) => {
  return (
    <div
      className="flex flex-col md:flex-row-reverse items-center justify-between bg-cover bg-center p-8" // Center horizontally
      style={{ backgroundImage: "url('/img/background.png')" }}
    >
      <div className="md:w-1/2 flex justify-center"> {/* Center video */}
        <video
          src={mediaSrc}
          width={720}
          height={310}
          className="rounded-3xl"
          controls
          // Ensure the video is not muted
          muted={false}
          // Ensure the video can play inline
          playsInline
        />
      </div>
      <div className="text-center md:text-left md:w-1/2 md:pl-16 mt-8 md:mt-0">
        <h2 className="text-4xl font-bold text-gray-900 max-w-[500px] mx-auto md:mx-0">
          {title}
        </h2>
        <p className="text-base text-gray-700 mt-4 max-w-[600px] mx-auto md:mx-0">
          {content}
        </p>
        <a
          href="#"
          className="inline-block mt-6 px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition duration-300"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default CallToActionR;