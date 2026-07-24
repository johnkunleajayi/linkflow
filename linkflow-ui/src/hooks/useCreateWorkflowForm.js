import { useState } from "react";

function useCreateWorkflowForm() {

  const [name, setName] =
    useState("");

  const [trigger, setTrigger] =
    useState(
      "LINKEDIN_COMMENT"
    );

  const [action, setAction] =
    useState(
      "LINKEDIN_REPLY"
    );

  const [keyword, setKeyword] =
    useState("");

  const [replyMessage, setReplyMessage] =
    useState("");



  function populateForm(workflow) {

    if (!workflow) {

      return;

    }

    setName(
      workflow.name || ""
    );

    setTrigger(
      workflow.trigger ||
      "LINKEDIN_COMMENT"
    );

    setAction(
      workflow.action ||
      "LINKEDIN_REPLY"
    );

    const configuration =
      workflow.action_configuration || {};

    setKeyword(
      configuration.keyword || ""
    );

    setReplyMessage(
      configuration.message || ""
    );

  }



  function resetForm() {

    setName("");

    setTrigger(
      "LINKEDIN_COMMENT"
    );

    setAction(
      "LINKEDIN_REPLY"
    );

    setKeyword("");

    setReplyMessage("");

  }



  return {

    name,
    setName,

    trigger,
    setTrigger,

    action,
    setAction,

    keyword,
    setKeyword,

    replyMessage,
    setReplyMessage,

    populateForm,

    resetForm

  };

}

export default useCreateWorkflowForm;