import React, { useState, useContext, useEffect } from "react";
import "../styles/PriceUpdateForm.css";
import { OperationsContext } from "../context/OperationsContext";

const PriceUpdateForm = () => {
  const {
    operations: contextOperations,
    updateOperations,
    resetOperations,
  } = useContext(OperationsContext);
  const [operations, setOperations] = useState({});
  const [mathOperations, setMathOperations] = useState({
    USDTRY: { bidOperation: "+", bidValue: 0, askOperation: "+", askValue: 0 },
    EURTRY: { bidOperation: "+", bidValue: 0, askOperation: "+", askValue: 0 },
  });

  useEffect(() => {
    setOperations(contextOperations);
  }, [contextOperations]);

  const handleOperationChange = (e, key, type) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, ""); // Sadece sayıları ve noktayı bırakır

    setOperations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
      },
    }));
  };

  const handleMathOperationChange = (e, key, type, fieldType) => {
    const value = e.target.value;
    setMathOperations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [`${fieldType}${type}`]: value,
      },
    }));
  };

  const applyMathOperation = (price, operation, value) => {
    const numericValue = parseFloat(value) || 0;
    switch (operation) {
      case "+":
        return price + numericValue;
      case "-":
        return price - numericValue;
      case "*":
        return price * numericValue;
      case "/":
        return price / numericValue;
      default:
        return price;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOperations = { ...operations };

    // USDTRY ve EURTRY için alış ve satış işlemlerini ayrı ayrı uygula
    ["USDTRY", "EURTRY"].forEach((key) => {
      if (updatedOperations[key]) {
        const bidValue = parseFloat(updatedOperations[key].Bid || 0);
        const askValue = parseFloat(updatedOperations[key].Ask || 0);

        const updatedBid = applyMathOperation(
          bidValue,
          mathOperations[key]?.bidOperation || "+",
          mathOperations[key]?.bidValue || 0
        );
        const updatedAsk = applyMathOperation(
          askValue,
          mathOperations[key]?.askOperation || "+",
          mathOperations[key]?.askValue || 0
        );

        updatedOperations[key].Bid = updatedBid.toFixed(2);
        updatedOperations[key].Ask = updatedAsk.toFixed(2);
      }
    });

    updateOperations(updatedOperations); // Context fonksiyonunu çağırarak state'i günceller
  };

  const handleReset = () => {
    setOperations({
      // Diğer alanlar için de aynı şekilde ekleyebilirsiniz
    });

    setMathOperations({
      USDTRY: {
        bidOperation: "+",
        bidValue: 0,
        askOperation: "+",
        askValue: 0,
      },
      EURTRY: {
        bidOperation: "+",
        bidValue: 0,
        askOperation: "+",
        askValue: 0,
      },
    });

    resetOperations(); // Context fonksiyonunu çağırarak state'i sıfırlar
  };

  const formFields = [
    { label: "24 Ayar Has Altın Alış", key: "UHAS" },
    { label: "22 Ayar Milyem", key: "22AYAR" },
    { label: "18 Ayar Milyem", key: "18AYAR" },
    { label: "14 Ayar Milyem", key: "14AYAR" },
    { label: "Y Çeyrek", key: "YCEYREK" },
    { label: "Y Yarım", key: "YYARIM" },
    { label: "Y Ziynet", key: "YZIYNET" },
    { label: "Y Ata", key: "YATA" },
    { label: "E Çeyrek", key: "ECEYREK" },
    { label: "E Yarım", key: "EYARIM" },
    { label: "E Ziynet", key: "EZIYNET" },
    { label: "E Ata", key: "EATA" },
  ];

  return (
    <form onSubmit={handleSubmit} className="price-update-form-container">
      <h2>Fiyat Güncelleme Formu</h2>
      {formFields.map((field) => (
        <div className="form-group" key={field.key}>
          <label htmlFor={`${field.key}_Bid`}>{field.label} Alış:</label>
          <input
            type="text"
            id={`${field.key}_Bid`}
            placeholder="Örn: 50"
            value={operations[field.key]?.Bid || ""}
            onChange={(e) => handleOperationChange(e, field.key, "Bid")}
          />
          <label htmlFor={`${field.key}_Ask`}>{field.label} Satış:</label>
          <input
            type="text"
            id={`${field.key}_Ask`}
            placeholder="Örn: 54"
            value={operations[field.key]?.Ask || ""}
            onChange={(e) => handleOperationChange(e, field.key, "Ask")}
          />
        </div>
      ))}
      {/* Sadece USDTRY ve EURTRY için matematiksel işlem alanları */}
      {["USDTRY", "EURTRY"].map((key) => (
        <div className="form-group" key={key}>
          <label htmlFor={`${key}_BidOperation`}>
            {key === "USDTRY" ? "Dolar Alış" : "Euro Alış"} İşlem Türü:
          </label>
          <select
            id={`${key}_BidOperation`}
            value={mathOperations[key].bidOperation}
            onChange={(e) =>
              handleMathOperationChange(e, key, "Operation", "bid")
            }
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          <input
            type="text"
            id={`${key}_BidValue`}
            placeholder="İşlem değeri"
            value={mathOperations[key].bidValue}
            onChange={(e) => handleMathOperationChange(e, key, "Value", "bid")}
          />

          <label htmlFor={`${key}_AskOperation`}>
            {key === "USDTRY" ? "Dolar Satış" : "Euro Satış"} İşlem Türü:
          </label>
          <select
            id={`${key}_AskOperation`}
            value={mathOperations[key].askOperation}
            onChange={(e) =>
              handleMathOperationChange(e, key, "Operation", "ask")
            }
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          <input
            type="text"
            id={`${key}_AskValue`}
            placeholder="İşlem değeri"
            value={mathOperations[key].askValue}
            onChange={(e) => handleMathOperationChange(e, key, "Value", "ask")}
          />
        </div>
      ))}
      <div className="form-buttons">
        <button type="submit" className="btn btn-update">
          Fiyatları Güncelle
        </button>
        <button type="button" className="btn btn-reset" onClick={handleReset}>
          Sıfırla
        </button>
      </div>
    </form>
  );
};

export default PriceUpdateForm;
