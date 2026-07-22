import {
  useState
} from "react";


function useDashboardState({

  createWorkflow,

  updateWorkflow,

  editingWorkflow,

  resetForm

}) {


  const [showModal, setShowModal] =
    useState(false);


  const [search, setSearch] =
    useState("");


  async function handleCreateWorkflow({

    name,

    trigger,

    action,

    firstName,

    lastName,

    company,

    email,

    phone

  }) {


    const actionConfiguration = {

      lead: {

        FirstName: firstName,

        LastName: lastName,

        Company: company,

        Email: email,

        Phone: phone

      }

    };


    if (editingWorkflow) {

      await updateWorkflow({

        automationId:
          editingWorkflow.automation_id,

        name,

        trigger,

        action,

        actionConfiguration,

        onSuccess: () => {

          resetForm();

          setShowModal(false);

        }

      });

      return;

    }


    await createWorkflow({

      name,

      trigger,

      action,

      actionConfiguration,

      onSuccess: () => {

        resetForm();

        setShowModal(false);

      }

    });

  }


  return {

    showModal,

    setShowModal,

    search,

    setSearch,

    handleCreateWorkflow

  };


}


export default useDashboardState;