// useFetch.js
//this code for any table in DB
import { useState, useEffect } from 'react';

const DataFetch = (url) => { // url of api
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); //use state becaue the use state role is to mae rendering for the data 
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(url) //JS function usr to get data from server 
      .then((response) => response.json()) //a function wait untill the data is ready because its take time 
      .then((data) => { //display data in use state
        setData(data); //to make a render for the list 
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

export default DataFetch;