import React from "react";
import { Header } from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { Marketing } from "../../components/Marketing/Marketing.jsx";
import "./style.css";

const About = () => {
    return (
      <div className="about-page">
        <Marketing></Marketing>

        <Header></Header>

        <div className="about-info">
          <h1 className="text-header">ПРО НАС</h1>
          <br />
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
            <br />
            <br />
            Адреса офісу
            <br />
            01010, м. Київ, вул. Левандовська, 5, оф. 9
            <br />
            <br />
            Електрона пошта
            <br />
            nanny.bear@gmail.com
            <br />
            <br />
            Гаряча лінія
            <br />
            +38 (050) 310-44-10
            <br />
            +38 (050) 330-94-75
            <br />
            +38 (050) 382-62-46
          </p>
        </div>
        
        <Footer></Footer>
      </div>
    );
  };
  
  export default About;