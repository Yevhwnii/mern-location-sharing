import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Piece of data which will not change (not reinitialized) when fucntion runs again.
  // Since this function runs again whenever component whihc uses it rerenders, it will store data across rerender cycles
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      // React will immedietly update UI since it detects that following code is async
      // and thus it won`t batch this update in one cycle
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          // We pass this property to initialize connection between controller and request so we can call abort then
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();
        // Clear the request when it is sucessful
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        // false if we have 4** or 5** status code
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        // Throwing error here and wrap in try-catch in Auth.js so it does not go to auth.login()
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // Since user may manually go to another page when he aldready sent request,
      // we may fall into issue that request is sent and response is not yet came, and meanwhile we sent another request,
      // and this can call error. Therefore we append abort controller so that if we unmound component which uses this func manually,
      // all requests that were sent are cancelled
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};

// Use ref:

// Whenever components gets render, it is gonna assign whole DOM element
// to that variablie that is passed thru ref attribuute

// Or to store previous state or any value that persist render cycles and do not trigger them
