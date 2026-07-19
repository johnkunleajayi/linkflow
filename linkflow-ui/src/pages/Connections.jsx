import ConnectionCard from "../components/ConnectionCard";

import useConnections from "../hooks/useConnections";


function Connections() {


  const {
    connections,
    connectApplication
  } = useConnections();




  return (

    <div className="app">


      <section className="hero">

        <div>

          <span className="hero-badge">
            🔗 CONNECTIONS
          </span>


          <h1>
            Connect your business tools.
          </h1>


          <p>
            LinkFlow connects your GTM tools
            and automates your workflows.
          </p>

        </div>

      </section>





      <div className="workflow-grid">


        {
          connections.map((connection) => (

            <ConnectionCard

              key={connection.name}

              connection={connection}

              onConnect={
                connectApplication
              }

            />

          ))
        }


      </div>


    </div>

  );

}


export default Connections;