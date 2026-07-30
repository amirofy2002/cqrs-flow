# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript CQRS library. Public exports begin in `src/index.ts`. Contracts live in `src/core/types/`, events in `src/core/events/`, and exceptions in `src/core/exceptions/`. Runtime implementations are under `src/services/`: buses are grouped in `v1/` and `v2/`, and handler decorators in `decorators/`. Keep version-specific behavior in its matching directory and update the relevant `index.ts` barrel when adding public APIs.

Generated JavaScript, declarations, and source maps go to `dist/`; do not edit them manually.

## Build, Test, and Development Commands

- `npm ci` installs the locked dependency set.
- `npm run build` cleans `dist/` and compiles JavaScript and declarations with `tsc`.
- `npm test` is currently a failing placeholder. Replace it when introducing the first test runner.
- `npm run dev` targets the currently untracked `src/test.ts`; add a harness or adjust the script first.
- `npm run measure` runs `dist/test.js` with the Node inspector and also expects that harness.

Run `npm run build` before submitting changes; it is the current type-check and release gate.

## Coding Style & Naming Conventions

Use two-space indentation, double quotes, semicolons, and trailing commas in multiline constructs. TypeScript uses strict mode, `noImplicitAny`, CommonJS, and case-sensitive imports. Use PascalCase for classes and interfaces (`CommandBusV2`, `ICommandHandler`), camelCase for methods and variables, and kebab-case event filenames. Preserve `V1`/`V2` suffixes. No formatter or linter is configured, so match neighboring code.

## Testing Guidelines

There is no test framework or coverage threshold yet. When adding one, place tests in `test/` with names such as `CommandBusV2.test.ts`. Cover handler registration, successful dispatch, missing handlers, and rejected executions. Until then, run `npm run build` and document manual checks in the pull request.

## Commit & Pull Request Guidelines

History favors short Conventional Commit-style subjects such as `fix: variable names`, `feat: add executionId`, and `chore: remove loggers`; release commits use the bare version. Keep commits focused and imperative. Pull requests should explain behavior, identify affected API versions, link issues, and list verification. Call out breaking export or type changes explicitly; screenshots are only relevant for visual documentation.
