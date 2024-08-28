import React, { useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ onTogglePrices, onFreezePrices }) => {
  const [isStreamOn, setIsStreamOn] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  const handleTogglePrices = () => {
    setIsStreamOn(!isStreamOn);
    if (onTogglePrices) {
      onTogglePrices(!isStreamOn);
    }
  };

  const handleFreezePrices = () => {
    setIsFrozen(!isFrozen);
    if (onFreezePrices) {
      onFreezePrices(!isFrozen);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">İSTANBUL KUYUMCULAR DERNEĞİ</h2>
      <p className="dashboard-welcome">HOŞGELDİNİZ</p>
      <div className="button-group">
        <button className="dashboard-button" onClick={handleTogglePrices}>
          {isStreamOn ? 'Fiyat Akışını Durdur' : 'Fiyat Akışını Başlat'}
        </button>
        <button className="dashboard-button" onClick={handleFreezePrices}>
          {isFrozen ? 'Fiyatları Sabitlemeyi Kaldır' : 'Fiyatları Sabitle'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
