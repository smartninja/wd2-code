# Lesson 14 homework — solutions

This is the finished code of lesson 14 plus the homework, and it runs exactly like `L14` (see the run instructions in `L14/README.md`, which point back to lesson 13: the backend in Docker, the frontend with `bun run dev`, and the pipeline in `.semaphore/semaphore.yml`).

## Task: a frontend lint step

Asked: check whether the frontend already has ESLint, set it up if not, add `bun run lint` to the Frontend job, then push a lint error and watch the pipeline go red.

**Check first:** `L14/frontend` has no `eslint.config.js` and no `"lint"` script in `package.json`, so ESLint has to be added.

**Solution:**

1. From `frontend/`, install ESLint and the four helpers a TypeScript + React project needs, as dev dependencies:

   ```bash
   bun add -d eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
   ```

   | Package | What it adds |
   |---|---|
   | `eslint` | the linter itself (the frontend's Ruff) |
   | `@eslint/js` | the recommended rules for plain JavaScript |
   | `typescript-eslint` | lets ESLint read TypeScript, plus its recommended rules |
   | `eslint-plugin-react-hooks` | the rules of hooks from lesson 8 (only at the top level, never inside an `if`) |
   | `eslint-plugin-react-refresh` | warns when a file breaks Vite's hot reload |
   | `globals` | tells ESLint that `window`, `document` and `fetch` exist in the browser |

2. `frontend/eslint.config.js` (new), ESLint's "flat config":

   ```js
   export default defineConfig([
     globalIgnores(["dist", "test-results", "playwright-report"]),
     {
       files: ["**/*.{ts,tsx}"],
       extends: [
         js.configs.recommended,
         tseslint.configs.recommended,
         reactHooks.configs.flat.recommended,
         reactRefresh.configs.vite,
       ],
       languageOptions: { globals: globals.browser },
     },
   ]);
   ```

   The ignored folders are generated: the build output and Playwright's results.

3. `frontend/package.json`: a `"lint": "eslint ."` script below `"e2e"`, and the six packages under `devDependencies` (`bun add -d` writes these lines for you).

4. `.semaphore/semaphore.yml`: one new command in the Frontend job, right after `bun install` (in the Workflow Builder: click the job and add the line to its commands):

   ```yaml
   - cd frontend
   - bun install
   - bun run lint
   - bun run build
   - bun run vitest --run
   ```

   Lint runs first because it's the fastest check: a lint error stops the job before the build and the tests spend any time.

**Verify:**

- Locally, from `frontend/`: `bun run lint` prints nothing after `$ eslint .` and exits with code 0 (the existing code has no errors and no warnings). `bun run build` and `bun run test --run` still pass.
- Push it. The Frontend job's log shows `bun run lint` passing, then the build and Vitest.
- Push a lint error: add `const unused = 1;` as a new line in `src/main.tsx`. Locally, `bun run lint` reports `'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars` and exits with code 1. In CI, the Frontend job goes red at `bun run lint`, the build and Vitest never run, and "Deploy" never starts. Remove the line and push again: green.

## Task: trip the E2E test and open the CI report

Asked: make the E2E test fail on purpose, then download and open the uploaded report.

**Solution:** no code to keep; these are the steps (the same break as Part 6, step 4 of the lesson).

1. In `frontend/src/router.tsx`, change the nav link text `Add` to `New`. Commit and push.
2. In Semaphore, the Frontend job stays green (no component test looks at the nav), and the E2E job goes red after about a minute or two longer than usual: with `CI` set, `retries: 2` runs the failing test three times.
3. Open the E2E job, then its **Artifacts** tab. There is a `playwright-report` folder, uploaded by the epilogue's `artifact push job frontend/playwright-report --expire-in 2w`, which runs even though the job failed.
4. Download the folder and, from `frontend/`, run `bunx playwright show-report <path-to-the-downloaded-playwright-report>`. If the Artifacts tab only lets you download single files, open `playwright-report/data/`, download one of the `.zip` files (one per attempt), and run `bunx playwright show-trace <path-to-the-zip>`.
5. In the report you see three attempts of `a logged-in user can add a recipe and see it`. Open a trace: the failing step is the click on `getByRole("link", { name: "Add" })`, and the snapshot shows the nav with "Recipes" and "New" only.
6. Change `New` back to `Add`, push, and check all three blocks go green again.

## Task: why CI starts its own database, and why you upload the report

**Model answer:** a CI job runs on a fresh, empty machine that has no Postgres, no docker-compose `db-test` and no `.env`, so the job starts its own throwaway database with `sem-service start postgres` and points the tests at it with `TEST_DATABASE_URL`. The Playwright report is uploaded because the machine is deleted when the job ends and nobody watched it run: the artifact keeps the trace, video and screenshot, so you can debug a CI-only failure by opening the trace instead of pushing commits and guessing.

## Files changed compared with L14

- `frontend/eslint.config.js` (new)
- `frontend/package.json` (the `lint` script and six ESLint dev dependencies)
- `.semaphore/semaphore.yml` (`bun run lint` in the Frontend job)
- `README.md` (this file, replacing the lesson README)
