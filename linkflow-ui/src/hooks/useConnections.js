import {
  useEffect,
  useState
} from "react";


import {
  getConnections,
  connectApplicationApi
} from "../api/connectionApi";



function useConnections() {


  const [connections, setConnections] =
    useState([]);


  const [loading, setLoading] =
    useState(true);




  useEffect(() => {

    loadConnections();

  }, []);




  async function loadConnections() {


    try {


      setLoading(true);


      const data =
        await getConnections();


      setConnections(data);


    } catch (error) {


      console.error(error);


    } finally {


      setLoading(false);

    }

  }




  async function connectApplication(name) {


    try {


      await connectApplicationApi(name);


    } catch (error) {


      console.error(error);


      alert(
        "Unable to connect application."
      );

    }

  }




  return {


    connections,

    loading,

    connectApplication,

    loadConnections

  };


}


export default useConnections;