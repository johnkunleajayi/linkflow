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



  function populateForm(workflow) {

    if (!workflow) {

      return;

    }

    setName(
      workflow.name || ""
    );

    setTrigger(
      workflow.trigger ||
      "LINKEDIN_CONNECTION_ACCEPTED"
    );

    setAction(
      workflow.action ||
      "SALESFORCE_CREATE_LEAD"
    );

    const lead =
      workflow.action_configuration?.lead || {};

    setFirstName(
      lead.FirstName || ""
    );

    setLastName(
      lead.LastName || ""
    );

    setCompany(
      lead.Company || ""
    );

    setEmail(
      lead.Email || ""
    );

    setPhone(
      lead.Phone || ""
    );

  }



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

    populateForm,

    resetForm

  };

}

export default useCreateWorkflowForm;