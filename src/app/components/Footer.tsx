import Image from "next/image";
import { FaQq, FaEnvelope, FaWeixin, FaGithub } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
    const [activeQRCode, setActiveQRCode] = useState<"qq" | "email" | "wechat" | null>(null);

    const handleIconClick = (type: "qq" | "email" | "wechat") => {
        setActiveQRCode(activeQRCode === type ? null : type);
    };

    return (
        <main className="px-8 py-12 bg-gradient-to-r from-gray-200 to-gray-300 special-font">
            <section data-aos="fade-up">
                <div className="flex justify-between items-center flex-wrap gap-8">
                    <div className="w-full md:w-auto mt-5 md:mt-0 flex flex-col md:items-end items-center md:order-2">
                        <div className="flex items-center gap-8 relative">
                            <div className="relative flex flex-col items-center">
                                <FaQq 
                                    className="text-6xl p-4 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-blue-500 transition transform hover:scale-110" 
                                    onClick={() => handleIconClick('qq')}
                                />
                                {activeQRCode === 'qq' && (
                                    <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg">
                                        <Image src={`/img/qq-qr.png`} width={100} height={100} alt="QR Code" />
                                    </div>
                                )}
                            </div>
                            <div className="relative flex flex-col items-center">
                                <FaEnvelope 
                                    className="text-6xl p-4 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-red-500 transition transform hover:scale-110" 
                                    onClick={() => handleIconClick('email')}
                                />
                                {activeQRCode === 'email' && (
                                    <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg">
                                        <Image src={`/img/email-qr.png`} width={100} height={100} alt="QR Code" />
                                    </div>
                                )}
                            </div>
                            <div className="relative flex flex-col items-center">
                                <FaWeixin 
                                    className="text-6xl p-4 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-green-500 transition transform hover:scale-110"
                                    onClick={() => handleIconClick('wechat')}
                                />
                                {activeQRCode === 'wechat' && (
                                    <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg">
                                        <Image src={`/img/wechat-qr.png`} width={100} height={100} alt="QR Code" />
                                    </div>
                                )}
                            </div>
                            <a href="https://github.com/Novakru/Travel.ai" className="flex items-center justify-center gap-2 bg-black py-3 px-6 rounded-full cursor-pointer hover:bg-gray-800 transition transform hover:scale-105">
                                <FaGithub className="text-white text-2xl" />
                                <div className="text-center">
                                    <h3 className="text-sm font-semibold text-white">点击访问</h3>
                                    <p className="text-md font-extrabold text-white">GitHub仓库</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex md:order-1 justify-center md:justify-start mt-4 md:mt-0">
                        <p className="text-sm text-gray-700 font-normal">All rights reserved @travel.ai</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Footer;
