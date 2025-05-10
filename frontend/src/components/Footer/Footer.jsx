import React from "react";
import { BodyHyperlink } from "../BodyHyperlink/BodyHyperlink.jsx";
import { InstaIcon } from "../../icons/InstaIcon/InstaIcon.jsx";
import { FormButton } from "../../components/FormButton/FormButton.jsx";
import { Property1Default } from "../../icons/Property1Default/Property1Default.jsx";
import { Property1Default1 } from "../../icons/Property1Default1/Property1Default1.jsx";
import "./footer.css"; 
import bear from "../../assets/bear-light.png";


const Footer = () => {

  return (
    <div className="footer">
      <div className="footer-content"> 
         {/* Перший стовпець */}
        <div className="footer-column">
        <div className="footer-title">ПІДПИСКА НА EMAIL-РОЗСИЛКУ</div>

            <p className="footer-text-wrapper-26">
            Ваш спокій – наш пріоритет! Нові няні, вигідні пропозиції та
            практичні поради!
            </p>

            <FormButton className="footer-form-button-instance" />

            {/* Логотип */}
            <div className="footer-logo-2">
            <img
                className="footer-ICON-2"
                alt="Icon"
                src="/assets/LogoNannyBearGrid.png"
            />
            </div>

            {/* Соціальні іконки */}
            <div className="footer-social-icons">
            <InstaIcon className="footer-insta-icon" color="#FFFAEE" />
            <Property1Default1 className="footer-tiktok-icon" color="#FFFAEE" />
            <Property1Default className="footer-facebook-icon" color="#FFFAEE" />
            </div>
        </div>

        

        {/* Другий стовпець */}
        <div className="footer-column">
          <div className="footer-text-wrapper-28">ІНФОРМАЦІЯ</div> 
          <BodyHyperlink 
            className="footer-body-hyperlink-instance" 
            text="Дисклеймер" 
            to="/disclaimer"  
          /> 
          <BodyHyperlink
            className="footer-body-hyperlink-6"
            text="Загальні умови та положення"
            to="/terms"
          />
          <BodyHyperlink
            className="footer-body-hyperlink-4"
            text="Політика конфіденційності"
            to="/privacy"
          />
          <BodyHyperlink
            className="footer-body-hyperlink-5"
            text="Політика допустимого використання"
            to="/acceptable-use"
          />

          
          <p className="footer-text-wrapper-27">v. 1.1.1 © 2025 Nanny Bear. Всі права захищені</p>
        </div>

        {/* Третій стовпець */}
        <div className="footer-column">          
          <div className="footer-text-wrapper-29">КОРИСНЕ</div>
          <BodyHyperlink
            className="footer-body-hyperlink-2"
            text="Сайт МОЗ"
            to="https://moz.gov.ua/"
            external={true}
          />
          <BodyHyperlink
            className="footer-body-hyperlink-3"
            text="Служба підтримки"
            to="/support"
          />
       
           {/* Зображення ведмедика */}
            <div className="bear-wrapper">
                <img
                className="bear-ligth"
                alt="Bear-ligth"
                src={bear} 
                />
            </div>
        </div>  
       
      </div>
    </div>
  );
};

export default Footer;
