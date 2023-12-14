var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsxDEV } from "react/jsx-dev-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 51,
          columnNumber: 7
        },
        this
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 101,
          columnNumber: 7
        },
        this
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});

// app/tailwind.css
var tailwind_default = "/public/_assets/tailwind-6NZJCLFS.css";

// app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default }
];
function App() {
  return /* @__PURE__ */ jsxDEV2("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 22,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 23,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 24,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 25,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 21,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { className: "dark:bg-gray-800", children: [
      /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 28,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 29,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 30,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV2(LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 31,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 27,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  action: () => action,
  default: () => Index,
  loader: () => loader,
  meta: () => meta
});
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";

// app/services/playerService.ts
import EloRank from "elo-rank";

// app/prismaClient.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();

// app/services/playerService.ts
var elo = new EloRank(30), getPlayers = async () => {
  let players = await prisma.player.findMany({
    include: {
      matchesAsWinner: !0,
      matchesAsLoser: !0,
      eloLogs: !0
    }
  });
  return console.log(players), players;
}, createPlayer = async (name) => await prisma.player.create({
  data: {
    name,
    currentELO: 1e3
    // Starting ELO rating
  }
}), findPlayerByName = async (name) => await prisma.player.findUnique({
  where: {
    name
  }
}), updateELO = async (playerId, elo2) => await prisma.player.update({
  where: {
    id: playerId
  },
  data: {
    currentELO: elo2
  }
}), recordMatch = async (winnerId, loserId, winnerELO, loserELO) => await prisma.match.create({
  data: {
    winnerId,
    loserId,
    winnerELO,
    loserELO
  }
}), logELO = async (playerId, elo2) => await prisma.eLOLog.create({
  data: {
    playerId,
    elo: elo2
  }
}), calculateNewELOs = (currentELOPlayer1, currentELOPlayer2, player1IsWinner) => {
  let player1Score = player1IsWinner ? 1 : 0, player2Score = player1IsWinner ? 0 : 1, expectedScorePlayer1 = elo.getExpected(currentELOPlayer1, currentELOPlayer2), expectedScorePlayer2 = elo.getExpected(currentELOPlayer2, currentELOPlayer1), newELOPlayer1 = elo.updateRating(expectedScorePlayer1, player1Score, currentELOPlayer1), newELOPlayer2 = elo.updateRating(expectedScorePlayer2, player2Score, currentELOPlayer2);
  return {
    newELOPlayer1,
    newELOPlayer2
  };
};

// app/routes/_index.tsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var meta = () => [
  { title: "Very cool app | Remix" },
  {
    property: "og:title",
    content: "Very cool app"
  },
  {
    name: "description",
    content: "This app is the best"
  }
], loader = async () => ({ players: await getPlayers() }), action = async ({ request }) => {
  let formData = await request.formData(), player1Name = formData.get("player1"), player2Name = formData.get("player2"), winner = formData.get("winner");
  if (typeof player1Name == "string" && typeof player2Name == "string" && typeof winner == "string") {
    let player1 = await findPlayerByName(player1Name) || await createPlayer(player1Name), player2 = await findPlayerByName(player2Name) || await createPlayer(player2Name), player1IsWinner = player1Name.trim().toLowerCase() === winner.trim().toLowerCase(), { newELOPlayer1, newELOPlayer2 } = calculateNewELOs(player1.currentELO, player2.currentELO, player1IsWinner), winnerId = player1IsWinner ? player1.id : player2.id, loserId = player1IsWinner ? player2.id : player1.id;
    await recordMatch(winnerId, loserId, newELOPlayer1, newELOPlayer2), await updateELO(player1.id, newELOPlayer1), await logELO(player1.id, newELOPlayer1), await updateELO(player2.id, newELOPlayer2), await logELO(player2.id, newELOPlayer2);
  }
  return null;
};
function Index() {
  let { players } = useLoaderData(), [player1, setPlayer1] = useState(""), [player2, setPlayer2] = useState(""), [winner, setWinner] = useState("");
  return /* @__PURE__ */ jsxDEV3("div", { className: "container dark:bg-gray-800 dark:text-white mx-auto p-4 max-w-2xl", children: [
    /* @__PURE__ */ jsxDEV3("button", { onClick: () => {
      localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches ? (document.documentElement.classList.add("dark"), localStorage.theme = "light") : (document.documentElement.classList.remove("dark"), localStorage.theme = "dark");
    }, className: "mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded", children: "Toggle Dark Mode" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV3("h1", { className: "text-3xl font-bold text-center mb-6 dark:text-white", children: "Krokinole ELO List" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "flex-col justify-center", children: [
      /* @__PURE__ */ jsxDEV3("details", { className: "mb-4", children: [
        /* @__PURE__ */ jsxDEV3("summary", { className: "dark:text-white", children: "How to Use" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "dark:text-gray-400", children: [
          /* @__PURE__ */ jsxDEV3("h2", { className: "text-xl font-semibold mb-3 dark:text-white", children: "How to use:" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 114,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "mb-3", children: "Enter the names of the players and select the winner. The ELOs will be updated automatically." }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 115,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "mb-3", children: "If a player is not in the list, enter their name and submit the form. They will be added to the list and their ELO will be set to 1000." }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 118,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "mb-3", children: "If you want to see the ELO history for a player, click on their name in the table below." }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 121,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 113,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsxDEV3(
        "img",
        {
          src: "https://i.ibb.co/kB8pCL3/DALL-E-2023-12-14-13-12-01-Create-a-logo-for-a-Crokinole-match-recording-application-with-a-1960s-vi.png",
          alt: "man-pushing-krokinole-stone-uphill",
          className: "w-1/2"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 128,
          columnNumber: 11
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(Form, { method: "post", className: "mb-8", children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxDEV3(
            "input",
            {
              type: "text",
              name: "player1",
              value: player1,
              onChange: (e) => setPlayer1(e.target.value),
              className: "border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              placeholder: "Player 1"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 136,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV3(
            "input",
            {
              type: "text",
              name: "player2",
              value: player2,
              onChange: (e) => setPlayer2(e.target.value),
              className: "border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              placeholder: "Player 2"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 144,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV3(
          "select",
          {
            name: "winner",
            value: winner,
            onChange: (e) => setWinner(e.target.value),
            className: "border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
            children: [
              /* @__PURE__ */ jsxDEV3("option", { value: "", children: "Select the Winner" }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 159,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV3("option", { value: player1, children: player1 }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 160,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV3("option", { value: player2, children: player2 }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 161,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 153,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV3("button", { type: "submit", className: "m-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded", children: "Submit Result" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 163,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 134,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3("h2", { className: "text-2xl font-semibold mb-3 dark:text-white", children: "Players:" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 167,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3("table", { className: "min-w-full table-auto", children: [
        /* @__PURE__ */ jsxDEV3("thead", { children: /* @__PURE__ */ jsxDEV3("tr", { children: [
          /* @__PURE__ */ jsxDEV3("th", { className: "px-4 py-2 dark:text-white", children: "Name" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 171,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV3("th", { className: "px-4 py-2 dark:text-white", children: "Wins" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 172,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV3("th", { className: "px-4 py-2 dark:text-white", children: "ELO" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 173,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 170,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 169,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV3("tbody", { children: players.sort((a, b) => b.currentELO - a.currentELO).map((player) => /* @__PURE__ */ jsxDEV3("tr", { className: "border-t dark:border-gray-700 text-xl", children: [
          /* @__PURE__ */ jsxDEV3("td", { className: "px-4 py-2 font-semibold dark:text-white", children: player.name }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 179,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV3("td", { className: "px-4 py-2 align-middle text-center dark:text-white", children: player.matchesAsWinner.length }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 180,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV3("td", { className: "px-4 py-2 align-middle text-center dark:text-white", children: player.currentELO }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 181,
            columnNumber: 17
          }, this)
        ] }, player.id, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 178,
          columnNumber: 15
        }, this)) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 168,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 110,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 105,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/public/entry.client-WILUQYTG.js", imports: ["/public/_shared/chunk-IV7OGAU2.js", "/public/_shared/chunk-KMLLD62S.js", "/public/_shared/chunk-4K5OJQHQ.js", "/public/_shared/chunk-JU2RHFPP.js", "/public/_shared/chunk-YZDIWLZL.js", "/public/_shared/chunk-VZHD7BJN.js", "/public/_shared/chunk-QOLIIW62.js", "/public/_shared/chunk-WFR2G76K.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/public/root-4JXQQLHL.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/public/routes/_index-USIBUMPD.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "3fb2d5e2", hmr: { runtime: "/public/_shared/chunk-JU2RHFPP.js", timestamp: 1702560242445 }, url: "/public/manifest-3FB2D5E2.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1 }, publicPath = "/public/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
