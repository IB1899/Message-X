
import { EffectCards, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { SwiperSlide, Swiper, SwiperRef } from "swiper/react"

import 'swiper/css';
import 'swiper/css/pagination';


import Image from "next/image"

import img1 from "@/../public/test1.jpg"
import img2 from "@/../public/test2.png"
import img3 from "@/../public/test3.png"
import img4 from "@/../public/test4.jpg"

import { FaQuoteLeft, FaAngleLeft, FaAngleRight } from "react-icons/fa"


export default function Stories() {


    return (
        <Swiper className="Stories"

            // effect="coverflow"
            modules={[Navigation, Pagination]}
            navigation={true}
            slidesPerView={4}
            pagination={{ clickable: true, dynamicBullets: true, }}



        // onSlideChange={() => console.log('slide change')}
        >
            <SwiperSlide>
                <Image src={img1} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img2} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img3} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img4} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={img1} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={img1} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img2} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img3} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img4} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={img1} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img2} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img3} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>

            <SwiperSlide>
                <Image src={img4} quality={100} width={55} height={55} alt="astronaut" priority />
            </SwiperSlide>
        </Swiper>
    )
}
