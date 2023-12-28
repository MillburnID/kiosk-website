"use client";
import { useRouter } from "next/navigation";
import styles from "./AddKiosk.module.css";
import { useState } from "react";
import { access } from "fs";

export default function AddKiosk() {
  const router = useRouter();
  const [promptOpen, setPromptOpen] = useState(false);

  const [kioskName, setKioskName] = useState("");
  const [accessLevel, setAccessLevel] = useState(-1);
  const [privilege, setPrivilege] = useState(-1);
  const [direction, setDirection] = useState(0);
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(15);
  const [endHour, setEndHour] = useState(9);
  const [endMinute, setEndMinute] = useState(30);

  const reset = () => {
    setKioskName("");
    setAccessLevel(-1);
    setPrivilege(-1);
    setDirection(0);
    setStartHour(8);
    setStartMinute(15);
    setEndHour(9);
    setEndMinute(30);
  };

  const add = async () => {
    const searchParams = new URLSearchParams();
    if (kioskName.trim() === "") {
      alert("Kiosk name is required");
      return;
    }

    if (accessLevel === -1) {
      alert("Access level is required");
      return;
    }

    if (accessLevel < 1 || accessLevel > 8) {
      alert("Access level must be between 1 and 8");
      return;
    }

    if (privilege === -1) {
      alert("Privilege is required");
      return;
    }

    if (privilege < 1 || privilege > 8) {
      alert("Privilege must be between 1 and 8");
      return;
    }

    searchParams.set("kiosk_name", kioskName.trim());
    searchParams.set("access_level", accessLevel + "");
    searchParams.set("privilege", privilege + "");
    searchParams.set("direction", direction + "");
    searchParams.set("start_hour", startHour + "");
    searchParams.set("start_minute", startMinute + "");
    searchParams.set("end_hour", endHour + "");
    searchParams.set("end_minute", endMinute + "");

    // remove empty params
    let toDelete = [];
    searchParams.forEach((value, key) => {
      if (value == "") {
        toDelete.push(key);
      }
    });
    for (let key of toDelete) {
      searchParams.delete(key);
    }

    // enable cors

    const res = await fetch(
      `http://localhost:8080/createKiosk?${searchParams.toString()}`,
      {
        options: {
          mode: "cors",
        },
      }
    );

    if (res.status === 200) {
      reset();
      router.refresh();
    } else {
      alert("Error adding kiosk");
    }
  };

  return (
    <>
      <button
        className={styles.promptButton}
        onClick={() => setPromptOpen(true)}
      >
        +
      </button>
      {/* <div>{promptOpen ? "open" : "closed"}</div> */}
      {promptOpen ? (
        <div className={styles.prompt}>
          <div>
            <header>
              <h1>Add Kiosk</h1>
              <button
                onClick={() => {
                  setPromptOpen(false);
                  reset();
                }}
              >
                X
              </button>
            </header>
            <main>
              <form>
                <div>
                  <label>Kiosk Name</label>
                  <input
                    type="text"
                    value={kioskName}
                    onChange={(e) => setKioskName(e.target.value)}
                    placeholder="Kiosk Name"
                  />
                </div>
                <div>
                  <label>Access Level</label>
                  <input
                    type="number"
                    value={accessLevel}
                    min={1}
                    max={8}
                    step={1}
                    onChange={(e) => setAccessLevel(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label>Privilege</label>
                  <input
                    type="number"
                    value={privilege}
                    onChange={(e) => setPrivilege(parseInt(e.target.value))}
                  />
                </div>
                <div className={styles.direction}>
                  <label>Acceptance Direction</label>
                  <div>
                    <input
                      type="radio"
                      name="direction"
                      value={-1}
                      checked={direction === -1}
                      onChange={() => setDirection(-1)}
                      id="lessThan"
                    />
                    <label htmlFor="lessThan">Less Than or Equal To</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="direction"
                      value={0}
                      checked={direction === 0}
                      onChange={() => setDirection(0)}
                      id="equal"
                    />
                    <label htmlFor="equal">Equal To</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="direction"
                      value={1}
                      checked={direction === 1}
                      onChange={() => setDirection(1)}
                      id="greaterThan"
                    />
                    <label htmlFor="greaterThan">
                      Greater Than or Equal To
                    </label>
                  </div>
                </div>
                <div>
                  <div>
                    <label>Start Hour</label>
                    <input
                      type="number"
                      value={startHour}
                      min={0}
                      max={23}
                      step={1}
                      onChange={(e) => setStartHour(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Start Minute</label>
                    <input
                      type="number"
                      value={startMinute}
                      min={0}
                      max={59}
                      step={1}
                      onChange={(e) => setStartMinute(parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label>End Hour</label>
                    <input
                      type="number"
                      value={endHour}
                      min={0}
                      max={23}
                      step={1}
                      onChange={(e) => setEndHour(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>End Minute</label>
                    <input
                      type="number"
                      value={endMinute}
                      min={0}
                      max={59}
                      step={1}
                      onChange={(e) => setEndMinute(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </form>
            </main>
            <footer>
              <button onClick={reset} className={styles.reset}>
                Reset
              </button>
              <button onClick={add} className={styles.add}>
                Add
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
