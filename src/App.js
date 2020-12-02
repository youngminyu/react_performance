// import { render } from "@testing-library/react";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import "./App.css";

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

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
const updateContext = createContext(null);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Li = () => {
      const { UPDATE } = useContext(updateContext);
      return <div>{UPDATE}</div>;
    };

    const List = () => {
      let START = performance.now();

      const [LIST, setLIST] = useState([]);
      const [TIME, setTIME] = useState(0);
      const [MEMORY_1, setMEMORY_1] = useState(0);
      const [MEMORY_2, setMEMORY_2] = useState(0);

      const [UPDATE_TIME, setUPDATE_TIME] = useState(0);
      const [UPDATE, setUPDATE] = useState(0);
      const [SUM, setSUM] = useState(0);

      useEffect(() => {
        setSUM(LIST.length);
        setTIME(((performance.now() - START) / 1000).toFixed(3));
      }, [LIST]);

      useEffect(() => {
        setUPDATE_TIME(((performance.now() - START) / 1000).toFixed(3));
      }, [UPDATE]);

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

        for (let i = 0; i < counts; i++) {
          const color =
            colorClasses[Math.floor(Math.random() * colorClasses.length)];
          const styleObj = {
            height: `${height}px`,
            width: `${width}px`,
          };
          const classStr = `dot ${color}`;
          returnArr.push(
            <div key={i} style={styleObj} className={classStr}>
              <Li />
            </div>
          );
        }
        setLIST(returnArr);
      };

      const clickFn = (e) => {
        START = performance.now();
        setUPDATE(UPDATE + 1);
      };

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

      return (
        <updateContext.Provider value={{ UPDATE }}>
          <div>
            <div className="container"></div>
            <div className="my-input">
              <div className="progress"></div>
              <input type="text" onChange={changeFn} />
              <div className="memory">{MEMORY_1}</div>
              <div className="memory">{MEMORY_2}</div>
              <div className="memory">
                Create Sec : {TIME} ({SUM})
              </div>
              <div className="memory">Update Sec : {UPDATE_TIME}</div>
              <button onClick={clickFn}>업데이트</button>
            </div>
            <div id="bowl">{LIST}</div>
          </div>
        </updateContext.Provider>
      );
    };

    return (
      <div className="App">
        <List />
      </div>
    );
  }
}

export default App;
