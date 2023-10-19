"use client"

import Image from "next/image"
import astronaut1 from "@/../public/images/signup 1.jpg"
import astronaut2 from "@/../public/images/signup 2.jpg"
import astronaut3 from "@/../public/images/signup 3.jpg"
import astronaut4 from "@/../public/images/signup 4.jpg"

import { Autoplay, EffectCards, EffectCoverflow , Navigation, Pagination } from 'swiper/modules';
import { SwiperSlide, Swiper, SwiperRef } from "swiper/react"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import { FaQuoteLeft, FaAngleLeft, FaAngleRight } from "react-icons/fa"

export default function RightSide() {


    return (
        <Swiper className="RightSide"

            autoplay={{
                pauseOnMouseEnter:true,
                delay: 5000,
                disableOnInteraction: false,
            }}

            // effect="coverflow"
            modules={[Navigation, Pagination , Autoplay]}
            navigation={true}
            loop={true}
            slidesPerView={1}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            // onSlideChange={() => console.log('slide change')}
        >
            <SwiperSlide>
                <Image className="first" src={astronaut4} quality={100} alt="astronaut" priority />
                <div className="text">
                    <i> <FaQuoteLeft /> </i>
                    <p> Embark on an exhilarating journey, where each conversation unveils new horizons of excitement and discovery. </p>
                </div>
                <div className="navigation">
                    <i> <FaAngleLeft /> </i>
                    <i> <FaAngleRight /> </i>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <Image className="first" src={astronaut1} quality={100} alt="astronaut" priority />
                <div className="text">
                    <i> <FaQuoteLeft /> </i>
                    <p> Experience the thrill of vibrant interactions, as our platform ignites your sense of digital exploration.. </p>
                </div>
                <div className="navigation">
                    <i> <FaAngleLeft /> </i>
                    <i> <FaAngleRight /> </i>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <Image className="first" src={astronaut2} quality={100} alt="astronaut" priority />
                <div className="text">
                    <i> <FaQuoteLeft /> </i>
                    <p> Discover the limitless adventure in communication, where every exchange is a new and exhilarating path. </p>
                </div>
                <div className="navigation">
                    <i> <FaAngleLeft /> </i>
                    <i> <FaAngleRight /> </i>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <Image className="first" src={astronaut3} quality={100} alt="astronaut" priority />
                <div className="text">
                    <i> <FaQuoteLeft /> </i>
                    <p> Our platform redefines the ordinary, offering an awesome adventure where words become gateways to amazement . </p>
                </div>
                <div className="navigation">
                    <i> <FaAngleLeft /> </i>
                    <i  > <FaAngleRight /> </i>
                </div>
            </SwiperSlide>
        </Swiper>
    )
}