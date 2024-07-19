import React from 'react';

const CallToActionR = ({
  mediaSrc = '/video/testvideo.mp4', // Default video file path
  title = 'Erase any background',
  content = 'Edit photos quickly and accurately without any effort. Photoroom simplifies your image, maintaining focus on the foreground and is twice as accurate as other apps.',
  buttonText = 'Explore background removal'
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