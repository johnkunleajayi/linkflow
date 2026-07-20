import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import ConnectionCard from "../components/ConnectionCard";

import useConnections from "../hooks/useConnections";

function Connections() {

  const {
    connections,
    loadConnections,
    connectApplication
  } = useConnections();

  const [searchParams] = useSearchParams();

  useEffect(() => {

    const success =
      searchParams.get("success");

    if (success === "true") {

      loadConnections();

    }

  }, [searchParams]);

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

        {connections.map((connection) => (

          <ConnectionCard
            key={connection.name}
            connection={connection}
            onConnect={connectApplication}
          />

        ))}

      </div>

    </div>

  );

}

export default Connections;