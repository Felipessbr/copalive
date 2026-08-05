import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import FeaturedCard from "./FeaturedCard";
import featuredNews from "../../data/featuredNews";

export default function FeaturedCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
    >
      {featuredNews.map((item) => (
        <SwiperSlide key={item.id}>
          <FeaturedCard
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            type={item.type}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}