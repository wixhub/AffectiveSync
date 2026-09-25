# Affective Synchronization

This is an Angular-based demo app that analyzes facial affect from video streams and synchronizes affective data with an interactive timeline. It includes a web worker for face analysis, services for video processing and timeline synchronization and a minimal UI for visualization and playback.

## Features

- Real-time face analysis running in a Web Worker
- Video processing and timeline synchronization services
- Simple dashboard UI for visualization and playback

## Prerequisites

- Node.js (LTS recommended)
- npm (or yarn/pnpm)

## Quick start

Install dependencies and run the dev server:

```bash
npm install
npm run start
```

Open http://localhost:4200 in your browser.

## Available scripts

- `npm run start` — Run development server (Angular dev server)
- `npm run build` — Build production bundles
- `npm run test` — Run unit tests

Use the corresponding `ng` commands if you prefer the Angular CLI directly.

## Project structure (high level)

- `src/app` — Application entry and routes
- `src/app/core/services` — Core services (`timeline-sync.service.ts`, `video-processor.service.ts`)
- `src/app/core/face-analyzer.worker.ts` — Web Worker performing face analysis
- `src/app/features` — Feature modules and UI (dashboard, powered page)

## Contributing

Contributions are welcome. Open an issue or submit a pull request. Keep changes small and focused; add tests for new behavior when possible.

## License

This repository is licensed under the terms in the `LICENSE` file.

## Contact

If you have questions about the project, open an issue or contact the maintainers via the repository.
