import React, { useState, useEffect, useContext } from "react";
import "../styles/PriceTable.css";
import Marquee from "./Marquee";
import Carousel from "./Carousel";
import { OperationsContext } from "../AdminPanel/context/OperationsContext";

const PriceTable = ({
  marqueeText,
  scrollAmount,
  symbols,
  show18Ayar,
  show14Ayar,
  isStreamOn,
  isFrozen,
}) => {
  const [prices, setPrices] = useState({});
  const { operations } = useContext(OperationsContext);

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      if (!isFrozen && isStreamOn) {
        ws = new WebSocket("ws://152.89.36.148:24876");

        ws.onopen = () => console.log("WebSocket bağlantısı açıldı");

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const filteredData = data.filter((item) =>
              symbols.includes(item.Code)
            );

            const newPrices = {};
            filteredData.forEach((item) => {
              if (
                item.Code === "UHAS" ||
                item.Code === "USDTRY" ||
                item.Code === "EURTRY"
              ) {
                newPrices[item.Code] = {
                  Bid: parseFloat(item.Bid) || 0,
                  Ask: parseFloat(item.Ask) || 0,
                };
              }
            });

            setPrices(newPrices);
          } catch (error) {
            console.error(
              "WebSocket mesajı ayrıştırılırken hata oluştu:",
              error
            );
          }
        };

        ws.onclose = () => {
          console.log("WebSocket bağlantısı kapandı, yeniden bağlanıyor...");
          setTimeout(connectWebSocket, 30000);
        };

        ws.onerror = (error) => console.error("WebSocket hatası:", error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols, isStreamOn, isFrozen]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const getPriceData = (code) => {
    const uhasItem = prices["UHAS"];
    const currencyItem = prices[code];

    if (code === "USDTRY" || code === "EURTRY") {
      return {
        Bid: operations[code]?.Bid || currencyItem?.Bid || 0, // Öncelikle operations değerini kullanıyoruz
        Ask: operations[code]?.Ask || currencyItem?.Ask || 0,
      };
    }

    if (!uhasItem) return { Bid: 0, Ask: 0 };

    const operationBidAdjustment = parseFloat(operations?.[code]?.Bid || 1);
    const operationAskAdjustment = parseFloat(operations?.[code]?.Ask || 1);

    return {
      Bid: (uhasItem.Bid * operationBidAdjustment).toFixed(2),
      Ask: (uhasItem.Ask * operationAskAdjustment).toFixed(2),
    };
  };

  const uhasData = getPriceData("UHAS");

  return (
    <div className="tablo-container container-fluid">
      <div className="row başlık2 text-center d-flex align-items-center justify-content-between">
        <div className="col-sm-8">
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className="col-4 c-left">
              <span className="blinking-dot"></span> CANLI
            </div>
            <div className="col-4">ALIŞ</div>
            <div className="col-4">SATIŞ</div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-4 p3 h align-left`}>
              <span className="r">24</span> HAS
            </div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(uhasData.Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(uhasData.Ask)}</span>
            </div>
          </div>
          <div className="row boşluk"></div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-4 p3 h align-left`}>
              <span className="r">22</span> AYAR
            </div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("22AYAR").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("22AYAR").Ask)}</span>
            </div>
          </div>
          <div className="row boşluk"></div>
          {show18Ayar && (
            <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
              <div className={`col-4 p3 h align-left`}>
                <span className="r">18</span> AYAR
              </div>
              <div className="col-4 p3 bg-light text-dark">
                <span>{formatNumber(getPriceData("18AYAR").Bid)}</span>
              </div>
              <div className="col-4 p3">
                <span>{formatNumber(getPriceData("18AYAR").Ask)}</span>
              </div>
            </div>
          )}
          {!show18Ayar && (
            <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
              <div className={`col-4 p3 h align-left`}>
                <span className="r">18</span> AYAR
              </div>
              <div className="col-4 p3 bg-light text-dark">
                <span>{formatNumber(getPriceData("18AYAR").Bid)}</span>
              </div>
              <div className="col-4 p3"></div>
            </div>
          )}
          <div className="row boşluk"></div>
          {show14Ayar && (
            <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
              <div className={`col-4 p3 h align-left`}>
                <span className="r">14</span> AYAR
              </div>
              <div className="col-4 p3 bg-light text-dark">
                <span>{formatNumber(getPriceData("14AYAR").Bid)}</span>
              </div>
              <div className="col-4 p3">
                <span>{formatNumber(getPriceData("14AYAR").Ask)}</span>
              </div>
            </div>
          )}
          {!show14Ayar && (
            <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
              <div className={`col-4 p3 h align-left`}>
                <span className="r">14</span> AYAR
              </div>
              <div className="col-4 p3 bg-light text-dark">
                <span>{formatNumber(getPriceData("14AYAR").Bid)}</span>
              </div>
              <div className="col-4 p3"></div>
            </div>
          )}
          <div className="border-bottom başlık3 text-center d-flex align-items-center justify-content-between">
            <div className="col-12">
              {marqueeText && (
                <Marquee text={marqueeText} scrollAmount={scrollAmount} />
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-4 slayt-container">
          <Carousel />
        </div>
      </div>
      <div className="row başlık2 text-center d-flex align-items-center justify-content-between">
        <div className="col-sm border-right">
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>Y</div>
            <div className={`col-3 p3 h align-left`}>ÇEYREK</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("YCEYREK").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("YCEYREK").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>E</div>
            <div className={`col-3 p3 h align-left`}>YARIM</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("YYARIM").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("YYARIM").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>N</div>
            <div className={`col-3 p3 h align-left`}>ZİYNET</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("YZIYNET").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("YZIYNET").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>İ</div>
            <div className={`col-3 p3 h align-left`}>ATA</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("YATA").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("YATA").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık4 text-center d-flex align-items-center justify-content-between usd-bg">
            <div className={`col-4 p3 h`}>USD</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("USDTRY").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("USDTRY").Ask)}</span>
            </div>
          </div>
        </div>
        <div className="col-sm">
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>E</div>
            <div className={`col-3 p3 h align-left`}>ÇEYREK</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("ECEYREK").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("ECEYREK").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>S</div>
            <div className={`col-3 p3 h align-left`}>YARIM</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("EYARIM").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("EYARIM").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>K</div>
            <div className={`col-3 p3 h align-left`}>ZİYNET</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("EZIYNET").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("EZIYNET").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık2 text-center d-flex align-items-center justify-content-between">
            <div className={`col-1 p3 d`}>İ</div>
            <div className={`col-3 p3 h align-left`}>ATA</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("EATA").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("EATA").Ask)}</span>
            </div>
          </div>
          <div className="row border-bottom başlık4 text-center d-flex align-items-center justify-content-between euro-bg">
            <div className={`col-4 p3 h`}>EURO</div>
            <div className="col-4 p3 bg-light text-dark">
              <span>{formatNumber(getPriceData("EURTRY").Bid)}</span>
            </div>
            <div className="col-4 p3">
              <span>{formatNumber(getPriceData("EURTRY").Ask)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTable;
