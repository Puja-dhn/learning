import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import "@/features/localization/config";
import App from "./App";
import store from "./store";

import ErrorBoundary from "@/features/errorhandler/ErrorBoundary";
import "@/assets/styles/index.scss";
import { BASENAME } from "./features/common/constants";
import LoadingApp from "./features/layout/LoadingApp";

const persistor = persistStore(store);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 30,
      staleTime: 1000 * 60 * 30,
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container as Element);
root.render(
  <ErrorBoundary screen="Application">
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={BASENAME}>
            <Suspense fallback={<LoadingApp />}>
              <App />
            </Suspense>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,
);
