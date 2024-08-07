import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Footer.css';

const Footer = ({ symbols }) => {
  const [footerData, setFooterData] = useState({
    ons: { value: 0, direction: null },
    usd: { value: 0, direction: null },
    euro: { value: 0, direction: null },
    parite: { value: 0, direction: null },
    has: { value: 0, direction: null }
  });

  const roundToNearestTenth = (number) => {
    return Math.ceil(number * 10) / 10;
  };

  const createNewData = useCallback((newValue, oldValue) => {
    const roundedValue = roundToNearestTenth(newValue);
    let direction = null;
    if (roundedValue > oldValue) {
      direction = 'up';
    } else if (roundedValue < oldValue) {
      direction = 'down';
    }
    return { value: roundedValue, direction };
  }, []);

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://152.89.36.148:24876');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket data received:', data); // Debug log
          if (symbols && symbols.length > 0) {
            const filteredData = data.filter(item => symbols.includes(item.Code));
            const newFooterData = {};
            filteredData.forEach(item => {
              if (item.Code === 'ONS') {
                newFooterData.ons = createNewData(item.Bid, footerData.ons.value);
              }
              if (item.Code === 'USDTRY') {
                newFooterData.usd = createNewData(item.Bid, footerData.usd.value);
              }
              if (item.Code === 'EURTRY') {
                newFooterData.euro = createNewData(item.Bid, footerData.euro.value);
              }
              if (item.Code === 'EURUSD') {
                newFooterData.parite = createNewData(item.Bid, footerData.parite.value);
              }
              if (item.Code === 'HAS') {
                newFooterData.has = createNewData(item.Bid, footerData.has.value);
              }
            });
            setFooterData(prevState => ({
              ...prevState,
              ...newFooterData
            }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        setTimeout(connectWebSocket, 30000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols, footerData, createNewData]);

  const getDirectionClass = (direction) => {
    if (direction === 'up') return 'up';
    if (direction === 'down') return 'down';
    return '';
  };

  return (
    <div className="footer-container">
      <div className="row">
        <div className="col-sm p3">ONS <span className={getDirectionClass(footerData.ons.direction)}>{footerData.ons.value.toFixed(2)}</span></div>
        <div className="col-sm p3">USD <span className={getDirectionClass(footerData.usd.direction)}>{footerData.usd.value.toFixed(2)}</span></div>
        <div className="col-sm p3">EURO <span className={getDirectionClass(footerData.euro.direction)}>{footerData.euro.value.toFixed(2)}</span></div>
        <div className="col-sm p3">€/$ <span className={getDirectionClass(footerData.parite.direction)}>{footerData.parite.value.toFixed(2)}</span></div>
        <div className="col-sm p3">HAS <span className={getDirectionClass(footerData.has.direction)}>{footerData.has.value.toFixed(2)}</span></div>
      </div>
      <div className="row footer d-flex align-items-center justify-content-center">
        <div className="col-sm p4 text-end footer-text" style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "15px" }}></div>
      </div>
    </div>
  );
};

export default Footer;
 