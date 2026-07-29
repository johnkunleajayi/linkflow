console.log("🚀 LinkFlow Content Engine V2 Started");

/* ==========================================================
   CONFIG
========================================================== */

const CONFIG = {

    QUEUE_DELAY: 1000,

    EDITOR_DELAY: 700,

    REPLY_CLICK_DELAY: 1200,

    MAX_PARENT_SEARCH: 12

};

/* ==========================================================
   STATE
========================================================== */

const processed = new Set();

const eventQueue = [];

let isProcessing = false;

/* ==========================================================
   LOGGER
========================================================== */

function divider() {

    console.log("==================================");

}

function log(title, data = null) {

    divider();

    console.log(title);

    if (data) {

        console.log(data);

    }

    divider();

}

/* ==========================================================
   HELPERS
========================================================== */

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

function hasClass(node, className) {

    return node?.classList?.contains(className);

}

/* ==========================================================
   THREAD DISCOVERY
========================================================== */

function getThreadItem(element) {

    let current = element;

    for (

        let i = 0;

        i < CONFIG.MAX_PARENT_SEARCH;

        i++

    ) {

        if (!current) {

            break;

        }

        if (

            hasClass(

                current,

                "comments-thread-item"

            )

        ) {

            return current;

        }

        current = current.parentElement;

    }

    return null;

}

/* ==========================================================
   DOM HELPERS
========================================================== */

function getReplyButton(threadItem) {

    return threadItem.querySelector(

        ".comments-comment-social-bar__reply-action-button--cr"

    );

}

async function getReplyEditor(threadItem) {

    const scope =
    threadItem.closest(".comments-comment-entity") ||
    document;

for (let i = 0; i < 20; i++) {

    const editor = scope.querySelector(
        ".comments-comment-box--reply .ql-editor[contenteditable='true']"
    );

    if (editor) {
        return editor;
    }

    await sleep(200);
}

return null;

    if (!threadEntity) {
        return null;
    }

    for (let i = 0; i < 20; i++) {

        const editor = threadEntity.querySelector(
            ".comments-comment-box--reply .ql-editor[contenteditable='true']"
        );

        if (editor) {
            return editor;
        }

        await sleep(200);
    }

    return null;

}

function getAuthor(threadItem) {

    const element = threadItem.querySelector(

        ".comments-comment-meta__description-title"

    );

    return element

        ? element.innerText.trim()

        : "";

}

function getComment(threadItem) {

    const spans = threadItem.querySelectorAll(

        "span[dir='ltr']"

    );

    for (const span of spans) {

        const text = span.innerText.trim();

        if (

            text &&

            text !== "Like" &&

            text !== "Reply"

        ) {

            return text;

        }

    }

    return "";

}

/* ==========================================================
   QUEUE
========================================================== */

function enqueueEvent(event) {

    eventQueue.push(event);

    log(

        "EVENT ADDED TO QUEUE",

        {

            queueSize:

                eventQueue.length

        }

    );

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

        const event =

            eventQueue.shift();

        log(

            "PROCESSING EVENT",

            {

                remaining:

                    eventQueue.length,

                author:

                    event.author

            }

        );

        await processEvent(event);

        await sleep(

            CONFIG.QUEUE_DELAY

        );

    }

    isProcessing = false;

    log("QUEUE EMPTY");
}

/* ==========================================================
   BACKEND
========================================================== */

async function processEvent(event) {

    return new Promise((resolve) => {

        chrome.runtime.sendMessage(

            {

                type:

                    "LINKFLOW_EVENT",

                payload: {

                    event:

                        "LINKEDIN_COMMENT",

                    author:

                        event.author,

                    comment:

                        event.comment,

                    keyword:

                        event.comment

                }

            },

            async (response) => {

                log(

                    "BACKEND RESPONSE",

                    response

                );

                try {

                    if (

                        !response?.success

                    ) {

                        resolve();

                        return;

                    }

                    await executeCommands(

                        response.commands,

                        event.threadItem

                    );

                }

                catch (e) {

                    console.error(e);

                }

                resolve();

            }

        );

    });

}

/* ==========================================================
   REPLY CONTROLLER
========================================================== */

async function openReplyEditor(threadItem) {

    log("OPENING REPLY EDITOR");

    const replyButton = getReplyButton(threadItem);

    if (!replyButton) {

        log("❌ Reply button not found");

        return false;

    }

    replyButton.click();

    await sleep(CONFIG.REPLY_CLICK_DELAY);

    console.log("========== THREAD AFTER CLICK ==========");

    console.log(threadItem.outerHTML);

    console.log("========================================");

    return true;

}

/* ==========================================================
   EDITOR CONTROLLER
========================================================== */

function clearEditor(editor) {

    editor.focus();

    editor.innerHTML = "";

}

function dispatchEditorEvents(editor, text) {

    editor.dispatchEvent(

        new InputEvent(

            "beforeinput",

            {

                bubbles: true,

                cancelable: true,

                inputType: "insertText",

                data: text

            }

        )

    );

    editor.dispatchEvent(

        new InputEvent(

            "input",

            {

                bubbles: true,

                inputType: "insertText",

                data: text

            }

        )

    );

}

