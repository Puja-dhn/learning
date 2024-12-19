import React from "react";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import LoadingPage from "@/features/layout/LoadingPage";

function BoxLoader() {
  const loaderState = useAppSelector(({ loader }) => loader, shallowEqual);

  return <LoadingPage hidden={!loaderState.status} />;
}

export default BoxLoader;
