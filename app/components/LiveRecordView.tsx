"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./LiveRecordView.module.css";

export const isBrowser = typeof window !== "undefined";
export const ws = isBrowser ? new WebSocket("ws://localhost:8080/liveRecords") : null;

export default function LiveRecordView() {
  const [records, setRecords] = useState([]);

  // (Optional) Open a connection on mount
  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };
    ws.onmessage = (event) => {
      console.log(event.data);
      setRecords((records) => JSON.parse(event.data));
    };
  }, []);

  return (
    <main className={styles.liveGrid}>
      {records.map((record) => (
        <div key={record.number} className={styles.record}>
          <p>
            <span>{record.id} - </span>
            <span className={styles[record.prev_status == record.new_status ? "failed" : record.prev_status == 0 ? "exiting" : "entering"]}>
              {record.prev_status == record.new_status ? "Failed" : record.prev_status == 0 ? "Exiting" : "Entering"}
            </span>
            <span>
              {" "}
              -{" "}
              {new Date(record.date).toLocaleTimeString("en-US", {
                timeZone: "America/New_York",
              })}
            </span>
          </p>
          <p>{record.kiosk_name}</p>
        </div>
      ))}
    </main>
  );
  // return <p> LiveRecordView </p>;
}
