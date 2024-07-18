import React from 'react';
import Link from "next/link";
import { IoIosPlay } from 'react-icons/io';

const FooterComponent: React.FC = () => {
  return (
    <footer className="footer py-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="flex gap-4"> {/* 缩小间距 */}
          <Link href="/" className="py-1 px-3 rounded-md text-gray-700 text-[14px] font-medium hover:no-underline hover:bg-gray-200 hover:shadow-md transition transform hover:scale-105">
            Home
          </Link>
          <Link href="https://github.com/Novakru/Travel.ai" className="py-1 px-3 rounded-md text-gray-700 text-[14px] font-medium hover:no-underline hover:bg-gray-200 hover:shadow-md transition transform hover:scale-105">
            Project
          </Link>
          <Link href="#privacy" className="py-1 px-3 rounded-md text-gray-700 text-[14px] font-medium hover:no-underline hover:bg-gray-200 hover:shadow-md transition transform hover:scale-105">
            Map
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default FooterComponent;
