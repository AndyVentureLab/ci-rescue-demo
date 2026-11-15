# CI Rescue Demo — Health-check failures should fail CI

A public, self-contained demonstration for our €89 CI Rescue Fix service. No paid customer or production environment is involved.

## Problem
A deployment health check can print a failure message while the calling script exits 0. A workflow then falsely reports success.

## Demo
- `src/health-check.mjs` treats unsuccessful responses or network errors as failures.
- Tests use only the Node.js built-in test runner and a local ephemeral HTTP server; no external URLs, cloud secrets or third-party dependencies.
- `.github/workflows/ci.yml` runs the automated suite on pull requests and pushes.

## Verify
```bash
npm test
```

## Scope of a real engagement
Confirm one affected workflow, inspect logs and permissions without copying secrets, agree acceptance criteria, propose a minimal change, validate tests, deliver a PR and a short handover. Live deployment is excluded unless separately agreed.

This demo is an illustration, not evidence of a previous paid assignment.