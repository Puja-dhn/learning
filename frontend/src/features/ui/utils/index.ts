import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";

function makeTypeChecker(elementType: string) {
  return (element: ReactElement) =>
    element &&
    element.props &&
    element.props.elementType &&
    element.props.elementType === elementType;
}

const isTab = makeTypeChecker("Tab");
const isTabList = makeTypeChecker("TabList");
const isTabPanel = makeTypeChecker("TabPanel");

function deepMap(children: ReactNode, callback: () => void) {
  return Children.map(children, (child): ReactNode => {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37

    if (
      child &&
      isValidElement(child) &&
      child.props &&
      child.props.children &&
      typeof child.props.children === "object"
    ) {
      // Clone the child that has children and map them too
      return cloneElement(child, {
        ...child.props,
        children:
          isTab(child) || isTabList(child) || isTabPanel(child)
            ? deepMap(child.props.children, callback)
            : child.props.children,
      });
    }

    return child;
  });
}

export { deepMap, isTab, isTabList, isTabPanel };
