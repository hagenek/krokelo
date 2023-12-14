import {
  Form,
  useLoaderData
} from "/build/_shared/chunk-QVX36L3Y.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-PHWDHGEO.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_index.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1702558366719.3445";
}
var meta = () => {
  return [{
    title: "Very cool app | Remix"
  }, {
    property: "og:title",
    content: "Very cool app"
  }, {
    name: "description",
    content: "This app is the best"
  }];
};
function Index() {
  _s();
  const {
    players
  } = useLoaderData();
  const [player1, setPlayer1] = (0, import_react2.useState)("");
  const [player2, setPlayer2] = (0, import_react2.useState)("");
  const [winner, setWinner] = (0, import_react2.useState)("");
  const toggleDarkMode = () => {
    if (localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "dark";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `container dark:bg-gray-800 dark:text-white mx-auto p-4 max-w-2xl`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: toggleDarkMode, className: "mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded", children: "Toggle Dark Mode" }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold text-center mb-6 dark:text-white", children: "Krokinole ELO List" }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 92,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-col justify-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", { className: "mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", { className: "dark:text-white", children: "How to Use" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 95,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-3 dark:text-white", children: "How to use:" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 97,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mb-3", children: "Enter the names of the players and select the winner. The ELOs will be updated automatically." }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 98,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mb-3", children: "If a player is not in the list, enter their name and submit the form. They will be added to the list and their ELO will be set to 1000." }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 101,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mb-3", children: "If you want to see the ELO history for a player, click on their name in the table below." }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 104,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 96,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 94,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: "https://i.ibb.co/kB8pCL3/DALL-E-2023-12-14-13-12-01-Create-a-logo-for-a-Crokinole-match-recording-application-with-a-1960s-vi.png", alt: "man-pushing-krokinole-stone-uphill", className: "w-1/2" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 111,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "player1", value: player1, onChange: (e) => setPlayer1(e.target.value), className: "border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white", placeholder: "Player 1" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 115,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "player2", value: player2, onChange: (e) => setPlayer2(e.target.value), className: "border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white", placeholder: "Player 2" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 116,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "winner", value: winner, onChange: (e) => setWinner(e.target.value), className: "border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Select the Winner" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 119,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: player1, children: player1 }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 120,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: player2, children: player2 }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 121,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 118,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "m-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded", children: "Submit Result" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 123,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 113,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-semibold mb-3 dark:text-white", children: "Players:" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "min-w-full table-auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2 dark:text-white", children: "Name" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 131,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2 dark:text-white", children: "Wins" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 132,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2 dark:text-white", children: "ELO" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 133,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 130,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: players.sort((a, b) => b.currentELO - a.currentELO).map((player) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "border-t dark:border-gray-700 text-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-4 py-2 font-semibold dark:text-white", children: player.name }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 138,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-4 py-2 align-middle text-center dark:text-white", children: player.matchesAsWinner.length }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 139,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-4 py-2 align-middle text-center dark:text-white", children: player.currentELO }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 140,
            columnNumber: 17
          }, this)
        ] }, player.id, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 137,
          columnNumber: 80
        }, this)) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 136,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 93,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 88,
    columnNumber: 10
  }, this);
}
_s(Index, "EjE4fJwL7NSCFwj0CUmIV1TPEEs=", false, function() {
  return [useLoaderData];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default,
  meta
};
//# sourceMappingURL=/build/routes/_index-PKYNYG7L.js.map
