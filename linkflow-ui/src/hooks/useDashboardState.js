import {
  useState
} from "react";


function useDashboardState({
  createWorkflow,
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


    await createWorkflow({

      name,

      trigger,

      action,

      actionConfiguration: {

        lead: {

          FirstName: firstName,

          LastName: lastName,

          Company: company,

          Email: email,

          Phone: phone

        }

      },

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