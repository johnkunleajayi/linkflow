import {
  useEffect,
  useMemo,
  useState
} from "react";

import "./App.css";

import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import WorkflowCard from "./components/WorkflowCard";
import CreateWorkflowModal from "./components/CreateWorkflowModal";

import useWorkflows from "./hooks/useWorkflows";


function App() {

  const {
    workflows,
    loading,
    creating,
    loadWorkflows,
    createWorkflow
  } = useWorkflows();



  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");

  const [trigger, setTrigger] = useState(
    "LINKEDIN_CONNECTION_ACCEPTED"
  );

  const [action, setAction] = useState(
    "SALESFORCE_CREATE_LEAD"
  );



  useEffect(() => {

    loadWorkflows();

  }, []);




  async function handleCreateWorkflow() {

    await createWorkflow({
      name,
      trigger,
      action,

      onSuccess: () => {

        setName("");

        setTrigger(
          "LINKEDIN_CONNECTION_ACCEPTED"
        );

        setAction(
          "SALESFORCE_CREATE_LEAD"
        );

        setShowModal(false);

      }

    });

  }





  const filteredWorkflows = useMemo(() => {

    return workflows.filter((workflow) =>
      workflow.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  }, [
    workflows,
    search
  ]);





  function prettyTrigger(trigger) {

    switch(trigger) {

      case "LINKEDIN_CONNECTION_ACCEPTED":

        return "LinkedIn Connection Accepted";


      default:

        return trigger;

    }

  }





  function prettyAction(action) {

    switch(action) {

      case "SALESFORCE_CREATE_LEAD":

        return "Create Salesforce Lead";


      default:

        return action;

    }

  }





  const activeCount = workflows.filter(
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





      {loading ? (

        <div className="loading">

          Loading workflows...

        </div>


      ) : (


        <div className="workflow-grid">


          {
            filteredWorkflows.map(
              (workflow) => (

                <WorkflowCard

                  key={
                    workflow.automation_id
                  }

                  workflow={workflow}

                  prettyTrigger={
                    prettyTrigger
                  }

                  prettyAction={
                    prettyAction
                  }

                />

              )
            )
          }


        </div>


      )}






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



          onCreate={
            handleCreateWorkflow
          }


        />


      )}




    </div>

  );

}


export default App;