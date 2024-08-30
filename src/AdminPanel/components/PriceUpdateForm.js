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
    USDTRY: { operation: "+", value: 0 },
    EURTRY: { operation: "+", value: 0 },
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

  const handleMathOperationChange = (e, key, type) => {
    const value = e.target.value;
    setMathOperations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
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

    // Tüm fiyatlar için güncellemeleri uygula
    for (const key in updatedOperations) {
      if (key === "USDTRY" || key === "EURTRY") {
        const bidValue = parseFloat(updatedOperations[key].Bid || 0);
        const askValue = parseFloat(updatedOperations[key].Ask || 0);

        const updatedBid = applyMathOperation(
          bidValue,
          mathOperations[key].operation,
          mathOperations[key].value
        );
        const updatedAsk = applyMathOperation(
          askValue,
          mathOperations[key].operation,
          mathOperations[key].value
        );

        updatedOperations[key].Bid = updatedBid.toFixed(2);
        updatedOperations[key].Ask = updatedAsk.toFixed(2);
      } else {
        // Diğer tüm ayarlar için fiyatları güncelle
        updatedOperations[key].Bid = parseFloat(
          updatedOperations[key].Bid || 0
        ).toFixed(2);
        updatedOperations[key].Ask = parseFloat(
          updatedOperations[key].Ask || 0
        ).toFixed(2);
      }
    }

    updateOperations(updatedOperations); // Context fonksiyonunu çağırarak state'i günceller
  };

  const handleReset = () => {
    setOperations({
      USDTRY: { Bid: "", Ask: "" },
      EURTRY: { Bid: "", Ask: "" },
      // Diğer alanlar için de aynı şekilde ekleyebilirsiniz
    });

    setMathOperations({
      USDTRY: { operation: "+", value: 0 },
      EURTRY: { operation: "+", value: 0 },
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
    { label: "Dolar", key: "USDTRY" },
    { label: "Euro", key: "EURTRY" },
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

          {["USDTRY", "EURTRY"].includes(field.key) && (
            <div className="form-group">
              <label htmlFor={`${field.key}_Operation`}>
                {field.label} İşlem Türü:
              </label>
              <select
                id={`${field.key}_Operation`}
                value={mathOperations[field.key].operation}
                onChange={(e) =>
                  handleMathOperationChange(e, field.key, "operation")
                }
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">*</option>
                <option value="/">/</option>
              </select>
              <input
                type="text"
                id={`${field.key}_Value`}
                placeholder="İşlem değeri"
                value={mathOperations[field.key].value}
                onChange={(e) =>
                  handleMathOperationChange(e, field.key, "value")
                }
              />
            </div>
          )}
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
