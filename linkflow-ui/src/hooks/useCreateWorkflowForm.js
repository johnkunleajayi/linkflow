import { useState } from "react";

function useCreateWorkflowForm() {

  const [name, setName] =
    useState("");

  const [trigger, setTrigger] =
    useState(
      "LINKEDIN_CONNECTION_ACCEPTED"
    );

  const [action, setAction] =
    useState(
      "SALESFORCE_CREATE_LEAD"
    );

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  function resetForm() {

    setName("");

    setTrigger(
      "LINKEDIN_CONNECTION_ACCEPTED"
    );

    setAction(
      "SALESFORCE_CREATE_LEAD"
    );

    setFirstName("");
    setLastName("");
    setCompany("");
    setEmail("");
    setPhone("");

  }

  return {

    name,
    setName,

    trigger,
    setTrigger,

    action,
    setAction,

    firstName,
    setFirstName,

    lastName,
    setLastName,

    company,
    setCompany,

    email,
    setEmail,

    phone,
    setPhone,

    resetForm

  };

}

export default useCreateWorkflowForm;