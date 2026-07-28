console.log("🚀 LinkFlow Extension Started");

let processed = new Set();

let eventQueue = [];

let isProcessing = false;


function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}


function enqueueEvent(event) {

    eventQueue.push(event);

    console.log("==================================");
    console.log("EVENT ADDED TO QUEUE");
    console.log("Queue Size:", eventQueue.length);
    console.log("==================================");

    processQueue();

}


async function processQueue() {

    if (isProcessing) {

        return;

    }

    if (!eventQueue.length) {

        return;

    }

    isProcessing = true;

    while (eventQueue.length) {

        const event = eventQueue.shift();

        console.log("==================================");
        console.log("PROCESSING NEXT EVENT");
        console.log("Remaining Queue:", eventQueue.length);
        console.log("==================================");

        await processEvent(event);

        await sleep(1000);

    }

    isProcessing = false;

    console.log("==================================");
    console.log("QUEUE EMPTY");
    console.log("==================================");

}


async function processEvent(event) {

    return new Promise((resolve) => {

        chrome.runtime.sendMessage(

            {

                type: "LINKFLOW_EVENT",

                payload: {

                    event: "LINKEDIN_COMMENT",

                    author: event.author,

                    comment: event.comment,

                    keyword: event.comment

                }

            },

            async (response) => {

                console.log("==================================");
                console.log("LINKFLOW RESPONSE");
                console.log(response);
                console.log("==================================");

                try {

                    if (!response?.success) {

                        console.log("❌ Backend failed");

                        resolve();

                        return;

                    }

                    await executeCommands(

                        response.commands,

                        event.commentBlock

                    );

                }

                catch (error) {

                    console.error(error);

                }

                resolve();

            }

        );

    });

}


async function openReplyEditor(commentContainer) {

    console.log("==================================");
    console.log("SEARCHING FOR REPLY BUTTON");
    console.log("==================================");

    const buttons =
        commentContainer.querySelectorAll("button");

    for (const button of buttons) {

        const text =
            button.innerText?.trim();

        if (

            text &&
            text.toLowerCase() === "reply"

        ) {

            console.log("👉 Clicking Reply");

            button.click();

            await sleep(1200);

            return true;

        }

    }

    console.log("❌ Reply button not found");

    return false;

}


function insertReply(reply) {

    console.log("==================================");
    console.log("LOOKING FOR REPLY EDITOR");
    console.log("==================================");

    const editor = document.querySelector(

        ".ql-editor[contenteditable='true']"

    );

    if (!editor) {

        console.log("❌ Reply editor not found");

        return;

    }

    console.log("✅ Reply editor found");

    editor.focus();

    editor.innerHTML = "";

    const paragraph = document.createElement("p");

    paragraph.textContent = reply;

    editor.appendChild(paragraph);

    editor.dispatchEvent(

        new InputEvent(

            "input",

            {

                bubbles: true,

                inputType: "insertText",

                data: reply

            }

        )

    );

    console.log("✅ Reply inserted");

}


async function executeCommands(
    commands,
    commentBlock
) {

    console.log("==================================");
    console.log("EXECUTING COMMANDS");
    console.log("==================================");

    if (!commands?.length) {

        console.log("⚠ No commands returned");

        return;

    }

    console.log(
        "Command Count:",
        commands.length
    );

    for (const command of commands) {

        console.log("----------------------------------");
        console.log("Executing Command:");
        console.log(command);
        console.log("----------------------------------");

        switch (command.type) {

            case "reply":

                console.log("➡ Reply command received");

                const opened =
                    await openReplyEditor(commentBlock);

                console.log(
                    "Reply Editor Opened:",
                    opened
                );

                if (!opened) {

                    console.log("❌ Couldn't find Reply button");

                    continue;

                }

                console.log("Waiting for editor...");

                await sleep(700);

                insertReply(command.text);

                break;

            default:

                console.log(
                    "⚠ Unknown command:",
                    command.type
                );

        }

    }

    console.log("==================================");
    console.log("COMMAND EXECUTION COMPLETE");
    console.log("==================================");

}


function extractComments() {

    const authors = document.querySelectorAll(

        ".comments-comment-meta__container"

    );

    authors.forEach((container) => {

        const authorElement =

            container.querySelector(

                ".comments-comment-meta__description-title"

            );

        if (!authorElement) {

            return;

        }

        const author =

            authorElement.innerText.trim();

        let current = container;

        for (let i = 0; i < 6; i++) {

            if (!current) break;

            const commentElement =

                current.querySelector(

                    'span[dir="ltr"]'

                );

            if (commentElement) {

                const comment =

                    commentElement.innerText.trim();

                if (!comment) {

                    return;

                }

                const key =

                    author + comment;

                if (processed.has(key)) {

                    return;

                }

                processed.add(key);

                console.log("==================================");
                console.log("NEW COMMENT");
                console.log("Author:", author);
                console.log("Comment:", comment);
                console.log("==================================");

                enqueueEvent({

                    author,

                    comment,

                    commentBlock: current

                });

                return;

            }

            current = current.parentElement;

        }

    });

}


const observer = new MutationObserver(() => {

    extractComments();

});

observer.observe(

    document.body,

    {

        childList: true,

        subtree: true

    }

);

extractComments();