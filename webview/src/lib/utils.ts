// @ts-ignore
export const vscode = acquireVsCodeApi() as any;

export const postMessage = (type: string, data?: any) => {
  vscode.postMessage({ type, data });
};

export const interpolate = (
  value: string,
  replacements: { [key: string]: string | number }
): string =>
  Object.keys(replacements).reduce(
    (p, c) => p.split("{" + c + "}").join(String(replacements[c])),
    value
  );
