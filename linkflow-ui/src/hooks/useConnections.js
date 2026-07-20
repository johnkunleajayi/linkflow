import {
  useEffect,
  useState
} from "react";


import {
  getConnections,
  connectApplicationApi,
  getSalesforceAuthorizationUrl
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



      if (name === "Salesforce") {



        const data =
          await getSalesforceAuthorizationUrl();



        window.location.href =
          data.authorization_url;



        return;


      }






      await connectApplicationApi(name);




      setConnections((current) =>


        current.map((connection) =>



          connection.name === name


            ? {

                ...connection,

                status: "CONNECTED"

              }


            : connection


        )


      );



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