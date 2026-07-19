import {
  useEffect
} from "react";


import "../App.css";


import {
  prettyTrigger,
  prettyAction
} from "../utils/workflowFormatter";


import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Toolbar from "../components/Toolbar";
import CreateWorkflowModal from "../components/CreateWorkflowModal";
import WorkflowGrid from "../components/WorkflowGrid";


import useWorkflows from "../hooks/useWorkflows";
import useWorkflowSearch from "../hooks/useWorkflowSearch";
import useCreateWorkflowForm from "../hooks/useCreateWorkflowForm";
import useDashboardState from "../hooks/useDashboardState";




function Dashboard() {


  const {
    workflows,
    loading,
    creating,
    loadWorkflows,
    createWorkflow

  } = useWorkflows();





  const {
    name,
    setName,

    trigger,
    setTrigger,

    action,
    setAction,

    resetForm

  } = useCreateWorkflowForm();





  const {

    showModal,

    setShowModal,

    search,

    setSearch,

    handleCreateWorkflow

  } = useDashboardState({

    createWorkflow,

    resetForm

  });







  useEffect(() => {

    loadWorkflows();

  }, []);







  const filteredWorkflows =
    useWorkflowSearch(

      workflows,

      search

    );







  const activeCount =
    workflows.filter(

      (workflow) =>
        workflow.status === "ACTIVE"

    ).length;







  return (

    <div className="app">



      <Hero

        onNewWorkflow={() =>
          setShowModal(true)
        }

      />






      <Stats

        totalWorkflows={
          workflows.length
        }

        activeWorkflows={
          activeCount
        }

        connections={2}

        executions={283}

      />







      <Toolbar

        search={search}

        setSearch={setSearch}

        workflowCount={
          filteredWorkflows.length
        }

      />








      <WorkflowGrid


        loading={loading}


        workflows={
          filteredWorkflows
        }


        prettyTrigger={
          prettyTrigger
        }


        prettyAction={
          prettyAction
        }


      />










      {showModal && (



        <CreateWorkflowModal


          creating={creating}


          name={name}

          setName={setName}



          trigger={trigger}

          setTrigger={setTrigger}



          action={action}

          setAction={setAction}



          onCancel={() =>
            setShowModal(false)
          }



          onCreate={() =>

            handleCreateWorkflow({

              name,

              trigger,

              action

            })

          }


        />



      )}






    </div>

  );


}



export default Dashboard;