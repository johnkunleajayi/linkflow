function Hero({ onNewWorkflow }) {
  return (
    <section className="hero">
      <div>
        <span className="hero-badge">
          🚀 LINKFLOW
        </span>

        <h1>
          Build automations that work while you sleep.
        </h1>

        <p>
          Connect LinkedIn, Salesforce, HubSpot,
          Gmail and more without writing code.
        </p>
      </div>

      <button
        className="primary-btn"
        onClick={onNewWorkflow}
      >
        + New Workflow
      </button>
    </section>
  );
}

export default Hero;