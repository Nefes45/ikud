import React from "react";
import "../styles/Header.css";
import bayrakGif from "../img/bayrak.gif";
import kudiImage from "../img/log10.png";

const Header = () => {
  const handleBayrakClick = () => {
    window.location.href = "/admin"; // Bayrak tıklandığında /admin sayfasına yönlendirir
  };

  return (
    <div className="header-container">
      <img
        src={bayrakGif}
        alt="Bayrak"
        className="header-logo float-effect"
        onClick={handleBayrakClick}
      />
      <div className="header-content">
        <h1 className="header-title">
          İSTANBUL KUYUMCULAR DERNEĞİ
          <span className="underline active"></span>{" "}
          {/* Altındaki çizgiyi sürekli aktif hale getirir */}
        </h1>
      </div>
      <img
        src={kudiImage}
        alt="İKUD"
        className="header-logo kudi-logo float-effect"
      />
    </div>
  );
};

export default Header;
