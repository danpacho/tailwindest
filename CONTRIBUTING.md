# How to Contribute 🧐

Thanks for your interest in contributing to tailwindest package :)! Here are a few general guidelines on contributing and
reporting bugs that I ask you to review. Following these guidelines helps to communicate that you respect the time of the contributors managing and developing this open source project.

## Reporting Issues 🌎

Before reporting a new issue, please ensure that the issue was not already reported or fixed by searching through issues list

When creating a new issue, please be sure to include a **title and clear description**, as much relevant information as
possible, and, if possible, a test case.

## Sending Pull Requests 🔮

Before sending a new pull request, take a look at existing pull requests and issues to see if the proposed change or fix has been discussed in the past, or if the change was already implemented but not yet released.

We expect new pull requests to include `test` code for any affected behavior, and, as we follow semantic versioning, we may reserve breaking changes until the next major version release.

### Setup the project before contributing 🥽

#### Prerequisites

-   [Node.js](https://nodejs.org) >= `v18`
-   [pnpm](https://pnpm.io/)

### Project Structure 📖

The project is structured as follows:

-   `packages/` - The main source code of the `tailwindest`
-   `packages/core` - The core logic of the `tailwindest`
-   `packages/types` - The `tailwindcss` type definitions

#### Installation

1. Clone the repo

```bash
git clone https://github.com/danpacho/tailwindest.git
```

2. Install dependencies

```bash
pnpm i
```

3. Build the project

```bash
pnpm build
```

4. Run test code while developing

```bash
pnpm test:dev
```

5. Run test and bench before sending a pull request

```bash
pnpm test:prepublish
```

## Other Ways to Contribute 😎

We welcome anyone that wants to contribute to tailwindest to triage and reply to open issues to help troubleshoot and fix existing bugs.
Here is what you can do:

-   Help ensure that existing issues follow the recommendations from the _[Reporting Issues](#reporting-issues-🌎)_ section,
    providing feedback to the issue's author on what might be missing, instructions and code samples.
-   Review existing pull requests, and testing patches against real existing applications that use Rainbow Sprinkles.
-   Write a test, or add a missing test case to an existing test.

Thanks again for your interest on contributing to tailwindest project 🦦!
