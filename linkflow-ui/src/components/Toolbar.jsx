function Toolbar({
  search,
  setSearch,
  workflowCount,
}) {
  return (
    <section className="toolbar">

      <div>

        <h2>My Workflows</h2>

        <p>
          {workflowCount} workflow
          {workflowCount !== 1 && "s"}
        </p>

      </div>

      <input
        className="search-box"
        placeholder="Search workflow..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </section>
  );
}

export default Toolbar;