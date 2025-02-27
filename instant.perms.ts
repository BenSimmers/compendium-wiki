import type { InstantRules } from "@instantdb/react";

// Not recommended for production since this allows anyone to
// upload/delete, but good for getting started
const rules = {
  "$files": {
    "allow": {
      "view": "true",
      "create": "false",
      "delete": "false"
    }
  }
} satisfies InstantRules;

export default rules;