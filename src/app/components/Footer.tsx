import Image from "next/image";
import { FaQq, FaEnvelope } from "react-icons/fa";
import { FaWeixin } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
    const [activeQRCode, setActiveQRCode] = useState<"qq" | "email" | "wechat" | null>(null);

    return (
        <main className="px-[5%] py-[40px] bg-gradient-to-r from-gray-200 to-gray-300 special-font">
            <section data-aos="fade-up">
                <div className="flex justify-between flex-wrap gap-8">
                    <div className="flex flex-col gap-4 items-center md:items-start w-full md:w-auto mt-5 md:mt-0">
                        <div className="flex items-center gap-4 relative">
                            <FaQq 
                                className="text-4xl p-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-blue-500 transition transform hover:scale-110" 
                                onClick={() => setActiveQRCode(activeQRCode === 'qq' ? null : 'qq')}
                            />
                            <FaEnvelope 
                                className="text-4xl p-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-red-500 transition transform hover:scale-110" 
                                onClick={() => setActiveQRCode(activeQRCode === 'email' ? null : 'email')}
                            />
                            <FaWeixin 
                                className="text-4xl p-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-green-500 transition transform hover:scale-110"
                                onClick={() => setActiveQRCode(activeQRCode === 'wechat' ? null : 'wechat')}
                            />
                            {activeQRCode && (
                                <div className="absolute top-[-150px] left-[-20px] bg-white p-2 rounded shadow-lg">
                                    <Image src={`/img/${activeQRCode}-qr.png`} width={100} height={100} alt="QR Code" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://github.com/Novakru/Travel.ai" className="flex items-center justify-center gap-2 bg-black py-2 px-5 rounded-full cursor-pointer hover:bg-gray-800 transition transform hover:scale-105">
                                <Image src="/img/github2.png" width={60} height={60} alt="GitHub" />
                                <div className="text-center">
                                    <h3 className="text-[11px] font-semibold text-white">点击访问</h3>
                                    <p className="text-[13px] font-extrabold text-white">GitHub仓库</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-[14px] text-gray-700 text-center font-normal mt-5">All rights reserved @travel.al</p>
            </section>
        </main>
    );
}

export default Footer;
