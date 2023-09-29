import React from 'react';
import '../styles/Footer.css'



const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className='footer-container'>
                <div className='logo-foo__illustration'>
                    <img className='logo-foo__illustration' src={process.env.PUBLIC_URL + '/logo_footer.svg'} alt="logo_footer" />
                </div>
                <div className='item-footer'>
                    <p>г. Москва, Цветной б-р, 40</p>
                    <p>+7 495 771 21 11</p>
                    <p>info@skan.ru</p>
                    <p className='copyrat'>Copyright. 2022</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


