import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductSection from '../../components/ProductSection/ProductSection';
import ClientLayout from '../../layouts/ClientLayout/ClientLayout';

const HomePage = () => {
  return (
    <ClientLayout>
      <div className="banner-section" style={{ backgroundColor: '#fff' }}>
        <div className="main-banner">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            <SwiperSlide><img src="https://placehold.co/1200x600/1a2b4c/FFF?text=BANNER+CHINH+1+-+GUNDAM" alt="Banner 1" className="banner-img" /></SwiperSlide>
            <SwiperSlide><img src="https://placehold.co/1200x600/8b0000/FFF?text=BANNER+CHINH+2+-+SALE" alt="Banner 2" className="banner-img" /></SwiperSlide>
          </Swiper>
        </div>
        <div className="sub-banners">
          <img src="https://placehold.co/600x190/000/FFF?text=BLACK+FRIDAY" alt="Sub Banner 1" className="banner-img" />
          <img src="https://placehold.co/600x190/8b0000/FFF?text=VOUCHER+30K" alt="Sub Banner 2" className="banner-img" />
          <img src="https://placehold.co/600x190/333/FFF?text=PRE-ORDER" alt="Sub Banner 3" className="banner-img" />
        </div>
      </div>

      {/* 5. KHU VỰC SẢN PHẨM */}
      <div style={{ backgroundColor: '#fff' }}>
        <ProductSection />
      </div>
    </ClientLayout>
  );
};

export default HomePage;