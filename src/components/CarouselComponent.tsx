import React, { useState } from 'react';
import styles from '../styles/Carousel.module.css'



interface CarouselProps {
  cardsContent: { title: string; content: string; footer: string }[];
  isLoading: boolean;
}


const CarouselComponent: React.FC<CarouselProps> = ({ cardsContent, isLoading }) => {
  const totalSlides = cardsContent.length;
  const [currentSlide, setCurrentSlide] = useState(totalSlides);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);


  const goToLeftSlide = () => {
    if (currentSlide === 0) {
      setIsTransitionEnabled(false);
      setCurrentSlide(totalSlides * 2);
      setTimeout(() => {
        setIsTransitionEnabled(true);
      }, 0);
    } else {
      setCurrentSlide((prev) => prev - 1);
    }
  };
  
  const goToRightSlide = () => {
    if (currentSlide === totalSlides * 2) {
      setIsTransitionEnabled(false);
      setCurrentSlide(totalSlides);
      setTimeout(() => {
        setIsTransitionEnabled(true);
      }, 0);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const clonedCardsContent = [...cardsContent, ...cardsContent, ...cardsContent];
  console.log('isLoadingCarousel:', isLoading);

  const slideWidth = window.innerWidth <= 375 ? 298 : 148;

  return (
    <>
      <div className={styles.outerContainer}>
        <div className={`${styles.arrow} ${styles.arrowLeft}`} onClick={goToLeftSlide}>
          <span>
            <img src={process.env.PUBLIC_URL + '/left_butt.svg'} alt="arrow-left" />
          </span>
        </div>
        <div className={styles.navBar}>
          <span>Период</span>
          <span>Всего</span>
          <span>Риски</span>
        </div>

          <div className={styles.container}>
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                      <div className={`${styles.loader} custom-loader`}></div>
                      <p className={styles.loadText}>Загружаем данные</p> 
                    </div>
                  ) : (
            <div
              className={styles.wrap}
              style={{
                transform: `translateX(-${currentSlide * slideWidth}px)`,
                transition: isTransitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
              }}
            >
              {clonedCardsContent.map((card, index) => (
                <div className={styles.slide} key={index}>
                  <div className={styles.header}>{card.title}</div>
                  <div className={styles.main}>{card.content}</div>
                  <div className={styles.footer}>{card.footer}</div>
                </div>
              ))}
            </div>
                    )}
          </div>

        <div className={`${styles.arrow} ${styles.arrowRight} custom-class-arrow`} onClick={goToRightSlide}>
          <span>
            <img src={process.env.PUBLIC_URL + '/right_butt.svg'} alt="arrow-right" />
          </span>
        </div>
      </div>
    </>
  );
};




export default CarouselComponent;
