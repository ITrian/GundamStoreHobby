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
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            <SwiperSlide><img src="https://bizweb.dktcdn.net/100/535/699/themes/1008357/assets/home_slider_1.jpg?1747962909005" alt="Banner 1" className="banner-img" /></SwiperSlide>
            <SwiperSlide><img src="https://bizweb.dktcdn.net/100/535/699/themes/1008357/assets/home_side_banner_3.jpg?1747962909005" alt="Banner 2" className="banner-img" /></SwiperSlide>
          </Swiper>
        </div>
        <div className="sub-banners">
          <img src="https://placehold.co/600x190/000/FFF?text=BLACK+FRIDAY" alt="Sub Banner 1" className="banner-img" />
          <img src="https://placehold.co/600x190/8b0000/FFF?text=VOUCHER+30K" alt="Sub Banner 2" className="banner-img" />
          <img src="https://placehold.co/600x190/333/FFF?text=PRE-ORDER" alt="Sub Banner 3" className="banner-img" />
        </div>
      </div>

      <div style={{ backgroundColor: '#fff' }}>
        <ProductSection />
      </div>
    </ClientLayout>
  );
};

export default HomePage;