import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// Auth Components
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';

// Layout & Admin Components
import { AdminLayout } from './components/Layout/AdminLayout';

// Quiz Components
import { QuizTakePage } from './components/Quiz/QuizTakePage';
import { QuizListPage } from './components/Quiz/QuizListPage';
import { QuizResultsPage } from './components/Quiz/QuizResultsPage';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={QuizListPage} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/quiz/:id" component={QuizTakePage} />
            <Route path="/quiz/:id/results" component={QuizResultsPage} />
            
            {/* Admin Routes */}
            <Route path="/admin/:rest*">
              <AdminLayout />
            </Route>
            
            {/* 404 */}
            <Route>404 - Page Not Found</Route>
          </Switch>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;