import { render } from "@testing-library/react";
import React, { useState, Component, useEffect, useRef } from "react";
import "./App.css";

function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

let START;
let END;
let UPDATED = null;
let CREATED = null;

const Root = () => {
  const [LIST, setLIST] = useState([]);
  const [TIME, setTIME] = useState(0);
  const [MEMORY_1, setMEMORY_1] = useState(0);
  const [MEMORY_2, setMEMORY_2] = useState(0);

  const [UPDATE_TIME, setUPDATE_TIME] = useState(0);
  const [UPDATE, setUPDATE] = useState(0);

  const changeFn = (e) => {
    const colorClasses = ["primary", "secondary", "tertiary", "quaternary"];
    START = performance.now();
    const textValue = e.target.value;
    const length = textValue ? textValue.length : 0;
    const containerEl = document.querySelector(".container");
    const returnArr = [];

    const n = Math.min(Math.pow(length, 2), 1000);
    const height = containerEl.clientHeight / n;
    const width = containerEl.clientWidth / n;
    const counts = n * n;
    CREATED = counts;

    for (let i = 0; i < counts; i++) {
      const color =
        colorClasses[Math.floor(Math.random() * colorClasses.length)];
      // const styleStr = `height: ${height}px; width: ${width}px;`;
      const styleObj = {
        height: `${height}px`,
        width: `${width}px`,
      };
      const classStr = `dot ${color}`;
      returnArr.push(
        <div key={i} style={styleObj} className={classStr}>
          {UPDATE}
        </div>
      );
    }
    setLIST(returnArr);
  };

  useInterval(() => {
    const c = document.getElementById("bowl").children;
    if (CREATED === c.length) {
      END = performance.now();
      setTIME(((END - START) / 1000).toFixed(3));
      CREATED = null;
    }
  });

  setInterval(() => {
    const c = document.getElementById("bowl").children;
    const target = c[c.length - 1];

    if (target) {
      const text = target.innerText;
      if (UPDATED === +text) {
        END = performance.now();
        setUPDATE_TIME(((END - START) / 1000).toFixed(3));
        UPDATED = null;
      }
    }
  }, 1000);

  useInterval(() => {
    setMEMORY_1(
      "Memory :" +
        Math.round(window.performance.memory.usedJSHeapSize / 1000000) +
        "MB"
    );
  }, 100);

  useInterval(() => {
    setMEMORY_2(
      "Total Memory :" +
        Math.round(window.performance.memory.totalJSHeapSize / 1000000) +
        "MB"
    );
  }, 100);

  const clickFn = () => {
    START = performance.now();
    setUPDATE(UPDATE + 1);
    UPDATED = UPDATE;
  };

  return (
    <div>
      <div className="container"></div>
      <div className="progress"></div>
      <div className="my-input">
        <input type="text" onChange={changeFn} />
        <div className="memory">{MEMORY_1}</div>
        <div className="memory">{MEMORY_2}</div>
        <div className="memory">Create Sec : {TIME}</div>
        <div className="memory">Update Sec : {UPDATE_TIME}</div>
        <button onClick={clickFn}>업데이트</button>
      </div>
      <div id="bowl">{LIST}</div>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Root />
      </div>
    );
  }
}

export default App;
