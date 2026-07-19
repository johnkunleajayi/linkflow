const API_URL =
  import.meta.env.VITE_API_URL;



async function apiClient(

  endpoint,

  options = {}

) {


  const response = await fetch(

    `${API_URL}${endpoint}`,

    {

      headers: {

        "Content-Type": "application/json",

        ...options.headers,

      },

      ...options,

    }

  );




  if (!response.ok) {


    let message =
      "Something went wrong.";



    try {


      const errorData =
        await response.json();



      message =
        errorData.detail ||
        errorData.message ||
        message;



    } catch (error) {


      message =
        response.statusText ||
        message;


    }





    throw new Error(message);


  }




  return await response.json();


}



export default apiClient;