"use client";
import { signOut } from "next-auth/react";
import styles from "./SignOutComponent.module.css";

export default function Component() {
  return (
    <button
      className={styles.signOutButton}
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </button>
  );
}
