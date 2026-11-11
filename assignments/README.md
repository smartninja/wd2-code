# WD2 homework solutions

Model solutions for the homework at the end of each lesson. Each `L<n>/` folder is the finished code of lesson *n* (the same as `../L<n>`) with that lesson's homework solved in it. It runs exactly like the lesson folder; see that lesson's `README.md`.

Each folder has its own `README.md` covering every homework task:
- **Solution:** what changed, and the key code
- **Verify:** how to check it
- **Model answer:** for the "Be ready to say…" questions

Lesson 16 is the course wrap-up and has no homework.

| Lesson | Homework |
| ------ | -------- |
| [L01](L01/) | Filter the recipe page by tag |
| [L02](L02/) | `GET /api/recipes?tag=…` filter |
| [L03](L03/) | An `editor` role that may update but not delete |
| [L04](L04/) | A 5 MB upload limit that answers `422` |
| [L05](L05/) | A Celery task that deletes a recipe's thumbnail |
| [L06](L06/) | A `created_at` column with its own migration |
| [L07](L07/) | A Tailwind footer, and the Jinja page mapped to React components |
| [L08](L08/) | Recipe photo in `RecipeItem`, and a validated `servings` field |
| [L09](L09/) | `getRecipe` / `useRecipe`, and editing a recipe's tag |
| [L10](L10/) | A "Back to list" link on the detail page |
| [L11](L11/) | Update and delete tests, and docstrings in `/docs` |
| [L12](L12/) | A `RecipeList` test with two recipes |
| [L13](L13/) | E2E tests for deleting a recipe and for "Not found." |
| [L14](L14/) | ESLint for the frontend, run in the pipeline |
| [L15](L15/) | A health check that also checks the database, with a test |

Never commit a `.env` file. Each folder only has `.env.example`: copy it to `.env` first, as in the lessons.
