import React from "react";

interface IProps {
  hidden?: boolean;
}

const defaultProps = {
  hidden: true,
};

function LoadingPage(props: IProps) {
  const { hidden } = props;
  const hiddenClass = hidden ? "  hidden" : " ";
  return (
    <div
      className={`w-full h-full absolute ${hiddenClass} top-0 left-0 z-10 flex flex-col  justify-center items-center transition-all ease-in-out delay-150  bg-white dark:bg-gray-800`}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="loader">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>

        <p className="mt-4 text-md font-medium text-blue-900 dark:text-gray-300">
          Loading Page. Please Wait....!
        </p>
      </div>
    </div>
  );
}

LoadingPage.defaultProps = defaultProps;
export default LoadingPage;
