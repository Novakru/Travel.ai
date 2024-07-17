import React from 'react';

const CallToActionL = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <video controls style={{ width: '100%' }}>
          <source src="./img/testvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>标题</h2>
        <p>一些描述性的文字。</p>
      </div>
    </div>
  );
};

export default CallToActionL;