export function prettyTrigger(trigger) {
  switch (trigger) {
    case "LINKEDIN_CONNECTION_ACCEPTED":
      return "LinkedIn Connection Accepted";

    default:
      return trigger;
  }
}


export function prettyAction(action) {
  switch (action) {
    case "SALESFORCE_CREATE_LEAD":
      return "Create Salesforce Lead";

    default:
      return action;
  }
}