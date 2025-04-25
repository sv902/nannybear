import React from "react";
import { Link } from "react-router-dom";
import { Hyperlink } from "../Hyperlink/Hyperlink.jsx";
import { PrimaryButton } from "../PrimaryButton/PrimaryButton.jsx";
import { SecondaryButton } from "../SecondaryButton/SecondaryButton.jsx";
import "./style.css";

export const Header = ({ className, overlapGroupClassName }) => {
  return (
    <div className={`header ${className}`}>
      <div className={`overlap-group-3 ${overlapGroupClassName}`}>
        <div className="menu">
          <PrimaryButton className="primary-button-instance" />
          <SecondaryButton className="secondary-button-instance" />
          
          <div className="desktop-only">
            <Hyperlink className="h-hyperlink" text="ПРО НАС" to="/about" />
            <Hyperlink className="h3-hyperlink" text="ВИДИ НЯНЬ" to="/#nanny-types" />
            <Hyperlink className="hyperlink-instance" text="ВІДГУКИ" to="/about" />
          </div>
          
        </div>

        <Link className="logonannybear" to="/">
          <div className="logonannybeargrid">
            <div className="logo-wrapper">
              <div className="logo">
                <img
                  className="ICON"
                  alt="Icon"
                  src="/assets/LogoNannyBear11.png"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;