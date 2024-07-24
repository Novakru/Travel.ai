import React from 'react';

const CallToActionR = ({
  mediaSrc = '/video/video02.mp4', // Default video file path
  title = '高德地图向导',
  content = '结合高德地图的最新API，与CHAT-UI界面中的旅行地点推送相结合，实现在同一张页面上显示，旅行时期每一天的气温和天气情况，多种交通方式切换，为您的出行保驾护航。',
  buttonText = 'Explore our Trip Genius'
}) => {
  return (
    <div
      className="flex flex-col md:flex-row-reverse items-center justify-center bg-cover bg-center p-8" // Center horizontally
      style={{ backgroundImage: "url('/img/background.png')" }}
    >
      <div className="md:w-1/2 flex flex-col items-center md:items-start md:pl-16 mt-8 md:mt-0">
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
      <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0"> {/* Center video */}
        <video
          src={mediaSrc}
          width={740}
          height={310}
          className="rounded-3xl"
          controls
        />
      </div>
    </div>
  );
};

export default CallToActionR;