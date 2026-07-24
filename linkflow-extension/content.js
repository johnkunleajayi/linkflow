console.log("🚀 LinkFlow Extension Started");

let processed = new Set();

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

async function openReplyEditor(commentContainer) {

    const buttons = commentContainer.querySelectorAll("button");

    for (const button of buttons) {

        const text =
            button.innerText?.trim().toLowerCase();

        if (text === "reply") {

            console.log("👉 Clicking Reply");

            button.click();

            await sleep(800);

            return true;

        }

    }

    return false;

}

function insertReply(reply) {

    const editor = document.querySelector(

        ".ql-editor[contenteditable='true']"

    );

    if (!editor) {

        console.log("❌ Reply editor not found");

        return;

    }

    editor.focus();

    editor.innerHTML = `<p>${reply}</p>`;

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

function getReplyMessage(response) {

    try {

        return response

            ?.result

            ?.executions?.[0]

            ?.results?.[0]

            ?.message;

    }

    catch {

        return null;

    }

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

        let parent = container;

        for (let i = 0; i < 6; i++) {

            if (!parent) break;

            const commentElement =

                parent.querySelector(

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

                chrome.runtime.sendMessage(

                    {

                        type: "LINKFLOW_EVENT",

                        payload: {

                            event: "LINKEDIN_COMMENT",

                            author,

                            comment,

                            keyword: comment

                        }

                    },

                    async (response) => {

                        console.log("==================================");

                        console.log("LINKFLOW RESPONSE");

                        console.log(response);

                        console.log("==================================");

                        if (!response) {

                            return;

                        }

                        const reply =

                            getReplyMessage(response);

                        if (!reply) {

                            console.log(

                                "⚠ No reply returned"

                            );

                            return;

                        }

                        console.log(

                            "Reply:",

                            reply

                        );

                        const opened =

                            await openReplyEditor(parent);

                        if (!opened) {

                            console.log(

                                "❌ Couldn't find Reply button"

                            );

                            return;

                        }

                        insertReply(reply);

                    }

                );

                return;

            }

            parent = parent.parentElement;

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