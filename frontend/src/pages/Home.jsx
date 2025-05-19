import React, { useEffect, useState } from "react";
import { MsgCard } from "../components/MsgCard/MsgCard.jsx";
import { StatCard } from "../components/StatCard/StatCard.jsx";
import { TypeCard } from "../components/TypeCard/TypeCard.jsx";
import { RoundAnimate } from "../icons/RoundAnimate/RoundAnimate.jsx";
import BearHead from "../components/BearHead/BearHead.jsx";
import FindNannyButton from "../components/PrimaryButton/FindNannyButton.jsx";
import "../styles/styleHome.css";
import { Marketing } from "../components/Marketing/Marketing.jsx";
import DynamicHeader from "../components/Header/DynamicHeader.jsx";

import Footer from "../components/Footer/Footer.jsx";


export const Home = () => {
    const [userType, setUserType] = useState("guest");
  const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const storedRole = localStorage.getItem("userRole") || "guest";
  setUserType(storedRole);
  setLoaded(true);
}, []);
const id = localStorage.getItem("nannyProfileId");

  return (
    <div className="main">
      <div className="div-2">
        <Marketing />
        {loaded && <DynamicHeader role={userType} />}

         <div className="home-section overlap-9">
          <div className="baner">    

            <svg className="baner-arcs" viewBox="0 0 3700 3000" xmlns="http://www.w3.org/2000/svg">
            {/* Перша дуга — вигнута вправо */}
            <path
                d="M 0 2300 A 2500 2500 0 0 0 2500 0"
                stroke="#fffaee"
                strokeWidth="6"
                fill="none"
            />
            {/* Друга дуга — паралельно, трохи більша */}
            <path
                d="M -300 1500 A 2200 2200 1 0 0 1600 -200"
                stroke="#fffaee"
                strokeWidth="6"
                fill="none"
            />
            </svg>

        <div className="baner-content">
            <div className="baner-title-wrapper">
            <h1 className="baner-title">
                ЛЮБОВ<br />   
            </h1>
            <br/>
            <h1 className="baner-title-2"> ТУРБОТА<br />
                БЕЗПЕКА</h1>
            <span className="baner-title-and">&</span>
            </div>
                <p className="baner-subtitle">
                Легкий та надійний спосіб знайти няню, <br />
                яка ідеально підходить вашій родині.
                </p>
                  {loaded && <FindNannyButton role={userType} id={id} />}
                </div>           
           <img className="baner-photo" src="/assets/ph1.png" alt="Мама з дитиною" />
         </div>
        </div>

        <div className="home-section overlap-5">
        <div className="bear-section-wrapper">
            <BearHead />
            <RoundAnimate className="round-animate" />
        </div>
        </div>

         <div className="home-section about-section">
            <div className="about-content">
                <div className="about-image-wrapper">
                <img
                    className="pexels-arina"
                    alt="Pexels arina"
                    src="/assets/pexels-arina-krasnikova.png"
                />
                </div>
                <div className="about-text-home">
                <h2 className="about-title-home">ПРО НАС</h2>
                <p className="about-description-home">
                    Nanny Bear – ваш простий і зручний спосіб <br/>знайти ідеальну няню!
                    <br />
                    <br />
                    Переглядайте перевірені анкети, обирайте фахівця за відгуками та
                    досвідом, та бронюйте послуги за кілька кліків. Гнучкий графік, швидкий
                    пошук і лише перевірені няні – усе для вашого спокою та комфорту дитини!
                    <br />
                    <br />
                    Знайдіть свою няню вже зараз!
                </p>
                <div className="about-button">
                     {loaded && <FindNannyButton role={userType} id={id} />}
                </div>
                </div>
            </div>
            </div>

            <div className="home-section">
            <div className="stat-card-wrapper">               
                <StatCard
                className="stat-card-2"
                text="НА ПЛАТФОРМІ"
                text1="2 356"
                text2="НЯНЬ"
                />
                 <StatCard className="design-component-instance-node" />
                <StatCard
                className="stat-card-3"
                text="ПРЯМО ЗАРАЗ"
                text1="423"
                text2="АКТИВНИХ БРОНЮВАНЬ"
                />
            </div>
            </div>

            <div className="home-section">
            <section id="nanny-types">
                <h1 className="title-home">ВИДИ НЯНЬ</h1>
            </section>

            <p className="text-home">
                ДІЗНАЙТЕСЬ, ЯКА НЯНЯ НАЙКРАЩЕ ПІДХОДИТЬ ДЛЯ ВАШОЇ РОДИНИ.
            </p>  
            <div className="typecard-wrapper">
                <TypeCard 
                    className="type-card-instance" 
                    image="/assets/ILLUSTRATION-03.svg"
                />
                <TypeCard 
                    className="type-card-2" 
                    text="НЯНЯ СУПРОВІД ЗА КОРДОН" 
                    text1={<>Допомога та підтримка дитини <br /> під час подорожі.</>} 
                    image="/assets/ILLUSTRATION-02.svg"
                />
                <TypeCard 
                    className="type-card-3" 
                    text="НЯНЯ З ПРОЖИВАННЯМ" 
                    text1="Щоденний догляд, розвиток, супровід дитини у комфортній атмосфері." 
                    image="/assets/ILLUSTRATION-04.svg"
                />
                <TypeCard 
                    className="type-card-2" 
                    text="НЯНЯ ПОГОДИННО" 
                    text1="Приходить за потреби на декілька годин, коли батькам потрібно." 
                    image="/assets/ILLUSTRATION-08.svg"
                />
                <TypeCard 
                    className="type-card-5" 
                    text="НЯНЯ З ПРОФЕСІЙНОЮ ОСВІТОЮ" 
                    text1={<>Догляд, розвиток і підтримка дітей <br /> з особливими потребами.</>} 
                    image="/assets/ILLUSTRATION-06.svg"
                />
                <TypeCard 
                    className="type-card-2" 
                    text="НЯНЯ-ДОМОГОСПОДАРКА" 
                    text1="Поєднує догляд за дитиною з допомогою по дому." 
                     image="/assets/ILLUSTRATION-07.svg"
                />
            </div>
            <p className="text-home">ЩЕ 10 ВИДІВ НЯНЬ...</p>
            <div className="btn-cont-home">
                 {loaded && <FindNannyButton role={userType} id={id} />}
            </div>  
            </div>
       
            <div className="home-section reviews-section-home">
            <h1 className="title-home">ВІДГУКИ</h1>
            <p className="text-home">
                РЕАЛЬНІ ІСТОРІЇ БАТЬКІВ, ЯКІ ВЖЕ ЗНАЙШЛИ ІДЕАЛЬНУ НЯНЮ.
            </p>

            <div className="box-text-container">
                    <p className="box-text">НАВЕДМІДЬ НА ПОВІДОМЛЕННЯ!</p></div>
            
            <div className="review-overlay-container">
                {/* <img
                src="/assets/AnimalsReviews.svg"
                alt="Ілюстрація відгуків"
                className="review-bear-image"
                /> */}
               
            <div className="msgcard-wrapper position-1">
            <MsgCard property1="default" />
            </div>

                <div className="msgcard-wrapper position-2">
            <MsgCard property1="default" />
            </div>

            <div className="msgcard-wrapper position-3">
            <MsgCard property1="default" />
            </div>
            <div className="msgcard-wrapper position-4">
            <MsgCard property1="default" />
            </div>

            <div className="msgcard-wrapper position-5">
            <MsgCard property1="default" />
            </div>

            </div>
            </div>
       
            <div className="home-section">
            <div className="instagram-header">
                <h1 className="title-home-instagram">НАШ INSTAGRAM</h1>

                <a
                className="instagram-link-wrapper"
                href="https://www.instagram.com/nanny_bear"
                target="_blank"
                rel="noopener noreferrer"
                >
                <div className="hover-group">
                    <div className="hyperlink-text">@NANNY_BEAR</div>
                    <img className="arrow-3-inst" src="/assets/arrow-4.svg" alt="Arrow" />
                </div>
                </a>
            </div>

            <div className="nanny-icons-container">
            <div className="nanny-icons">
                <img className="rectangle-10" src="/assets/rectangle-120.svg" alt="Icon 1" />
                <img className="rectangle-11" src="/assets/rectangle-121.svg" alt="Icon 2" />
                <img className="rectangle-12" src="/assets/rectangle-122.svg" alt="Icon 3" />
                <img className="rectangle-13" src="/assets/rectangle-123.svg" alt="Icon 4" />
            </div>
            </div>
            </div>
       
              <Footer/>
      </div>
    </div>
  );
};
export default Home;