import React, { useState, useEffect } from 'react';
import '../styles/Main.css';
import { Link } from 'react-router-dom';



const Main: React.FC = () => {
    const [currentCard, setCurrentCard] = useState(0);
    const cardsContent = [
        {
            title: "Высокая и оперативная скорость обработки заявки",
            imageUrl: process.env.PUBLIC_URL + "/pic_card1.svg"
        },
        {
            title: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
            imageUrl: process.env.PUBLIC_URL + "/pic_card2.svg"
        },
        {
            title: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
            imageUrl: process.env.PUBLIC_URL + "/pic_card3.svg"
        },
        {
            title: "Высокая и оперативная скорость обработки заявки",
            imageUrl: process.env.PUBLIC_URL + "/pic_card1.svg"
        },
        {
            title: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
            imageUrl: process.env.PUBLIC_URL + "/pic_card2.svg"
        },
        {
            title: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
            imageUrl: process.env.PUBLIC_URL + "/pic_card3.svg"
        },
    ];

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 376);
    useEffect(() => {

      const handleResize = () => {
        setIsMobile(window.innerWidth <= 376);
      };
  

      window.addEventListener('resize', handleResize);
  

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  

    const handleMobileCardPrev = () => {
      setCurrentCard((prevCard) => prevCard > 0 ? prevCard - 1 : cardsContent.length - 1);
    };
  
    const handleMobileCardNext = () => {
      setCurrentCard((prevCard) => prevCard < cardsContent.length - 1 ? prevCard + 1 : 0);
    };
  
    return (
      <div className='main'>
        {/* first cont */}
        <div className='main-container'>
          <div className='main-container__title'>
            <h1 className='main-container__heading'>
              <span style={{ whiteSpace: 'nowrap' }}>сервис по поиску</span><br />
              публикаций<br />
              о компании<br />
              по его ИНН
            </h1>
            <p className='main-container__description'>Комплексный анализ публикаций, получение данных<br />
              в формате PDF на электронную почту.</p>
            <Link to="/searchform">
              <button className='main-container__button'>Запросить данные</button>
            </Link>
          </div>
          <div className='main-container__image'>
            <img className='main-container__illustration' src={process.env.PUBLIC_URL + '/title_pic.png'} alt="title_pic" />
          </div>
        </div>
        {/* sec cont */}
        <div className='secondary-container'>
          {isMobile ? (
            <h2 className='secondary-container__heading'>
              Почему<br />именно мы
            </h2>
          ) : (
            <h2 className='secondary-container__heading'>
              Почему именно мы
            </h2>
          )}
  
          {isMobile ? (
            

            <div className='carousel-container-mobile'>
              <button className='left_butt-mobile' onClick={handleMobileCardPrev}></button>
              <div className='carousel-cards-mobile'>
                <div className='card mobile-card'>
                <img
                    src={cardsContent[currentCard].imageUrl}
                    alt="Логотип"
                    className="card__logo mobile-card__image" 
                  />
                  <p className="card__text-mobile">{cardsContent[currentCard].title}</p>
                </div>
              </div>
              <button className='right_butt-mobile' onClick={handleMobileCardNext}></button>
            </div>

          ) : (
            
            <div className='carousel-container'>
              <button className='left_butt' onClick={() => setCurrentCard(currentCard > 0 ? currentCard - 1 : cardsContent.length - 3)}></button>
              <div className='carousel-cards'>
                {cardsContent.slice(currentCard, currentCard + 3).map((cardContent, index) => (
                  <div
                    key={index}
                    className={`card ${index === 1 ? 'middle-card' : ''}`}
                  >
                    <img src={cardContent.imageUrl} alt="Логотип" className="card__logo" />
                    <p className="card__text">{cardContent.title}</p>
                  </div>
                ))}
              </div>
              <button className='right_butt' onClick={() => setCurrentCard(currentCard < cardsContent.length - 3 ? currentCard + 1 : 0)}></button>
            </div>
          )}
        </div>
        {/* tert cont */}
        <div className='tertiary-container'>
          <img className='tertiary-container__illustration' src={process.env.PUBLIC_URL + '/user_checked.jpg'} alt="user_checked_pic" />
        </div>
            {/* quat cont */}
            <div className='quaternary-container'>
                <h2 className='quaternary-container__title'>наши тарифы</h2>
                <div className='quaternary-container__cards'>
                    <div className='tariff-card tariff-card--1'>
                        <div className='title__card1'>
                            <div className='title__card1__cont'>
                                <h3>Beginner</h3>
                                <h4>Для небольшого исследования</h4>
                            </div>
                            <div className='title__card2__cont'>
                                <img className='quaternary-container__lamp' src={process.env.PUBLIC_URL + '/lamp.png'} alt="lamp" />
                            </div>
                        </div>
                        <div className='price'>
                                <p className='current-price'>7999 ₽</p>
                                <p className='original-price'>1 200 ₽</p>
                                <div className="current-plan">
                                    <span className="current-plan-text">Текущий тариф</span>
                                </div>
                        </div>
                        <p className='price-desc'>или 150 ₽/мес. при рассрочке на 24 мес.</p>
                        <div className='tariff-description'>
                            <h4>В тариф входит:</h4>
                            <p>Безлимитная история запросов</p>
                            <p>Безопасная сделка</p>
                            <p>Поддержка 24/7</p>
                        </div>
                        <button className='butt_tarr_card'>Перейти в личный кабинет</button>
                    </div>
                    <div className='tariff-card tariff-card--2'>
                        <div className='title__card2'>
                            <div className='title__card2__cont'>
                                <h3>Pro</h3>
                                <h4>Для HR и фрилансеров</h4>
                            </div>
                            <div>
                                <img className='quaternary-container__target' src={process.env.PUBLIC_URL + '/target.png'} alt="target" />
                            </div>
                        </div>
                        <div className='price-card2'>
                                <p className='current-price'>1 299 ₽</p>
                                <p className='original-price'>2 600 ₽</p>
                        </div>
                        <p className='price-desc'>или 279 ₽/мес. при рассрочке на 24 мес.</p>
                        <div className='tariff-description'>
                            <h4>В тариф входит:</h4>
                            <p>Все пункты тарифа Beginner</p>
                            <p>Экспорт истории</p>
                            <p>Рекомендации по приоритетам</p>
                        </div>
                        <button className='butt_tarr_card'>Подробнее</button>
                    </div>
                    <div className='tariff-card tariff-card--3'>
                        <div className='title__card3'>
                            <div>
                                <h3>Business</h3>
                                <h4>Для корпоративных клиентов</h4>
                            </div>
                            <div>
                                <img className='quaternary-container__pc' src={process.env.PUBLIC_URL + '/pc.png'} alt="pc" />
                            </div>
                        </div>
                        <div className='price-card3'>
                                <p className='current-price'>2 379 ₽</p>
                                <p className='original-price'>3 700 ₽</p>
                        </div>
                        <div className='tariff-description'>
                            <h4>В тариф входит:</h4>
                            <p>Все пункты тарифа Pro</p>
                            <p>Безлимитное количество запросов</p>
                            <p>Приоритетная поддержка</p>
                        </div>
                            <button className='butt_tarr_card'>Подробнее</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Main;
