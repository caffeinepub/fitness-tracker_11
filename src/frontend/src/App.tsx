import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import History from './pages/History';
import ExerciseLibraryPage from './pages/ExerciseLibrary';
import AuthGuard from './components/AuthGuard';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

const logWorkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log-workout',
  component: () => (
    <AuthGuard>
      <LogWorkout />
    </AuthGuard>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: () => (
    <AuthGuard>
      <History />
    </AuthGuard>
  ),
});

const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercises',
  component: () => (
    <AuthGuard>
      <ExerciseLibraryPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  logWorkoutRoute,
  historyRoute,
  exercisesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
