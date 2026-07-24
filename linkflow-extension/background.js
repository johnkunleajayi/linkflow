chrome.runtime.onInstalled.addListener(() => {

    console.log("=================================");
    console.log("LinkFlow Extension Installed");
    console.log("=================================");

});

chrome.runtime.onMessage.addListener(

    (message, sender, sendResponse) => {

        if (message.type !== "LINKFLOW_EVENT") {

            return;

        }

        (async () => {

            try {

                console.log("=================================");
                console.log("BACKGROUND RECEIVED EVENT");
                console.log(message.payload);
                console.log("=================================");

                const response = await fetch(

                    "http://localhost:8000/linkedin/webhook",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify(
                            message.payload
                        )

                    }

                );

                console.log(
                    "HTTP STATUS:",
                    response.status
                );

                const data = await response.json();

                console.log("=================================");
                console.log("BACKGROUND RESPONSE");
                console.log(data);
                console.log("=================================");

                sendResponse(data);

            }

            catch (error) {

                console.error("BACKGROUND ERROR");
                console.error(error);

                sendResponse({

                    success: false,

                    error: error.message

                });

            }

        })();

        return true;

    }

);