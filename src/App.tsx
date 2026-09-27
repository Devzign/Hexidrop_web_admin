import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PermissionsProvider } from "@/lib/permissions";
import { AppRouter } from "@/router/AppRouter";
import { Toaster } from "@/components/shared/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PermissionsProvider>
        <AppRouter />
        <Toaster position="top-right" richColors />
      </PermissionsProvider>
    </QueryClientProvider>
  );
}

export default App;
