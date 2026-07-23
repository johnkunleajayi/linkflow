import apiClient from "./apiClient";

export async function registerUser(data) {

  const response = await apiClient.post(
    "/auth/register",
    data
  );

  return response.data;

}

export async function loginUser(email, password) {

  const form = new URLSearchParams();

  form.append("username", email);
  form.append("password", password);

  const response = await apiClient.post(
    "/auth/login",
    form,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data;

}