const API_URL = "http://localhost:8000";

const loginForm =
    document.getElementById("loginForm");

const connectedView =
    document.getElementById("connectedView");

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const userName =
    document.getElementById("userName");

const workspaceName =
    document.getElementById("workspaceName");


async function login() {

    loginBtn.disabled = true;
    loginBtn.textContent = "Connecting...";

    try {

        const form = new URLSearchParams();

        form.append(
            "username",
            emailInput.value.trim()
        );

        form.append(
            "password",
            passwordInput.value
        );

        const loginResponse = await fetch(

            `${API_URL}/auth/login`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body: form

            }

        );

        if (!loginResponse.ok) {

            throw new Error(
                "Invalid email or password."
            );

        }

        const loginData =
            await loginResponse.json();

        const token =
            loginData.access_token;

        const meResponse = await fetch(

            `${API_URL}/auth/me`,

            {

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        if (!meResponse.ok) {

            throw new Error(
                "Unable to load user."
            );

        }

        const me =
            await meResponse.json();

        const workspaceResponse = await fetch(

            `${API_URL}/workspaces`,

            {

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        if (!workspaceResponse.ok) {

            throw new Error(
                "Unable to load workspaces."
            );

        }

        const workspaces =
            await workspaceResponse.json();

        const workspace =
            workspaces.length
                ? workspaces[0]
                : null;

        chrome.storage.local.set(

            {

                token,

                user: me,

                workspace

            },

            () => {

                renderConnected(
                    me,
                    workspace
                );

            }

        );

    }

    catch (error) {

        alert(error.message);

    }

    finally {

        loginBtn.disabled = false;
        loginBtn.textContent =
            "Connect to LinkFlow";

    }

}


function logout() {

    chrome.storage.local.clear(

        () => {

            loginForm.style.display =
                "block";

            connectedView.style.display =
                "none";

            emailInput.value = "";
            passwordInput.value = "";

        }

    );

}


function renderConnected(
    user,
    workspace
) {

    loginForm.style.display =
        "none";

    connectedView.style.display =
        "block";

    logoutBtn.style.display =
        "block";

    userName.textContent =
        user.full_name ||
        user.email ||
        "User";

    workspaceName.textContent =
        workspace
            ? workspace.name
            : "No Workspace";

}


function initialize() {

    chrome.storage.local.get(

        [

            "token",

            "user",

            "workspace"

        ],

        (storage) => {

            if (

                storage.token &&
                storage.user

            ) {

                renderConnected(

                    storage.user,

                    storage.workspace

                );

            }

        }

    );

}


loginBtn.addEventListener(
    "click",
    login
);

logoutBtn.addEventListener(
    "click",
    logout
);

initialize();