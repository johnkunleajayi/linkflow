function ConnectionCard({
  connection,
  onConnect
}) {


  return (

    <div className="workflow-card">


      <div className="workflow-header">


        <div>

          <h3>
            {connection.name}
          </h3>


          <span
            className={
              connection.status === "CONNECTED"
                ? "badge active"
                : "badge disabled"
            }
          >

            {connection.status}

          </span>


        </div>


      </div>





      <div className="workflow-actions">


        <button

          className="primary-btn"

          onClick={() =>
            onConnect(connection.name)
          }

        >

          {
            connection.status === "CONNECTED"
              ? "Manage"
              : "Connect"
          }

        </button>


      </div>


    </div>

  );

}


export default ConnectionCard;