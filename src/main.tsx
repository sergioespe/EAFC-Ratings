import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, persisterClient } from './api/queryClient';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inicializar persistencia
persisterClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);