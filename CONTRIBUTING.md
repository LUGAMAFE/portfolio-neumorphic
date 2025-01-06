### Naming Branches

When creating a new branch, please ensure that you follow the naming conventions outlined below:

1. **Branch Format**: The general format for branches should be:
   - `prefix/JIRA-ID_descriptive-name` for standard branches.
   - `conflict/from_branch_to_branch_descriptive-name` for conflict resolution branches.
2. **Allowed Prefixes**: The following prefixes are allowed for branches:

   - `feature`
   - `bugfix`
   - `task`
   - `subtask`
   - `spike`
   - `test`
   - `epic`
   - `release`
   - `revert`
   - `demo`
   - `conflict` (For conflict resolution branches only)

3. **Suggestions**: If you are unsure or make a mistake, the system might suggest a proper format:

   - e.g., If you use `features`, it will suggest `feature`.
   - For `bug`, it will suggest `bugfix`, and so on.

   Here are some common suggestions:

   | Incorrect | Suggestion     |
   | --------- | -------------- |
   | features  | feature        |
   | feat      | feature        |
   | bug       | bugfix         |
   | ...       | ...            |
   | mergec    | merge-conflict |

   (Note: The above is a truncated list. Refer to the actual suggestion configuration for all the mappings.)

4. **Errors and Messages**: If your branch name does not follow the conventions, you might encounter errors like:
   - `"Branch does not match the allowed pattern."`
   - `"Pushing to this branch is not allowed, use the allowed pattern."`
   - `"Branch prefix is not allowed."`
   - Or suggestions like: `"Instead of 'feat' try 'feature'."`

### Commit Message Rules

For consistent and clean commit messages, please adhere to the following rules:

1. **Header Length**: The commit header (or title) should:

   - Be a minimum of 10 characters.
   - Not exceed 120 characters.

2. **Body**: Ensure that:

   - There is a blank line leading the body of the commit message.

3. **Subject Case**: The subject (or header) of the commit message should be in one of the following cases:
   - Sentence case (e.g., "This is a commit message.")
   - Start case (e.g., "This Is A Commit Message.")
   - Pascal case (e.g., "ThisIsACommitMessage.")
   - Upper case (e.g., "THIS IS A COMMIT MESSAGE.")
   - Lower case (e.g., "this is a commit message.")

---

By following the above guidelines, we can ensure that our repository remains organized, and our commit history is clean and easy to follow. Your cooperation is much appreciated!
