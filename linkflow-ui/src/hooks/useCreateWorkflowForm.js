import {
  useState
} from "react";


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




  function resetForm() {

    setName("");

    setTrigger(
      "LINKEDIN_CONNECTION_ACCEPTED"
    );

    setAction(
      "SALESFORCE_CREATE_LEAD"
    );

  }




  return {

    name,
    setName,

    trigger,
    setTrigger,

    action,
    setAction,

    resetForm

  };

}


export default useCreateWorkflowForm;