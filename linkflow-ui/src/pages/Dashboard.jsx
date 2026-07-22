import {
  useEffect,
  useState
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
    createWorkflow,
    updateWorkflow,
    deleteWorkflow

  } = useWorkflows();


  const [

    editingWorkflow,

    setEditingWorkflow

  ] = useState(null);


  const {

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

  } = useCreateWorkflowForm();


  const {

    showModal,

    setShowModal,

    search,

    setSearch,

    handleCreateWorkflow

  } = useDashboardState({

    createWorkflow,

    updateWorkflow,

    editingWorkflow,

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


  function handleEdit(workflow) {

    setEditingWorkflow(workflow);

    populateForm(workflow);

    setShowModal(true);

  }


  function handleNewWorkflow() {

    setEditingWorkflow(null);

    resetForm();

    setShowModal(true);

  }


  return (

    <div className="app">

      <Hero

        onNewWorkflow={
          handleNewWorkflow
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

        onDelete={
          deleteWorkflow
        }

        onEdit={
          handleEdit
        }

      />

      {showModal && (

        <CreateWorkflowModal

          creating={creating}

          editingWorkflow={
            editingWorkflow
          }

          name={name}
          setName={setName}

          trigger={trigger}
          setTrigger={setTrigger}

          action={action}
          setAction={setAction}

          firstName={firstName}
          setFirstName={setFirstName}

          lastName={lastName}
          setLastName={setLastName}

          company={company}
          setCompany={setCompany}

          email={email}
          setEmail={setEmail}

          phone={phone}
          setPhone={setPhone}

          onCancel={() =>
            setShowModal(false)
          }

          onCreate={() =>

            handleCreateWorkflow({

              name,

              trigger,

              action,

              firstName,

              lastName,

              company,

              email,

              phone

            })

          }

        />

      )}

    </div>

  );

}

export default Dashboard;