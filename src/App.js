import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import PriceTable from "./components/PriceTable";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminPanel from "./AdminPanel/components/AdminPanel";
import { UserProvider, UserContext } from "./AdminPanel/context/UserContext";
import { SlideProvider } from "./AdminPanel/context/SlideContext";
import { OperationsProvider } from "./AdminPanel/context/OperationsContext";

const symbols = [
  "ONS",
  "USDTRY",
  "EURTRY",
  "EURUSD",
  "HAS",
  "YCEYREK",
  "YYARIM",
  "YZIYNET",
  "YATA",
  "ECEYREK",
  "EYARIM",
  "EZIYNET",
  "EATA",
  "UHAS",
  "18AYAR",
  "22AYAR",
  "14AYAR",
];

const App = () => {
  const [marqueeText, setMarqueeText] = useState("HOŞ GELDİNİZ!");
  const [scrollAmount, setScrollAmount] = useState(5);
  const [originalPrices, setOriginalPrices] = useState({});
  const [show18Ayar, setShow18Ayar] = useState(true);
  const [show14Ayar, setShow14Ayar] = useState(true);
  const [isStreamOn, setIsStreamOn] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const savedMarqueeText = localStorage.getItem("marqueeText");
    const savedScrollAmount = localStorage.getItem("scrollAmount");
    const savedShow18Ayar = localStorage.getItem("show18Ayar");
    const savedShow14Ayar = localStorage.getItem("show14Ayar");

    if (savedMarqueeText) {
      setMarqueeText(savedMarqueeText);
    }
    if (savedScrollAmount) {
      setScrollAmount(Number(savedScrollAmount));
    }
    if (savedShow18Ayar !== null) {
      setShow18Ayar(JSON.parse(savedShow18Ayar));
    }
    if (savedShow14Ayar !== null) {
      setShow14Ayar(JSON.parse(savedShow14Ayar));
    }

    const initialPrices = {};
    symbols.forEach((symbol) => {
      initialPrices[symbol] = { Bid: 0, Ask: 0 };
    });
    setOriginalPrices(initialPrices);
  }, []);

  const handleSaveMarqueeSettings = (text, amount) => {
    setMarqueeText(text);
    setScrollAmount(amount);
    localStorage.setItem("marqueeText", text);
    localStorage.setItem("scrollAmount", amount);
  };

  const handleTogglePrices = (isStreaming) => {
    setIsStreamOn(isStreaming);
  };

  const handleFreezePrices = (isFreezing) => {
    setIsFrozen(isFreezing);
  };

  return (
    <UserProvider>
      <SlideProvider>
        <OperationsProvider>
          <Router>
            <div
              className={
                window.location.pathname === "/login" ? "login-background" : ""
              }
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute
                      element={
                        <>
                          <Header />
                          <PriceTable
                            show18Ayar={show18Ayar}
                            show14Ayar={show14Ayar}
                            marqueeText={marqueeText}
                            scrollAmount={scrollAmount}
                            symbols={symbols}
                            originalPrices={originalPrices}
                            isStreamOn={isStreamOn}
                            isFrozen={isFrozen}
                          />
                          <Footer symbols={symbols} />
                        </>
                      }
                    />
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute
                      element={
                        <AdminPanel
                          marqueeText={marqueeText}
                          setMarqueeText={setMarqueeText}
                          scrollAmount={scrollAmount}
                          setScrollAmount={setScrollAmount}
                          onSaveMarqueeSettings={handleSaveMarqueeSettings}
                          symbols={symbols}
                          show18Ayar={show18Ayar}
                          setShow18Ayar={setShow18Ayar}
                          show14Ayar={show14Ayar}
                          setShow14Ayar={setShow14Ayar}
                          isStreamOn={isStreamOn}
                          isFrozen={isFrozen}
                          handleTogglePrices={handleTogglePrices}
                          handleFreezePrices={handleFreezePrices}
                        />
                      }
                    />
                  }
                />
              </Routes>
            </div>
          </Router>
        </OperationsProvider>
      </SlideProvider>
    </UserProvider>
  );
};

const PrivateRoute = ({ element }) => {
  const { currentUser } = useContext(UserContext);
  return currentUser ? element : <Navigate to="/login" />;
};

export default App;