async function insertReply(threadItem, reply) {

    log("LOOKING FOR REPLY EDITOR");

    const editor = await getReplyEditor(threadItem);

    if (!editor) {

        log("❌ Reply editor not found");

        return false;

    }

    log("✅ Reply editor found");

    editor.focus();

    const paragraph = editor.querySelector("p");

    if (paragraph) {

        paragraph.innerHTML = "";

        paragraph.appendChild(

            document.createTextNode(reply)

        );

    } else {

        editor.innerHTML = `<p>${reply}</p>`;

    }

    editor.dispatchEvent(

        new InputEvent("beforeinput", {

            bubbles: true,

            cancelable: true,

            inputType: "insertText",

            data: reply

        })

    );

    editor.dispatchEvent(

        new InputEvent("input", {

            bubbles: true,

            inputType: "insertText",

            data: reply

        })

    );

    log("✅ Reply inserted");

    return true;

}

/* ==========================================================
   COMMAND EXECUTOR
========================================================== */

async function executeReply(command, threadItem) {

    log(

        "EXECUTING REPLY",

        command

    );

    const opened =

        await openReplyEditor(

            threadItem

        );

    if (!opened) {

        return;

    }

    await sleep(

        CONFIG.EDITOR_DELAY

    );

    const inserted = await insertReply(
    threadItem,
    command.text
);

if (!inserted) {
    return;
}

await sleep(500);

await submitReply(threadItem);

}

async function executeCommands(

    commands,

    threadItem

) {

    log(

        "EXECUTING COMMANDS",

        {

            count:

                commands?.length || 0

        }

    );

    if (!commands?.length) {

        return;

    }

    for (const command of commands) {

        switch (command.type) {

            case "reply":

                await executeReply(

                    command,

                    threadItem

                );

                break;

            case "like":

                log(

                    "LIKE command not implemented"

                );

                break;

            case "follow":

                log(

                    "FOLLOW command not implemented"

                );

                break;

            case "connect":

                log(

                    "CONNECT command not implemented"

                );

                break;

            case "message":

                log(

                    "MESSAGE command not implemented"

                );

                break;

            default:

                log(

                    "UNKNOWN COMMAND",

                    command

                );

        }

    }

    log(

        "COMMAND EXECUTION COMPLETE"

    );

}

/* ==========================================================
   COMMENT DETECTION ENGINE
========================================================== */

function hasMyReply(threadItem) {

    const replies = threadItem.querySelectorAll(
        ".comments-comment-meta__description-title"
    );

    console.log("FOUND TITLES:", replies.length);

    replies.forEach(r =>
        console.log("TITLE:", r.innerText.trim())
    );

    return false;
}

function extractComments() {

    const threadItems = document.querySelectorAll(

        ".comments-thread-item"

    );

    threadItems.forEach((threadItem) => {

        try {

            const author = getAuthor(threadItem);

            const comment = getComment(threadItem);

            if (hasMyReply(threadItem)) {

                log("SKIPPING - Already replied");

                return;

            }

            if (!author || !comment) {

                return;

            }

            const key = `${author}:${comment}`;

            if (processed.has(key)) {

                return;

            }

            processed.add(key);

            log(

                "NEW COMMENT DETECTED",

                {

                    author,

                    comment

                }

            );

            enqueueEvent({

                author,

                comment,

                threadItem

            });

        }

        catch (error) {

            console.error(

                "Comment extraction failed:",

                error

            );

        }

    });

}

/* ==========================================================
   MUTATION OBSERVER
========================================================== */

const observer = new MutationObserver(

    () => {

        extractComments();

    }

);

observer.observe(

    document.body,

    {

        childList: true,

        subtree: true

    }

);

/* ==========================================================
   STARTUP
========================================================== */

function initialize() {

    log(

        "LINKFLOW CONTENT ENGINE READY"

    );

    extractComments();

}

initialize();

/* ==========================================================
   DEBUG HELPERS
   (Accessible from DevTools Console)
========================================================== */

window.LinkFlowDebug = {

    processed,

    eventQueue,

    extractComments,

    getThreadItem,

    getReplyButton,

    getReplyEditor,

    getAuthor,

    getComment,

    async inspectCurrentSelection() {

        const selection =

            window.getSelection();

        if (

            !selection ||

            !selection.anchorNode

        ) {

            console.log(

                "No active selection."

            );

            return;

        }

        const element =

            selection.anchorNode.parentElement;

        const threadItem =

            getThreadItem(element);

        console.log({

            element,

            threadItem,

            author: threadItem

                ? getAuthor(threadItem)

                : null,

            comment: threadItem

                ? getComment(threadItem)

                : null,

            replyButton: threadItem

                ? getReplyButton(threadItem)

                : null,

            replyEditor: threadItem

                ? getReplyEditor(threadItem)

                : null

        });

    },

    async testReply(text = "Hello from LinkFlow 🚀") {

        const threadItem =

            document.querySelector(

                ".comments-thread-item"

            );

        if (!threadItem) {

            console.log(

                "No thread found."

            );

            return;

        }

        console.log(

            "Testing reply on:",

            getAuthor(threadItem)

        );

        await openReplyEditor(

            threadItem

        );

        await sleep(

            CONFIG.EDITOR_DELAY

        );

        await insertReply(

            threadItem,

            text

        );

    }

};

function getSubmitButton(threadItem) {

    const scope =
        threadItem.closest(".comments-comment-entity") ||
        document;

    return scope.querySelector(
        ".comments-comment-box__submit-button--cr"
    );

}

async function submitReply(threadItem) {

    log("SUBMITTING REPLY");

    const button = getSubmitButton(threadItem);

    if (!button) {

        log("❌ Submit button not found");

        return false;

    }

    button.click();

    log("✅ Reply submitted");

    return true;

}
