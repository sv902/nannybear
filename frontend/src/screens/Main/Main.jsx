import React from "react";
// import { BodyHyperlink } from "../../components/BodyHyperlink/BodyHyperlink.jsx";
// import { FormButton } from "../../components/FormButton/FormButton.jsx";
import { Header } from "../../components/Header/Header.jsx";
import { Hyperlink } from "../../components/Hyperlink/Hyperlink.jsx";
import { Marketing } from "../../components/Marketing/Marketing.jsx";
import { MsgCard } from "../../components/MsgCard/MsgCard.jsx";
import { PropertyDefault } from "../../components/PropertyDefault/PropertyDefault.jsx";
import { StatCard } from "../../components/StatCard/StatCard.jsx";
import { TypeCard } from "../../components/TypeCard/TypeCard.jsx";
import { RoundAnimate } from "../../icons/RoundAnimate/RoundAnimate.jsx";
import "./style.css";

import Footer from "../../components/Footer/Footer.jsx";

export const Main = () => {
  return (
    <div className="main">
      <div className="div-2">
        <div className="overlap">
          <StatCard className="stat-card-instance" />
          <StatCard className="design-component-instance-node" />
        </div>

        <div className="overlap-2">
          <div className="rectangle-5" />

          <p className="text-wrapper-14">
            РЕАЛЬНІ ІСТОРІЇ БАТЬКІВ, ЯКІ ВЖЕ ЗНАЙШЛИ ІДЕАЛЬНУ НЯНЮ.
          </p>

          <img
            className="screenshot-2"
            alt="Screenshot"
            src="/assets/Screenshot.png"
          />

          <div className="text-wrapper-15">ВІДГУКИ</div>

          <div className="rectangle-6" />

          <div className="text-wrapper-16">НАВЕДМІДЬ НА ПОВІДОМЛЕННЯ!</div>

          <MsgCard className="msg-card-1" property1="default" />
          <MsgCard className="msg-card-2" property1="default" />
          <MsgCard className="msg-card-3" property1="default" />
          <MsgCard className="msg-card-4" property1="default" />
          <MsgCard className="msg-card-5" property1="default" />
        </div>

        <div className="overlap-3">
          <div className="overlap-4">
            <img
              className="pexels-arina default-img"
              alt="Pexels arina"
              src="/assets/pexels-arina-krasnikova.png"
            />
            <img
              className="pexels-arina ipad-img"
              alt="iPad"
              src="/assets/pexels-arina-ipad.png"
            />

            <div className="overlap-5">
              <div className="slogan">
                <div className="overlap-6">
                  <div className="ellipse" />

                  <div className="ellipse-2" />

                  <div className="rectangle-7" />

                  <p className="text-wrapper-17">
                    ПРОСТО, ШВИДКО <br />
                    ТА БЕЗ ЗАЙВИХ ЗУСИЛЬ ЗНАЙДІТЬ НЯНЮ ДЛЯ ДИТИНИ. ВЕЛИКИЙ ВИБІР
                    КАНДИДАТІВ З ДЕТАЛЬНИМИ РЕЗЮМЕ <br />
                    ТА ВІДГУКАМИ.
                  </p>
                  <img className="mobile-image" src="/assets/bear-phone.png" alt="Mobile visual"/>
                </div>

                <div className="overlap-7">
                  <div className="rectangle-8" />

                  <div className="rectangle-9" />

                  <img
                    className="vector"
                    alt="Vector"
                    src="/assets/vector.svg"
                  />

                  <img
                    className="vector-2"
                    alt="Vector"
                    src="/assets/vector-1.svg"
                  />
                </div>
              </div>

              <RoundAnimate className="round-animate" />
            </div>

            <div className="text-wrapper-18">ПРО НАС</div>
          </div>

          <p className="nanny-bear-2">
            Nanny Bear – ваш простий і зручний спосіб знайти ідеальну няню!
            <br />
            <br />
            Переглядайте перевірені анкети, обирайте фахівця за відгуками та
            досвідом, та бронюйте послуги за кілька кліків. Гнучкий графік, швидкий пошук і лише перевірені
            няні – усе для вашого спокою та комфорту дитини!
            <br />
            <br />
            Знайдіть свою няню вже зараз!
          </p>

          <div className="overlap-8">
            <PropertyDefault className="design-component-instance-node" /> {/*second button*/ }
          </div>
        </div>

        <div className="overlap-9">
          <div className="baner">
            <div className="overlap-group-4">
              <div className="ellipse-3" />

              <div className="ellipse-4" />

              <p className="text-wrapper-20">
                Легкий та надійний спосіб знайти няню, <br />
                яка ідеально підходить вашій родині.
              </p>

              <div className="text-wrapper-21">ЛЮБОВ</div>

              <div className="text-wrapper-22" style={{ fontFamily: 'Princess Diana, sans-serif' }}>&amp;</div>

              <div className="text-wrapper-23">
                ТУРБОТА
                <br />
                БЕЗПЕКА
              </div>
              
              <img src="/assets/frame.png" alt="Banner Text" className="banner-text" />

              <PropertyDefault className="cta-button" /> {/* first button  */}
            </div>
          </div>

          <img
            className="ph"
            alt="Ph"
            src="/assets/ph1.png"
          />
        </div>

        <div className="instagram">НАШ INSTAGRAM</div>

        <section id="nanny-types">
          <div className="text-wrapper-24">ВИДИ НЯНЬ</div>
        </section>

        <p className="text-wrapper-25">
          ДІЗНАЙТЕСЬ, ЯКА НЯНЯ НАЙКРАЩЕ ПІДХОДИТЬ ДЛЯ ВАШОЇ РОДИНИ.
        </p>

        <div className="element-2">ЩЕ 10 ВИДІВ НЯНЬ...</div>

        <img
          className="rectangle-10"
          alt="Rectangle"
          src="/assets/rectangle-120.svg"
        />

        <img
          className="rectangle-11"
          alt="Rectangle"
          src="/assets/rectangle-121.svg"
        />

        <img
          className="rectangle-12"
          alt="Rectangle"
          src="/assets/rectangle-122.svg"
        />

        <img
          className="rectangle-13"
          alt="Rectangle"
          src="/assets/rectangle-123.svg"
        />

        {/* <div className="overlap-10">
          <div className="rectangle-14" />

          <div className="overlap-wrapper">
            <div className="overlap-11">
              <img
                className="vector-3"
                alt="Vector"
                src="/assets/vector-2.svg"
              />

              <img
                className="vector-4"
                alt="Vector"
                src="/assets/vector-3.svg"
              />

              <img
                className="group-2"
                alt="Group"
                src="/assets/group@2x.png"
              />

              <img
                className="vector-5"
                alt="Vector"
                src="/assets/vector-4.svg"
              />

              <img
                className="vector-6"
                alt="Vector"
                src="/assets/vector-5.svg"
              />
            </div>
          </div>

          <div className="email">ПІДПИСКА НА EMAIL-РОЗСИЛКУ</div>

          <p className="text-wrapper-26">
            Ваш спокій – наш пріоритет! Нові няні, вигідні пропозиції та
            практичні поради!
          </p>

          <p className="text-wrapper-27">
            v. 1.1.1 © 2025 Nanny Bear. Всі права захищені
          </p>

          <div className="text-wrapper-28">ІНФОРМАЦІЯ</div>

          <div className="text-wrapper-29">КОРИСНЕ</div>

          <FormButton className="form-button-instance" />
          <BodyHyperlink className="body-hyperlink-instance" />
          <BodyHyperlink className="body-hyperlink-2" text="Сайт МОЗ" />
          <BodyHyperlink className="body-hyperlink-3" text="Служба підтримки" />
          <BodyHyperlink
            className="body-hyperlink-4"
            text="Політика конфіденційності"
          />
          <BodyHyperlink
            className="body-hyperlink-5"
            text="Політика допустимого використання"
          />
          <BodyHyperlink
            className="body-hyperlink-6"
            text={
              <>
                Загальні умови <br />
                та положення
              </>
            }
          />

          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <div className="icon-hover insta-icon-wrapper">
            <img src="/assets/insta-icon.png" alt="Instagram" className="insta-icon default" />
            <img src="/assets/insta-icon-hover.png" alt="Instagram Hover" className="insta-icon hover" />
          </div>
          </a>

          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
          <div className="icon-hover tiktok-icon-wrapper">
            <img src="/assets/tiktok-icon.png" alt="TikTok" className="tiktok-icon default" />
            <img src="/assets/tiktok-icon-hover.png" alt="TikTok Hover" className="tiktok-icon hover" />
          </div>
          </a>

          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <div className="icon-hover facebook-icon-wrapper">
            <img src="/assets/facebook-icon.png" alt="Facebook" className="facebook-icon default" />
            <img src="/assets/facebook-icon-hover.png" alt="Facebook Hover" className="facebook-icon hover" />
          </div>
          </a>

          <div className="group-wrapper">
            <div className="div-wrapper">
              <div className="logo-2">
                <img
                  className="ICON-2"
                  alt="Icon"
                  src="/assets/LogoNannyBearGrid.png"
                />

                
              </div>
            </div>
          </div>
        </div> */}
        <Footer/>

        <img
          className="arrow-3"
          alt="Arrow"
          src="/assets/arrow-4.svg"
        />

        <TypeCard className="type-card-instance" />
        <TypeCard
          className="type-card-2"
          text="НЯНЯ СУПРОВІД ЗА КОРДОН"
          text1={
            <>
              Допомога та підтримка дитини <br />
              під час подорожі.
            </>
          }
        />
        <TypeCard
          className="type-card-3"
          text="НЯНЯ З ПРОЖИВАННЯМ"
          text1="Щоденний догляд, розвиток, супровід дитини у комфортній атмосфері."
        />
        <TypeCard
          className="type-card-4"
          text="НЯНЯ ПОГОДИННО"
          text1="Приходить за потреби на декілька годин, коли батькам потрібно."
        />
        <TypeCard
          className="type-card-5"
          text="НЯНЯ З ПРОФЕСІЙНОЮ ОСВІТОЮ"
          text1={
            <>
              Догляд, розвиток і підтримка дітей <br />з особливими потребами.
            </>
          }
        />
        <TypeCard
          className="type-card-6"
          text="НЯНЯ-ДОМОГОСПОДАРКА"
          text1=" Поєднує догляд за дитиною з допомогою по дому."
        />
        <StatCard
          className="stat-card-2"
          text="НА ПЛАТФОРМІ"
          text1="2 356"
          text2="НЯНЬ"
        />
        <StatCard
          className="stat-card-3"
          text="ПРЯМО ЗАРАЗ"
          text1="423"
          text2="АКТИВНИХ БРОНЮВАНЬ"
        />
        <Hyperlink
          className="h-hyperlink-instance"
          divClassName="h3-hyperlink-instance"
          text="@NANNY_BEAR"
          to="https://www.instagram.com"
        />
        <PropertyDefault className="property-1-default" /> {/*third button*/}
        <Header
          className="header-instance"
          nannyBear="/assets/nanny-bear-1@2x.png"
          overlapGroupClassName="header-2"
        />
        <Marketing className="design-component-instance-node" />
      </div>
    </div>
  );
};
export default Main;