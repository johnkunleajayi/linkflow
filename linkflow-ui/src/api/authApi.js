import apiClient from "./apiClient";

export function registerUser(data) {

  return apiClient(

    "/auth/register",

    {

      method: "POST",

      body: JSON.stringify(data)

    }

  );

}

export function loginUser(email, password) {

  const form = new URLSearchParams();

  form.append("username", email);

  form.append("password", password);

  return apiClient(

    "/auth/login",

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/x-www-form-urlencoded"

      },

      body: form

    }

  );

}