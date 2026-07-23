import { useState } from "react";

function useCreateWorkflowForm() {

  const [name, setName] =
    useState("");

  const [trigger, setTrigger] =
    useState(
      "connection.accepted"
    );

  const [action, setAction] =
    useState(
      "salesforce.create_lead"
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
      "connection.accepted"
    );

    setAction(
      workflow.action ||
      "salesforce.create_lead"
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
      "connection.accepted"
    );

    setAction(
      "salesforce.create_lead"
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