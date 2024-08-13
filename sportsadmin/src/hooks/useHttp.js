import { useState, useCallback } from "react";
import axios from "../config/axios";

const useHttp = (initialState = true) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios(requestConfig);
      if (response.status !== 200 && response.status !== 201 && response.status !== 401) {
        throw new Error("Request failed!");
      }
      applyData(response.data);
      
    } catch (err) {
      let errorMessage = err.message || "Something went wrong";
      if (err.response) {
        if (
          err.response.data &&
          err.response.data.error &&
          err.response.data.error.message
        ) {
          errorMessage = err.response.data.error.message;
        }else if(err.response.status === 401){
          // errorMessage= "The user is not authorized"
          errorMessage= "Invalid email or password"
        }
        
      }
      setError(errorMessage);
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
