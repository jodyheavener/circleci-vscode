import clsx from "clsx";
import React from "react";
import { useThemeObserver } from "../../lib/theme-observer";
import { TestDetails } from "../../lib/types";
import styles from "./index.module.css";
import { ReactComponent as StatusSuccess } from "./status-check.svg";
import { ReactComponent as StatusFailed } from "./status-exclaim.svg";
import { ReactComponent as StopWatch } from "./stopwatch.svg";

// function linkFilePaths(value: string, vscode: any): ReactNodeArray {
//   return reactStringReplace(value, FILE_PATH_REGEX, (match, i) => {
//     const [path, line, character] = match.split(":");

//     return (
//       <>
//         /home/circleci/project/
//         <a
//           key={i}
//           className="open-file-link"
//           onClick={() => {
//             vscode.postMessage({
//               event: constants.OPEN_FILE_WEBVIEW_EVENT,
//               data: {
//                 path,
//                 line: parseInt(line) - 1,
//                 character: parseInt(character) - 1,
//               },
//             });
//           }}
//         >
//           {match}
//         </a>
//       </>
//     );
//   });
// }

const Result = ({ test }: { test: TestDetails }): JSX.Element => {
  const theme = useThemeObserver();

  return (
    <div className={clsx(styles.container, theme === "dark" && styles.darkBg)}>
      <div className={styles.main}>
        <p className={styles.name}>
          {test.result === "success" && <StatusSuccess />}
          {test.result === "failure" && <StatusFailed />}

          {test.name}
        </p>

        <span className={styles.timer}>
          {test.run_time}
          <StopWatch />
        </span>
      </div>

      {test.result === "failure" && test.message && (
        <details className={styles.errorContainer}>
          <summary className={styles.errorSummary}>Error details...</summary>
          <code className={styles.errorContent}>
            {test.message.split("\n").map((text, index) => (
              <React.Fragment key={`${text}-${index}`}>
                {text}
                <br />
              </React.Fragment>
            ))}
          </code>
        </details>
      )}
    </div>
  );
};

export default Result;
