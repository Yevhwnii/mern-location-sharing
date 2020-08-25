import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpDate, setTokenExpDate] = useState();
  const [userId, setUserId] = useState(false);
  const login = useCallback((uid, token, expDate) => {
    setToken(token);
    setUserId(uid);
    // current time + 1h
    const tokenExpirationDate =
      expDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(tokenExpirationDate);
    localStorage.setItem(
      "token",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );

    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null);
    localStorage.removeItem("token");
    setUserId(null);
  }, []);

  // Expiration date check if user didn`t logout manually and stays on page for more than 1hr
  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  // Auto login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("token"));
    if (
      storedData &&
      storedData.token &&
      storedData.userId &&
      // If expiration date is still in the future
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
