const API_URL =
  import.meta.env.VITE_API_URL;

async function apiClient(

  endpoint,

  options = {}

) {

  const {

    headers = {},

    body,

    ...rest

  } = options;


  const response = await fetch(

    `${API_URL}${endpoint}`,

    {

      ...rest,

      headers: {

        "Content-Type": "application/json",

        ...headers,

      },

      body,

    }

  );


  if (!response.ok) {

    let message =
      "Something went wrong.";

    try {

      const errorData =
        await response.json();

      if (

        typeof errorData.detail ===
        "string"

      ) {

        message =
          errorData.detail;

      }

      else if (

        errorData.detail

      ) {

        message =
          JSON.stringify(

            errorData.detail,

            null,

            2

          );

      }

      else if (

        typeof errorData.message ===
        "string"

      ) {

        message =
          errorData.message;

      }

    }

    catch (error) {

      message =
        response.statusText ||
        message;

    }

    throw new Error(message);

  }


  return await response.json();

}

export default apiClient;