import Image from "next/image";
import { TiLocationArrow } from "react-icons/ti";
import { useState, useEffect } from "react";
import styles from '../../../styles/Destination.module.css'; // Assuming you have a CSS module for styles

const Destination = () => {
    interface Destination {
        imgs: string[];
        location: string;
        amount: string;
        days: string;
        sideImg: string;
    }

    const destinations: Destination[] = [
        {
            imgs: ["/img/tiantan.jpg", "/img/beijing2.jpg", "/img/beijing3.jpg"],
            location: "北京",
            amount: "预算：¥5.42k",
            days: "5 Days Trip",
            sideImg: ""
        },
        {
            imgs: ["/img/dongfangmingzhu (2).jpg", "/img/shanghai2.jpg", "/img/shanghai3.jpg"],
            location: "上海",
            amount: "预算：¥4.2k",
            days: "3 Days Trip",
            sideImg: ""
        },
        {
            imgs: ["/img/zhonglou.jpg", "/img/xian2.jpg", "/img/xian3.jpg"],
            location: "西安",
            amount: "预算：¥9k",
            days: "7 Days Trip",
            sideImg: "/img/Decore2.png"
        },
    ];

    // Initialize state for current image indexes for each destination
    const [currentIndexes, setCurrentIndexes] = useState<number[]>(destinations.map(() => 0));
    const [fade, setFade] = useState<boolean[]>(destinations.map(() => true));

    useEffect(() => {
        const intervals = destinations.map((_, index) =>
            setInterval(() => {
                setFade((prevFade) => prevFade.map((f, i) => (i === index ? false : f)));
                setTimeout(() => {
                    setCurrentIndexes((prevIndexes) =>
                        prevIndexes.map((currentIndex, i) =>
                            i === index ? (currentIndex + 1) % destinations[i].imgs.length : currentIndex
                        )
                    );
                    setFade((prevFade) => prevFade.map((f, i) => (i === index ? true : f)));
                }, 500); // 500ms fade transition
            }, 3000) // Change the image every 3 seconds
        );

        // Clear intervals on component unmount
        return () => intervals.forEach(clearInterval);
    }, [destinations]);

    return (
        <main 
            className="relative w-full py-[80px] px-[5%] grid grid-cols-1 gap-6 bg-cover bg-center" 
            style={{ backgroundImage: "url('/img/background.png')" }}
            id="destination"
        >
            <section className="flex flex-col items-center text-center gap-4">
                <p className="text-[18px] text-litegrey font-bold special-font" data-aos="fade-down">Top Destinations</p>
                <h1 className="text-3xl md:text-5xl font-bold" data-aos="fade-down">热门旅游城市</h1>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 lg:gap-8 xl:gap-16 special-font">
                {destinations.map((destination, destIndex) => (
                    <div className="relative flex flex-col rounded-2xl shadow-sm" key={destIndex}>
                        <div className="relative z-10" data-aos="fade-down">
                            <div className={`h-[350px] ${styles.imageWrapper}`}>
                                <Image
                                    src={destination.imgs[currentIndexes[destIndex]]}
                                    width={300}
                                    height={300}
                                    alt="img"
                                    className={`w-full h-full rounded-tl-2xl rounded-tr-2xl ${fade[destIndex] ? styles.fadeIn : styles.fadeOut}`}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-2 p-4">
                                <div className="text-[18px] text-litegrey font-medium flex items-center justify-between gap-4">
                                    <p>{destination.location}</p> <p>{destination.amount}</p>
                                </div>
                                <div className="text-[16px] text-litegrey font-medium flex items-center gap-1">
                                    <TiLocationArrow className="text-litedark text-xl" /> <p>{destination.days}</p>
                                </div>
                            </div>
                        </div>

                        {destination.sideImg && (
                            <Image
                                src={destination.sideImg}
                                width={80}
                                height={80}
                                alt="img"
                                className="absolute right-[-15px] sm:right-[-30px] lg:right-[-50px] bottom-[90px]"
                            />
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Destination;
