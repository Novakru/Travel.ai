import Image from "next/image";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";
import { CiInstagram } from "react-icons/ci";

const Footer = () => {
    return (
        <main className="px-[5%] py-[40px] bg-gray-100 special-font">
            <section className="" data-aos="fade-down">
                <div className="flex justify-between flex-wrap gap-8">
                    <div className="flex flex-col gap-2 mb-5 md:mb-0 w-full md:w-auto items-center md:items-start">
                        <Image src="/img/footer-logo.png" width={100} height={100} alt="logo" />
                        <p className="text-[12px] text-gray-500 font-semibold w-full md:max-w-[200px] text-center md:text-left">
                            DIY your trip in a minute, get full control for much longer.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 items-center md:items-start w-full md:w-auto mt-5 md:mt-0">
                        <div className="flex items-center gap-4">
                            <FaFacebookF className="text-4xl p-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-blue-600 transition" />
                            <CiInstagram className="text-4xl p-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-pink-500 transition" />
                            <FaTwitter className="text-4xl p-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:text-blue-400 transition" />
                        </div>

                        <p className="text-[35px] text-gray-500 font-bold mt-4">communication</p>

                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://github.com/Novakru/Travel.ai" className="flex items-center justify-center gap-2 bg-black py-2 px-5 rounded-full cursor-pointer hover:bg-gray-800 transition">
                                <Image src="/img/github2.png" width={60} height={60} alt="img" />
                                <div className="text-center">
                                    <h3 className="text-[11px] font-semibold text-white">点击访问</h3>
                                    <p className="text-[13px] font-extrabold text-white">github仓库</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-[14px] text-gray-500 text-center font-normal mt-5">All rights reserved @jadoo.co</p>
            </section>
        </main>
    );
}

export default Footer;
