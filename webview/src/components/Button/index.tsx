import React from "react";
import styles from "./index.module.css";

const Button = ({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}): JSX.Element =>
  href ? (
    <a className={styles.button} {...{ href }}>
      {children}
    </a>
  ) : (
    <button className={styles.button} {...{ onClick }}>
      {children}
    </button>
  );

export default Button;
