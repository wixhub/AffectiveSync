# Angular Best Practices (Signals & Standalone Architecture)

- Use Standalone Components (`standalone: true`).
- Use Angular Signals for reactive state management (`signal()`, `computed()`, `linkedSignal()`).
- Use modern template control flow (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`).
- Inject dependencies using the `inject()` function instead of constructor injection.
- Keep components focused on UI logic; delegate business logic to `@Injectable({ providedIn: 'root' })` services.
- Write strict TypeScript code without using `any`.
- Keep code comments and variable names in English.
