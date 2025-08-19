"use client";

import CarouselSlide from "../Carousel/CarouselSlide";

interface BannerProps {
  title: string;
  isCarousel?: boolean;
}

export default function Banner({ title, isCarousel = false }: Readonly<BannerProps>) {
  if (isCarousel) {
    return (
      <CarouselSlide
        imageUrl={"/assets/images/slide1.svg"}
        slideIndex="0"
        isActive
      >
        <h1
          className="fw-bold text-center text-white"
        >
          {title}
        </h1>
        <div></div>
      </CarouselSlide>
    );
  }
  return (
    <div
      style={{
        backgroundImage: 'url(/assets/images/slide1.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '40px',
        borderRadius: '8px',
      }}
    >
      <h1 className="fw-bold text-center text-white" style={{ fontSize: '2.5rem', margin: 0 }}>{title}</h1>
    </div>
  );
}
