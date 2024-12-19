function removeJSONNull<T>(obj: T, replaceStr: string = ""): T {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (value === null ? replaceStr : value)),
  );
}

export default removeJSONNull;
export { removeJSONNull };
