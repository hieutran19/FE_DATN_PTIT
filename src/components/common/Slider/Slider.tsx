import React, { useId } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Museum } from "../../../api/museums";
import ChevronIcon from "../../icons/ChevronIcon";
import CollectionCard from '../CollectionCard'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
// import 'swiper/swiper-bundle.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import NFTCard from "../NFTCard";
export interface Collections {
    data: Museum[]
    isTicketCard?: boolean
}

function Slider({ data, isTicketCard }: Collections) {
    let id = useId()
    id = id.slice(1, id.length - 1)
    console.log(id)
    let n = data.length;
    console.log(data);
    return (
        <div className="w-full relative">
            <div className="flex justify-center items-center self-center">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={12}
                    slidesPerView={3}
                    // watchSlidesVisibility={true}
                    navigation={{ nextEl: `.arrow-right-${id}`, prevEl: `.arrow-left-${id}` }}
                // pagination={{clickable: true}}
                >
                    {
                        data.map((item, index) => (
                            <SwiperSlide key={index}>
                                <CollectionCard
                                    publicKey={item.publicKey}
                                    museum={item}
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
            <button className={`arrow-left-${id} arrow left-[-50px] absolute inset-y-2/4 p-3 rounded-lg border border-amber-300 h-max hover:text-white hover:cursor-pointer bg-amber-100 hover:bg-amber-400`}>
                <ChevronIcon
                    size={4}
                    customClassName="-rotate-90"
                />
            </button>
            <button className={`arrow-right-${id} arrow right-[-50px] absolute inset-y-2/4 z-10 p-3 rounded-lg border border-amber-300 h-max hover:text-white hover:cursor-pointer bg-amber-100 hover:bg-amber-400`}>
                <ChevronIcon
                    size={4}
                    customClassName="rotate-90"
                />
            </button>
        </div>
    )
}

export default Slider;