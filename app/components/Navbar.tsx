import Link from "next/link";
import styles from "./Navbar.module.css";
import React from "react";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <Link href="/home">Home</Link>
      <Link href="/live">Live</Link>
      <Link href="/">Record</Link>
      <Link href="/kiosks">Kiosks</Link>
    </div>
  );
}
