import React  from "react";
import { Link } from "react-router-dom";
import { Hyperlink } from "../Hyperlink/Hyperlink.jsx";
import { PrimaryButton } from "../PrimaryButton/PrimaryButton.jsx";
import { SecondaryButton } from "../SecondaryButton/SecondaryButton.jsx";
import "./header.css";

export const Header = () => {
  return (
    <header className="main-header">
      <Link to="/" className="logo-section">
        <img
          src="/assets/LogoNannyBear11.png"
          alt="Nanny Bear Logo"
          className="logo-img"
        />
      </Link>

      <nav className="nav-links">
        <Hyperlink className="nav-link" style={{ textDecoration: "none" }} text="ПРО НАС" to="/about" />
        <Hyperlink className="nav-link" text="ВИДИ НЯНЬ" to="/#nanny-types" />
        <Hyperlink className="nav-link" text="ВІДГУКИ" to="/about" />
      </nav>

      <div className="action-buttons">
        <SecondaryButton className="secondary-button" />
        <PrimaryButton className="primary-button" />
      </div>
    </header>
  );
};

export default Header;
