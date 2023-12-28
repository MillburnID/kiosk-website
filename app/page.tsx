// "use client";
import styles from "./page.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";
import FilterComponent from "./components/FilterComponent";
import SignOutComponent from "./components/SignOutComponent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import React from "react";

export default async function Home({ params, searchParams }) {
  const session = await getServerSession(authOptions);
  // console.log(data);
  console.log(session);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const page = parseInt(searchParams.page ?? "0", 10);
  console.log(page);
  const pageSize = 5;
  const data = await getData(searchParams);

  return (
    <main className={styles.recordsWrapper}>
      <div className={styles.header}>
        <h1>Kiosk Records</h1>
        <SignOutComponent />
      </div>
      <FilterComponent
        values={[
          { paramName: "", displayName: "Filter By", type: "" },
          { paramName: "num", displayName: "Number", type: "number" },
          { paramName: "id", displayName: "Student ID", type: "number" },
          {
            paramName: "prev_status",
            displayName: "Previous Status",
            type: "number",
          },
          {
            paramName: "new_status",
            displayName: "New Status",
            type: "number",
          },
          { paramName: "kiosk_name", displayName: "Kiosk Name", type: "text" },
        ]}
      />
      <div className={styles.records}>
        <table>
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Student ID</th>
              <th scope="col">Previous Status</th>
              <th scope="col">New Status</th>
              <th scope="col">Time</th>
              <th scope="col">Kiosk Name</th>
            </tr>
          </thead>
          <tbody>
            {data.records.map((record) => (
              <tr key={record.number}>
                <td>{record.number}</td>
                <td>{record.id}</td>
                <td>{record.prev_status}</td>
                <td>{record.new_status}</td>
                <td>
                  {new Date(record.time).toLocaleString("en-US", {
                    timeZone: "America/New_York",
                  })}
                </td>
                <td>{record.kiosk_name}</td>
              </tr>
            ))}
            {[...Array(pageSize - data.records.length)].map((_, i) => (
              <tr key={i} className={styles.disabled}>
                {[...Array(6)].map((_, i) => (
                  <td key={i}>N/A</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>
                <nav>
                  <div>
                    <p>
                      Showing <span>{page * pageSize + 1}</span> to{" "}
                      <span>{(page + 1) * pageSize}</span> of{" "}
                      <span>{data.count}</span> results
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/?page=${page - 1}`}
                      className={page <= 0 ? styles.disabled : ""}
                    >
                      {" "}
                      Previous{" "}
                    </Link>
                    <Link
                      href={`/?page=${page + 1}`}
                      className={
                        page + 1 * pageSize >= data.count ? styles.disabled : ""
                      }
                    >
                      {" "}
                      Next{" "}
                    </Link>
                  </div>
                </nav>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}

async function getData(searchParams) {
  const page = await fetch(
    `http://localhost:8080/listRecords?${new URLSearchParams(
      searchParams
    ).toString()}`
  );
  const count = await fetch(`http://localhost:8080/records?${new URLSearchParams(searchParams).toString()}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!page.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch page");
  }
  if (!count.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch count");
  }

  return {
    records: await page.json(),
    count: (await count.json()).count,
  };
}
