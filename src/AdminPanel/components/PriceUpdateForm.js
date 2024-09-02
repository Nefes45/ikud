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
  const [mathOperation, setMathOperation] = useState("+"); // İşlem türünü saklamak için state

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

  const handleMathOperationChange = (e) => {
    setMathOperation(e.target.value); // İşlem türünü güncelle
  };

  const applyMathOperation = (baseValue, inputValue) => {
    const base = parseFloat(baseValue) || 0;
    const input = parseFloat(inputValue) || 0;

    switch (mathOperation) {
      case "+":
        return base + input;
      case "-":
        return base - input;
      case "*":
        return base * input;
      case "/":
        return input !== 0 ? base / input : 0; // Bölme işleminde sıfıra bölmeyi önlemek için kontrol
      default:
        return base;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOperations = { ...operations };

    // USD/TRY ve EUR/TRY için işlem uygulama
    ["USDTRY", "EURTRY"].forEach((key) => {
      if (updatedOperations[key]) {
        const currentOperation = updatedOperations[key];
        updatedOperations[key] = {
          Bid: applyMathOperation(
            contextOperations[key]?.Bid || 0,
            currentOperation.Bid
          ),
          Ask: applyMathOperation(
            contextOperations[key]?.Ask || 0,
            currentOperation.Ask
          ),
        };
      }
    });

    console.log("Updated Operations:", updatedOperations);
    updateOperations(updatedOperations); // Context fonksiyonunu çağırarak state'i günceller
  };

  const handleReset = () => {
    setOperations({});
    setMathOperation("+"); // Reset işlem türü
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
    { label: "USD/TRY", key: "USDTRY" },
    { label: "EUR/TRY", key: "EURTRY" },
  ];

  return (
    <form onSubmit={handleSubmit} className="price-update-form-container">
      <h2>Fiyat Güncelleme Formu</h2>
      <div className="operation-type-selector">
        <label htmlFor="mathOperation">
          USD/TRY ve EUR/TRY için İşlem Türü:
        </label>
        <select
          id="mathOperation"
          value={mathOperation}
          onChange={handleMathOperationChange}
        >
          <option value="+">Toplama (+)</option>
          <option value="-">Çıkarma (-)</option>
          <option value="*">Çarpma (*)</option>
          <option value="/">Bölme (/)</option>
        </select>
      </div>
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
