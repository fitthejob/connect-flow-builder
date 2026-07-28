# Flow Builder Standalone Extraction Checklist

This checklist defines the exact file set and steps for carving `flow-builder` into its own standalone repository.

The target outcome is:

```text
a standalone repo whose root is the flow-builder package
with no dependency on connect-mvp repo layout
and no dependency on connect-mvp consumer flows
```

This is the recommended extraction mode.

If you want a compatibility copy that preserves the current `connect-mvp` consumer layer and `generated-flows/` behavior unchanged, use the separate compatibility notes at the end of this document instead.

## Target Repository Shape

The new repo should look like this:

```text
flow-builder/
|- README.md
|- package.json
|- tsconfig.json
|- docs/
|- scripts/
|- src/
|  |- actions/
|  |- catalog/
|  |- composites/
|  |- core/
|  |- examples/
|  |- index.ts
|- tests/
```

It should not include:

- `src/consumers/connect-mvp/`
- repo-root `generated-flows/`
- `connect-mvp` CDK or deployment code

## Exact Copy Set

Copy these files and folders into the new standalone repo.

### Copy At Repo Root

- `flow-builder/README.md`
- `flow-builder/package.json`
- `flow-builder/tsconfig.json`

### Copy Docs

- `flow-builder/docs/connect-action-catalog.md`
- `flow-builder/docs/connect-action-coverage-matrix.md`
- `flow-builder/docs/library-coverage-roadmap.md`
- `flow-builder/docs/package-first-development.md`
- `flow-builder/docs/portability-extraction-plan.md`
- `flow-builder/docs/runbook.md`
- `flow-builder/docs/standalone-extraction-checklist.md`

### Copy Scripts

- `flow-builder/scripts/clean-dist.mjs`
- `flow-builder/scripts/render-action-catalog.mjs`

### Copy Portable Source Surface

- `flow-builder/src/index.ts`
- `flow-builder/src/actions/`
- `flow-builder/src/catalog/`
- `flow-builder/src/composites/`
- `flow-builder/src/core/`

### Copy Portable Examples

- `flow-builder/src/examples/branching-on-input.ts`
- `flow-builder/src/examples/case-profile-operations.ts`
- `flow-builder/src/examples/channel-analytics.ts`
- `flow-builder/src/examples/check-routing.ts`
- `flow-builder/src/examples/guided-wait-transfer.ts`
- `flow-builder/src/examples/operator-controls.ts`
- `flow-builder/src/examples/outbound-call-progress.ts`
- `flow-builder/src/examples/task-routing-loop.ts`

### Copy Package Tests

- `flow-builder/tests/actions.test.mjs`
- `flow-builder/tests/catalog.test.mjs`
- `flow-builder/tests/registry.test.mjs`

## Exact Exclusion Set

Do not copy these files into the standalone repo.

### Exclude Repo-Specific Consumer Code

- `flow-builder/src/consumers/connect-mvp/`

That excludes:

- `flow-builder/src/consumers/connect-mvp/index.ts`
- `flow-builder/src/consumers/connect-mvp/generate.ts`
- `flow-builder/src/consumers/connect-mvp/generated-flows.ts`
- `flow-builder/src/consumers/connect-mvp/composites/`
- `flow-builder/src/consumers/connect-mvp/factories/`

### Exclude Repo-Specific Examples

- `flow-builder/src/examples/mvp-inbound-voice.ts`
- `flow-builder/src/examples/mvp-inbound-chat.ts`
- `flow-builder/src/examples/mvp-full-service-voice.ts`

### Exclude Repo-Root Generated Artifacts

- `generated-flows/`

### Exclude Repo-Specific Golden Verification

- `flow-builder/tests/verify-generated-flows.mjs`

Reason:

- it assumes generated flow files exist at repo root
- it validates the current `connect-mvp` generated templates, not the portable package itself

## Required File Edits After Copy

After copying, make these edits in the new repo before running validation.

### 1. Update `package.json`

Edit:

- `name`
- `private`
- `description`

Recommended changes:

- rename the package from `connect-mvp-flow-builder` to a repo-agnostic package name
- update the description so it no longer references `connect-mvp`

### 2. Remove Repo-Specific Scripts

Remove these scripts from `package.json`:

- `generate`
- `verify:golden`
- `example:chat`
- `example:voice`
- `example:full-service`

Reason:

- they depend on excluded `connect-mvp` consumer files

### 3. Keep These Scripts

Keep these scripts:

- `build`
- `check`
- `test`
- `example:branching`
- `example:checks`
- `example:guided`
- `example:controls`
- `example:analytics`
- `example:outbound`
- `example:cases`
- `example:tasks`

### 4. Update The `test` Script

Change the `test` script so it no longer runs `tests/verify-generated-flows.mjs`.

Recommended standalone `test` script:

```json
"test": "npm run build && node --test ./tests/*.test.mjs"
```

### 5. Update The README

Remove or rewrite any sections that still describe:

- `connect-mvp` as the primary consumer
- repo-root `generated-flows/`
- `npm run generate`
- `mvp-*` examples as part of the standalone package surface

## Step-By-Step Extraction Procedure

Use this exact sequence.

### Step 1. Create The New Repo

Create an empty repo and make its root the future package root.

Target:

```text
new-repo-root/
```

### Step 2. Copy The Portable File Set

Copy only the files and folders listed in:

- `Exact Copy Set`

Do not copy the files listed in:

- `Exact Exclusion Set`

### Step 3. Edit `package.json`

Make the required script and metadata edits:

- rename the package
- remove repo-specific scripts
- update the `test` script

### Step 4. Edit `README.md`

Make the README describe:

- a standalone Amazon Connect flow-authoring library
- portable examples
- package-level tests

Make it stop describing:

- `connect-mvp` consumer generation
- repo-root generated flow output

### Step 5. Install Dependencies

From the new repo root:

```bash
npm install
```

### Step 6. Run Typecheck

```bash
npm run check
```

Expected result:

- no TypeScript errors

### Step 7. Run Package Tests

```bash
npm run test
```

Expected result:

- registry tests pass
- action tests pass
- catalog tests pass

### Step 8. Run Portable Examples

Run these:

```bash
npm run example:branching
npm run example:checks
npm run example:guided
npm run example:controls
npm run example:analytics
npm run example:outbound
npm run example:cases
npm run example:tasks
```

Expected result:

- each example emits valid Connect flow JSON

## Acceptance Criteria

The standalone extraction is complete when all of these are true:

- the new repo root builds with `npm run build`
- the new repo root typechecks with `npm run check`
- the new repo root passes tests with `npm run test`
- no source files import from `src/consumers/connect-mvp/`
- no source files assume a repo-root `generated-flows/` directory
- the README no longer describes `connect-mvp` as a required consumer
- the package can be understood as a repo-agnostic Amazon Connect flow-authoring library

## Fast Validation Commands

Use these after extraction:

```bash
npm install
npm run check
npm run test
npm run example:branching
npm run example:cases
```

If those pass, the extraction is usually structurally sound.

## Compatibility Copy Mode

If you want a near-zero-change copy instead of a clean standalone extraction, you can also copy:

- the entire `flow-builder/` folder
- the repo-root `generated-flows/` folder

Into a new repo shaped like:

```text
new-repo/
|- flow-builder/
|- generated-flows/
```

That compatibility mode preserves the current `connect-mvp` consumer behavior more closely, but it is not the recommended standalone package architecture because it keeps repo-layout assumptions and repo-specific consumer code.
