import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import FeaturedSkeleton from "../ui/FeaturedSkeleton";

import "swiper/css";
import "swiper/css/pagination";
import "../../styles/swiper.css";

import FeaturedCard from "./FeaturedCard";
import useFeatured from "../../hooks/useFeatured";

export default function FeaturedCarousel() {

  const { featured, loading, error } = useFeatured();

  if (loading) {
    return <FeaturedSkeleton />;
  }

  if (error) {
    return (
      <div className="h-64 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (

    <div className="mb-1">

      <Swiper
  modules={[Autoplay, Pagination]}
  spaceBetween={20}
  slidesPerView={1}
  centeredSlides={true}
  loop={true}
  grabCursor={true}
  speed={700}
  autoplay={{
    delay: 4500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  pagination={{
    clickable: true,
  }}
>
  {featured.map((item) => (
    <SwiperSlide key={item.id}>
      <FeaturedCard {...item} />
    </SwiperSlide>
  ))}
</Swiper>
    </div>
  );
}