# Affective Synchronization

This is an Angular-based demo app that analyzes facial affect from video streams and synchronizes affective data with an interactive timeline. It includes services for face analysis, video processing and timeline synchronization, along with a minimal UI for visualization and playback.

## Features

- **Client-Side AI & Computer Vision:** Integrates MediaPipe Tasks Vision (`FaceLandmarker`) directly in the browser to process video frames frame-by-frame.

- **Modern Angular Reactivity:** Built with Angular Signals (`signal`, `computed`) for high-performance, fine-grained state management.

- **Interactive Visualization:** Synchronizes HTML5 video playback with Apache ECharts timelines using dynamic vertical playhead markers.

- **Memory-Safe Architecture:** Handles dynamic Blob/File object URL cleanup to prevent memory leaks during video uploads.

## Project structure (high level)

- `src/app` — Application entry and routes

- `src/app/core/services` — Core business logic and state

- `src/app/core/models` — TypeScript models and typed interfaces

- `src/app/features/dashboard` — Dashboard component, chart configurations and UI templates

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

## Contributing

Contributions are welcome. Open an issue or submit a pull request. Keep changes small and focused; add tests for new behavior when possible.

## License

This repository is licensed under the terms in the `LICENSE` file.

## Contact

If you have questions about the project, open an issue or contact the maintainers via the repository.
