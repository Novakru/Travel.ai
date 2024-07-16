import React from 'react';

const FooterComponent: React.FC = () => {
  return (
    <footer className="footer py-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="flex gap-6">
          <a href="#home" className="hover:underline">Home</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#privacy" className="hover:underline">Privacy</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default FooterComponent;
