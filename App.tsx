
import React, { Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';

const Dashboard = React.lazy(() => import('./components/Dashboard'));

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<LoadingScreen />}>
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default App;
