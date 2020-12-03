"use strict";
import { html, BIND, COMPONENT } from "../new_modules/HTML.js";
import { FETCH, STORE, ROUTER, BACK } from "../new_modules/STORE.js";


COMPONENT("App", () => {
  const colorClasses = ["primary", "secondary", "tertiary", "quaternary"];
  //
  let SUM = 0;
  let START = performance.now();

  //  hook STORE
  const LIST = STORE([]);
  const TIME = STORE(0);
  const MEMORY_1 = STORE(0);
  const MEMORY_2 = STORE(0);
  const UPDATE_TIME = STORE(0);
  const UPDATE = STORE(
    0,
    // afterUpdate
    () => {
      UPDATE_TIME.value = ((performance.now() - START) / 1000).toFixed(3);
    }
  );

  const changeFn = ({ target }) => {
    START = performance.now();
    const textValue = target.value;
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
      returnArr.push({
        style: `height: ${height}px; width: ${width}px;`,
        class: `dot ${color}`,
      });
    }
    LIST.value = returnArr;
  };

  setInterval(() => {
    MEMORY_1.value =
      "Memory :" +
      Math.round(window.performance.memory.usedJSHeapSize / 1000000) +
      "MB";
  }, 100);
  setInterval(() => {
    MEMORY_2.value =
      "Total Memory :" +
      Math.round(window.performance.memory.totalJSHeapSize / 1000000) +
      "MB";
  }, 100);

  return html`
    <div class="container"></div>
    <div class="my-input">
      <div class="progress"></div>
      <input
        type="text"
        ${{
          input: changeFn,
        }}
      />
      <div class="memory">${MEMORY_1}</div>
      <div class="memory">${MEMORY_2}</div>
      <div class="memory">
        ${TIME.sub((time) => {
          return "Create Sec : " + time + `(${SUM})`;
        })}
      </div>
      <div class="memory">Update Sec : ${UPDATE_TIME}</div>
      <button
        ${{
          click() {
            START = performance.now();
            UPDATE.value++;
          },
        }}
      >
        업데이트
      </button>
    </div>
    <div id="bowl">
      ${LIST.sub(
        () => (prop) => html`<div ${{ style: prop.style, class: prop.class }}>
          <div>${UPDATE}</div>
        </div>`,
        // afterUpdate
        (data) => {
          SUM = data.length;
          TIME.value = ((performance.now() - START) / 1000).toFixed(3);
        }
      )}
    </div>

    

    <!-- 
      
     
      // example
      // COMPONENT("List", ({CONTEXT}) => html`list component`);
      <List />

      // example
      // DOM controller
      // no id
      // no document.getElementById('???')
      // no document.querySelector('???')
      <div ${{
      callback({ target }) {
        UPDATE.sub((num) => {
          target.style.top = `${num}px`;
        });
      },
      }}>
      ${UPDATE}
      </div>
      <button ${{
      click({ target }) {
        UPDATE.value++;
      },
      }}></button> -->

    
  `;
});
