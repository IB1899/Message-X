"use client"

import { setIsAddStory } from "@/toolkit/slices/MainSlice"
import { AppDispatch } from "@/toolkit/store"
import { FaGlassCheers } from "react-icons/fa"
import { useDispatch } from "react-redux"

import { EffectCards, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { SwiperSlide, Swiper, SwiperRef } from "swiper/react"

import Image from "next/image"
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from "next/navigation"


export default function VerticalStories({ stories }: { stories: story[] }) {

    let dispatch = useDispatch<AppDispatch>()

    let { push } = useRouter()

    return (
        <div className='VerticalStories'>

            <header>
                <h1>Stories</h1>
                <i onClick={() => dispatch(setIsAddStory(true))} > <FaGlassCheers /> </i>
            </header>

            <Swiper className="stories"

                // effect="coverflow"
                direction="vertical"
                modules={[Navigation, Pagination]}
                spaceBetween={12}
                slidesPerView={window.innerWidth > 845 ? 3 : 1}
                pagination={{ clickable: true, dynamicBullets: true, }}

            // onSlideChange={() => console.log('slide change')}
            >
                {stories.map(story => (

                    <SwiperSlide key={story._id} onClick={() => push(`/main/stories/${story._id}`)}>
                        <Image className="userImage" src={story.userImage} width={50} height={50} alt="userImage" priority quality={100} />
                        <Image className="story" src={story.story} width={250} height={210} alt="story" priority quality={100} />
                        <h5> {story.username} </h5>
                    </SwiperSlide>

                ))}

            </Swiper>

        </div>
    )
}
