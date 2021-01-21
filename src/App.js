import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import "./App.css";

const UpdateContext = createContext({
  update: () => {},
});

const App = () => {
  const startTimeRef = useRef(null);
  const containerRef = useRef(null);

  const [list, setList] = useState([]);
  const [update, setUpdate] = useState(0);

  return (
    <UpdateContext.Provider value={update}>
      <div>
        <div className="container" ref={containerRef} />
        <div className="my-input">
          <div className="progress" />
          <input
            type="text"
            onChange={(e) => {
              startTimeRef.current = performance.now();

              const colorClasses = [
                "primary",
                "secondary",
                "tertiary",
                "quaternary",
              ];

              const textValue = e.target.value;
              const length = textValue ? textValue.length : 0;
              const containerEl = containerRef.current;
              const returnArr = [];

              const n = Math.min(Math.pow(length, 2), 1000);
              const height = containerEl.clientHeight / n;
              const width = containerEl.clientWidth / n;
              const counts = n * n;

              for (let i = 0; i < counts; i++) {
                const color =
                  colorClasses[Math.floor(Math.random() * colorClasses.length)];

                returnArr.push({
                  style: { height: height, width: width },
                  class: `dot ${color}`,
                });
              }

              setList(returnArr);
            }}
          />
          <MemoryStatus
            data={list}
            update={update}
            startTimeRef={startTimeRef}
          />
          <button
            onClick={() => {
              startTimeRef.current = performance.now();
              setUpdate((prevValue) => prevValue + 1);
            }}
          >
            업데이트
          </button>
        </div>
        <div id="bowl">
          <List data={list} />
        </div>
      </div>
    </UpdateContext.Provider>
  );
};

const MemoryStatus = ({ data, update, startTimeRef }) => {
  const [time, setTime] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [updateTime, setUpdateTime] = useState(0);

  useEffect(() => {
    setTime(((performance.now() - startTimeRef.current) / 1000).toFixed(3));
  }, [data]);

  useEffect(() => {
    setUpdateTime(
      ((performance.now() - startTimeRef.current) / 1000).toFixed(3)
    );
  }, [update]);

  useInterval(
    useCallback(() => {
      setUsedMemory(
        "Memory :" +
          Math.round(window.performance.memory.usedJSHeapSize / 1000000) +
          "MB"
      );
      setTotalMemory(
        "Memory :" +
          Math.round(window.performance.memory.totalJSHeapSize / 1000000) +
          "MB"
      );
    }, []),
    100
  );

  return (
    <>
      <div className="memory">{usedMemory}</div>
      <div className="memory">{totalMemory}</div>
      <div className="memory">
        Create Sec : {time} ({data.length})
      </div>
      <div className="memory">Update Sec : {updateTime}</div>
    </>
  );
};

const List = ({ data }) =>
  data.map((item, i) => (
    <div key={i} style={item.style} className={item.class}>
      <ListItem />
    </div>
  ));

const ListItem = () => {
  const value = useContext(UpdateContext);
  return <div>{value}</div>;
};

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

export default App;
