import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Header.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  useEffect(() => {
    // Проверка, есть ли данные об авторизации в localStorage
    const storedAccessToken = localStorage.getItem('accessToken');
    console.log('Stored accessToken:', storedAccessToken);

    if (storedAccessToken) {
      // Установка начального состояния контекста, если пользователь авторизован
      authContext?.dispatch({ type: 'SET_AUTHORIZED', payload: true });
    }
  }, [authContext]);

  useEffect(() => {
    if (authContext?.state.isAuthorized) {
      authContext.dispatch({ type: 'START_LOADING' });

      fetch('https://gateway.scan-interfax.ru/api/v1/account/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch company info');
          }
          return response.json();
        })
        .then((data) => {
          authContext.dispatch({ type: 'SET_COMPANY_INFO', payload: data.eventFiltersInfo }); 
          authContext.dispatch({ type: 'END_LOADING' });
        })
        .catch((error) => {
          console.error(error);
          authContext.dispatch({ type: 'END_LOADING' });
        });
    }
  }, [authContext?.state.isAuthorized]); 

  const handleLogout = () => {
    authContext?.dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const handleBurgerMenuClick = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
    console.log(`КЛИК - ${!isBurgerMenuOpen}`)
  };

  const handleMenuItemClick = () => {
    setIsBurgerMenuOpen(false);
  };

  const handleLoginClick = () => {
    // Закрыть бургер-меню
    setIsBurgerMenuOpen(false);
  };

  return (
    <div className='header'>
      <Link to="/">
        <img className='main-logo' src={process.env.PUBLIC_URL + '/logo.svg'} alt="logo" />
      </Link>
      <div className='burger-menu-icon' onClick={handleBurgerMenuClick}>
          {!isBurgerMenuOpen ? (
            <>
              <div className='burger-menu-icon-line'></div>
              <div className='burger-menu-icon-line'></div>
              <div className='burger-menu-icon-line'></div>
            </>
          ) : null}
      </div>

      <div className='nav__header'>
        <Link to="/">Главная</Link>
        <Link to="/tariffs">Тарифы</Link>
        <Link to="/faq">FAQ</Link>
      </div>
      {isBurgerMenuOpen && (
        <div className='burger-menu'>
          <div className='head_menu'>
            <div>
              <Link to="/">
                <img className='logo_mobole' src={process.env.PUBLIC_URL + '/logo_adaptiv.svg'} alt="logo_mobile" />
              </Link>
            </div>
            <div className='close-button' onClick={handleBurgerMenuClick}>
              <img className='close_mobile' src={process.env.PUBLIC_URL + '/close.svg'} alt="close" />
            </div>

          </div>
          <div className='burger-menu-content'>
            <Link to="/" onClick={handleMenuItemClick}>Главная</Link>
            <Link to="/tariffs" onClick={handleMenuItemClick}>Тарифы</Link>
            <Link to="/faq" onClick={handleMenuItemClick}>FAQ</Link>            
          </div>
          <div className='foo_menu'>
            <a href="" id='no-link'>Зарегистрироваться</a>
            <Link to="/login"> 
              <button id='log__butt-adaptiv' onClick={handleLoginClick}>Войти</button>
            </Link>
          </div>

        </div>
      )}
      <div className={`account-panel ${authContext?.state.isAuthorized ? 'authorized' : ''}`}>
        {authContext?.state.isAuthorized ? (
          <>
            <div className='avatar'>
              <img className='ava' src={process.env.PUBLIC_URL + '/ava.svg'} alt="avatar" />
              <span className='user_name'>Алексей А.</span>
              <button className='logout__button' onClick={handleLogout}>
                Выйти
              </button>
            </div>
            <div className='account-info'>
              {authContext?.state.companyInfo ? (
                <>
                  <span className='account-panel-text'>
                    Лимит по компаниям{' '}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: 'rgba(0, 0, 0, 1)' }}>
                      {authContext?.state.companyInfo.companyLimit}
                    </span>
                  </span>
                  <span className='account-panel-text'>
                    Использовано компаний{' '}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: 'rgba(138, 197, 64, 1)' }}>
                      {authContext?.state.companyInfo.usedCompanyCount}
                    </span>
                  </span>
                </>
              ) : (
                <span className='loading-indicator'></span>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/register">Зарегистрироваться</Link>
            <span className='account-panel-divider'>
              <img src={process.env.PUBLIC_URL + '/rec.svg'} alt="vertical line" />
            </span>
            <Link to="/login">
              <button className='login__button'>Войти</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
