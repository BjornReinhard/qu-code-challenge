# Qu Code Challenge

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Project Structure Overview

### Assets

- **assets/main.css**: Main stylesheet.
- **assets/reset.css**: CSS reset.

### Components

Reusable UI components:

- **AppLayout.vue**: Main layout wrapper.
- **BasicPagination.vue**: Pagination component.
- **Rating.vue**: Star rating component.

#### `components/GridItems/`

- **GridItems.vue**: Container for displaying a grid of items.
- **GridItem.vue**: Individual item in the grid.

#### `components/icons/`

SVG icon components:
- **StarFilledIcon.vue**
- **StarOutlinedIcon.vue**
- **ArrowRightIcon.vue**
- **RemoveJokeIcon.vue**
- **SortingOrderIcon.vue**

### Views

Page-level components and their subcomponents.

#### `views/Home/`

- **HomeView.vue**: Main view for the home page.

##### `views/Home/components/`

- **HeaderControls.vue**: Controls for filtering/sorting jokes.
- **JokeItem.vue**: Displays a single joke.
- **JokesGrid.vue**: Grid layout for jokes.

##### `views/Home/stores/`

- **useJokesStore.ts**: Pinia store for managing jokes state.

### Services

Business logic and API communication:

- **http.service.ts**: HTTP client abstraction.
- **env.service.ts**: Environment variable handling.

### Stores

Global state management (Pinia):

- **usePaginationStore.ts**: Store for pagination state.

### Router

- **router/index.ts**: Vue Router configuration.

### Models

- **Joke.ts**: TypeScript model/interface for jokes.

### Utils

Utility functions and tests:

- **number.utils.ts**: Number formatting utilities.
- **number.utils.spec.ts**: Unit tests for number utilities.
