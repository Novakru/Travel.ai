import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";

const Book = () => {
    return (
        <main className="px-[5%] py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-6" id="bookings">
            <section className="grid grid-cols-1 gap-4">
                <p className="text-[16px] text-litegrey font-bold text-center md:text-left special-font" data-aos="fade-down">Easy and Fast</p>
                <h1 className="text-litedark text-3xl md:text-5xl text-center md:text-left font-extrabold w-full md:max-w-[500px]" data-aos="fade-down">只需轻松三步即可生成您专属的旅行规划</h1>

                <div className="flex items-center gap-2 special-font">
                    <div>
                        <Image src="/img/choose.png" width={40} height={40} alt="img"  data-aos="fade-down"/>
                    </div>
                    <div>
                        <h2 className="text-[16px] text-litegrey font-bold" data-aos="fade-down">选择您的目的地和旅行时间</h2>
                        <p className="text-[16px] text-litegrey font-normal max-w-[300px]" data-aos="fade-down">向系统提供您的候选目的地和计划旅行的天数</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 special-font">
                    <div>
                        <Image src="/img/make.png" width={40} height={40} alt="img"  data-aos="fade-down"/>
                    </div>
                    <div>
                        <h2 className="text-[16px] text-litegrey font-bold" data-aos="fade-down">选择您心仪的景点</h2>
                        <p className="text-[16px] text-litegrey font-normal max-w-[300px]" data-aos="fade-down">系统会根据您的实际情况为您定制专属的旅行计划和当地的特色景点，您可以从中选择心仪的景点 </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 special-font">
                    <div>
                        <Image src="/img/reach.png" width={40} height={40} alt="img"  data-aos="fade-down"/>
                    </div>
                    <div>
                        <h2 className="text-[16px] text-litegrey font-bold" data-aos="fade-down">规划科学的参观路线</h2>
                        <p className="text-[16px] text-litegrey font-normal max-w-[300px]" data-aos="fade-down">根据您选择的心仪景点，系统将会采用科学的算法为您规划科学合理的路线，为您的出行安全保驾护航</p>
                    </div>
                </div>
            </section>

            <section className="relative mt-20 md-mt-0 special-font">
                <div className=" p-4 rounded-2xl shadow-md w-[90%] md:max-w-[70%] grid grid-cols-1 gap-4 relative z-10 bg-white" data-aos="zoom-in">
                    <div className="w-full">
                        <Image src="/img/chinese_woman01.jpg" width={300} height={300} alt="img" className="w-full" />
                    </div>

                    <div className="grid gap-2 relative bg-white w-full">
                        <h2 className="text-litedark text-[18px] font-bold">北京香山之旅</h2>
                        <div className="flex items-center gap-2 text-[16px] text-litegrey">
                            <p>10月23日至10月30日</p>
                            <p>by 李丽</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-offwhite p-3 rounded-full">
                                <Image src="/img/leaf.png" width={10} height={10} alt="img" className="cursor-pointer" />
                            </div>
                            <div className="bg-offwhite p-3 rounded-full">
                                <Image src="/img/map.png" width={10} height={10} alt="img" className="cursor-pointer" />
                            </div>
                            <div className="bg-offwhite p-3 rounded-full">
                                <Image src="/img/send.png" width={10} height={10} alt="img" className="cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image src="/img/building.png" width={15} height={15} alt="img" />
                                <p className="text-[16px] text-litegrey">24个人去过</p>
                            </div>

                            <FaRegHeart className="text-lg text-[#4152CA] cursor-pointer" />
                        </div>

                        <div className="p-4 rounded-2xl shadow-md max-w-[500px] absolute right-[-60px] bottom-6 bg-white" data-aos="slide-right">
                            <div className="flex items-start justify-start gap-2">
                                <div>
                                    <Image src="/img/xingjiang.jpg" width={30} height={30} alt="img" className="rounded-full" />
                                </div>
                                <div>
                                    <p className="text-[14px] text-litegrey">旅行进度</p>
                                    <h2 className="text-[18px] text-litedark font-bold">新疆之旅</h2>

                                    <div>
                                        <p className="text-[14px] text-litedark font-bold">
                                            <span className="text-[#8A79DF]">40%</span> 已完成
                                        </p>

                                        <div className="h-[6px] bg-offwhite w-full rounded-2xl">
                                            <div className="bg-[#8A79DF] h-[6px] rounded-2xl w-[50%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Image src="/img/blue-shadow.png" width={600} height={600} alt="img" className="absolute top-[-100px] md:top-[-130px] right-[-20px] md:right-0" />

            </section>
        </main>
    );
}

export default Book;