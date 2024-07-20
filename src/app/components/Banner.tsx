import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosPlay } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const images = [
  "/img/travelling01.png",
  "/img/travelling02.png",
  "/img/travelling03.png",
  "/img/travelling04.png",
  "/img/travelling05.png",
  "/img/travelling06.png",
];

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Automatic slide interval in milliseconds
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <main className="relative w-full flex flex-col md:flex-row items-center justify-between py-[80px] md:py-[100px] px-[5%] bg bg-right-top bg-no-repeat bg-contain">
      <section className="w-full md:w-[50%] flex flex-col items-center md:items-start justify-center md:justify-start gap-3">
        <p className="text-[14px] text-green font-bold special-font" data-aos="fade-down">BEST DESTINATIONS AROUND THE WORLD</p>
        <h1 className="text-4xl md:text-5xl xl:text-6xl text-blue font-extrabold w-full lg:w-[80%] text-center md:text-left" data-aos="fade-down">一键开启
          <span className="relative w-full px-1">
            <span className="relative z-10 w-full">专属于您的</span>
            <Image src="/img/line-decore.png" width={100} height={100} alt="line-decore" className="absolute bottom-2 right-0 w-full" loading="eager" />
          </span>
          独家定制旅行</h1>
        <p className="text-[34px] text-litegrey font-bold w-full lg:w-[80%] xl:w-[65%] text-center md:text-left special-font" data-aos="fade-up">结合智谱大模型与高德地图API的专属旅游定制服务</p>

        <div className="flex items-center gap-4 special-font" data-aos="fade-up">
          <a href="#category" className="py-4 px-6 rounded-md bg-orange text-white text-[16px] font-bold flex items-center hover:shadow-md hover:bg-hotpink transition delay-200">了解详情</a>
          <Link href="/demo" className="py-4 px-6 rounded-md text-litegrey text-[16px] font-bold flex items-center gap-2 hover:shadow-md hover:bg-hotpink transition delay-200"><IoIosPlay className="text-2xl text-white p-[7px] rounded-full bg-green" /> Play Demo</Link>
        </div>
      </section>

      <section className="relative mt-5 md:mt-0">
        <Image src={images[currentImageIndex]} width={800} height={700} alt="heroimg" className="dangling-picture transition-opacity duration-1000" loading="eager" />
        <div className="absolute inset-0 flex items-center justify-between">
          <button onClick={handlePrevClick} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <IoIosArrowBack className="text-2xl" />
          </button>
          <button onClick={handleNextClick} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <IoIosArrowForward className="text-2xl" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 flex gap-2 p-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full ${index === currentImageIndex ? 'bg-blue' : 'bg-gray-300'}`}
              onClick={() => handleImageChange(index)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Banner;