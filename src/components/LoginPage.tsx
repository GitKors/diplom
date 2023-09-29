import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/LoginPage.css';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router-dom';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigationFunction: NavigateFunction = useNavigate();
  const navigate = useNavigate();
  

  const authContext = useContext(AuthContext);


  if (!authContext) {
    throw new Error("AuthContext is not available");
  }

  const { dispatch } = useContext(AuthContext)!;

  const validatePhoneNumber = (login:string) => {
    const validPhoneNumber = /^((\+7|7|8)+([0-9]{10}))$/;
    return validPhoneNumber.test(login);
  };

  const validateLoginText = (login:string) => {
    // const validLogin = /^[a-zA-Z]{3,}([_ -]?[a-zA-Z0-9])*$/;
    const validLogin = /^[a-zA-Z0-9_-]+$/;
    return validLogin.test(login);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length === 0) {
      setPasswordError(true);
      setPasswordErrorMessage('Неправильный пароль');
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    let loginError = false;
    let loginErrorMessage = '';

    if (login.length === 0) {
      setLoginError(false);
      setLoginErrorMessage('');
    }

    if (login.length < 3) {
      loginError = true;
      loginErrorMessage = 'Логин должен быть больше трёх символов';
    } else if (!validatePhoneNumber(login) && !validateLoginText(login)) {
      loginError = true;
      loginErrorMessage = 'Введите корректные данные';
    }

    setLoginError(loginError);
    setLoginErrorMessage(loginErrorMessage);

    let passError = false;
    let passErrorMessage = '';
    if (!password) {
      passError = true;
      passErrorMessage = 'Неправильный пароль';
    }

    setPasswordError(passError);
    setPasswordErrorMessage(passErrorMessage);

    if (!loginError && password) {
      fetch('https://gateway.scan-interfax.ru/api/v1/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "login": login, 
          "password": password, 
        }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Authorization failed');
        }
        return response.json();
      })
      .then((data) => {
        if (data.accessToken && data.expire) {
          console.log('Token:', data.accessToken);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('expire', data.expire);
          localStorage.setItem('isAuthorized', 'true');
          console.log('Successful login. Setting isAuthorized to true.');

          dispatch({ type: 'LOGIN', payload: { userName: 'Алексей А.' } });

          navigate('/');
        } else {
          setApiError('Ошибка авторизации');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        setApiError('Ошибка сервера');
      })
      .finally(() => {
        setLoading(false); 
      });
    }
  }; 

  return (
    <div className="loginPage">
      {loading && <Loader />} 
      <div className="textAndImage">
        <h1>Для оформления подписки<br />на тариф, необходимо<br />авторизоваться.</h1>
        <img className='pic_main' src={process.env.PUBLIC_URL + '/log_pic.svg'} alt="picmain" />
      </div>

      <div className="loginContainer">
        <img className='pic_lock' src={process.env.PUBLIC_URL + '/lock.svg'} alt="lock" />
        <div className="tabs">
          <div className="tab active">Войти</div>
          <div className="tab">Зарегистрироваться</div>
        </div>
        <label>Логин или номер телефона:</label>
        <input
          type="text"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
            if (e.target.value.length === 0) {
              setLoginError(false);
              setLoginErrorMessage('');
            }
          }}
          style={{ borderColor: loginError ? 'red' : 'grey' }}
        />
        {loginError && <div style={{ color: 'red', position: 'relative', top: '-38px' }}>{loginErrorMessage}</div>}
        <label>Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          style={{ borderColor: passwordError ? 'red' : 'grey' }}
        />
        {passwordError && <div style={{ color: 'red', position: 'relative', top: '-38px' }}>{passwordErrorMessage}</div>}

        {apiError && <div style={{ color: 'red', position: 'relative', top: '-38px' }}>{apiError}</div>}

        <button
          onClick={handleLogin}
          disabled={!login || !password}
          style={{
            backgroundColor: login && password ? 'rgba(89, 112, 255, 1)' : 'rgba(89, 112, 255, 0.5)',
            cursor: login && password ? 'pointer' : 'not-allowed'
          }}
        >
          Войти
        </button>
        <a href="#" className="forgotPassword">Восстановить пароль</a>
        <div className="socialLogin">
          <label>Войти через:</label>
          <div className='container-soc'>
            <a href="">
              <img className='google' src={process.env.PUBLIC_URL + '/google.svg'} alt="google" />
            </a>
            <a href="">
              <img className='yandex' src={process.env.PUBLIC_URL + '/yandex.svg'} alt="yandex" />
            </a>
            <a href="">
              <img className='facebook' src={process.env.PUBLIC_URL + '/facebook.svg'} alt="facebook" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
