"use client"
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
import { useRouter } from 'next/navigation';


export default function Stories({ stories }: { stories: story[] }) {

    let { push } = useRouter()

    return (
        <div className="Stories">

            <Swiper className="Stories-swiper"

                // effect="coverflow"
                modules={[Navigation, Pagination]}
                // navigation={true}
                slidesPerView={stories.length === 1 ? 1 : stories.length === 2 ? 2 : stories.length === 3 ? 3 : 4}
                pagination={{ clickable: true, dynamicBullets: true, }}



            // onSlideChange={() => console.log('slide change')}
            >
                {stories.length > 0 ?
                    stories.map(story => (
                        <SwiperSlide key={story._id} onClick={() => push(`/main/stories/${story._id}`)} >
                            <Image src={story.userImage} width={55} height={55} alt="astronaut" priority />
                        </SwiperSlide>
                    ))
                    :
                    <>
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
                    </>
                }

            </Swiper>
        </div>
    )
}
