import Image from "next/image";

const Category = () => {
    interface CategoryItem {
        img: string;
        header: string;
        subheader: string;
    }

    const categories: CategoryItem[] = [
        {
            img: "/img/settings.png",
            header: "全面的信息与大量数据库",
            subheader: "结合智谱大模型的API,在人文、地理、景点等各个方面拥有大量的背景知识信息，实现海量数据的利用",
        },
        {
            img: "/img/flight.png",
            header: "定制化路线规划与贴心导航",
            subheader: "结合高德API,提供最便捷的路线指引，更是能够精准地根据用户的偏好和需求，量身定制旅行路线",
        },
        {
            img: "/img/event.png",
            header: "精准的景点推荐与行程安排",
            subheader: "通过智能算法和用户的反馈，精准推荐最合适的当地景点和活动，包括热门的旅游胜地，以及隐藏的宝藏场所，确保每一天都充满活力和意义",
        },
        {
            img: "/img/weather.png",
            header: "实时更新与个性结合",
            subheader: "结合大模型的特点，结合实际情况，为用户调整行程提供及时建议",
        },
    ];

    return (
        <main 
            className="relative w-full py-[100px] px-[5%] grid grid-cols-1 gap-4 bg-cover bg-center" 
            style={{ backgroundImage: "url('/img/background.png')" }}
            id="category"
        >
            <section className="flex flex-col items-center text-center gap-4">
                <p className="text-[18px] text-litegrey font-bold special-font" data-aos="fade-down">我们提供最好的服务</p>
                <h1 className="text-3xl md:text-5xl font-bold" data-aos="fade-down">我们支持的服务</h1>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 place-items-center items-stretch gap-6 lg:gap-10 special-font">
                {categories.map((category, index) => (
                    <div className="relative" key={index}>
                        <div className="relative flex flex-col items-center p-10 sm:p-4 xl:p-10 rounded-3xl gap-4 z-10 bg-white shadow-lg h-full">
                            <div>
                                <Image src={category.img} width={100} height={100} alt="img" data-aos="fade-down" />
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <h2 className="text-[20px] text-litedark font-bold" data-aos="fade-down">{category.header}</h2>
                                <p className="text-[16px] text-litegrey" data-aos="fade-down">{category.subheader}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-[-18px] lg:bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-green rounded-tl-3xl rounded-br-lg p-6 lg:p-8 hidden"></div>
                    </div>
                ))}
            </section>

            <Image src="/img/grid.png" width={100} height={100} alt="grid" className="w-[18%] md:w-[8%] absolute top-[70px] right-5 lg:right-20" />
        </main>
    );
}

export default Category;