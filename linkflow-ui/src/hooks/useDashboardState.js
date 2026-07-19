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
    action
  }) {


    await createWorkflow({

      name,

      trigger,

      action,


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