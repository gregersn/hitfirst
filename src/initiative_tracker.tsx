import "preact/debug";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

import { Combatants } from "./combatants";
import { InitiativeList } from "./initiativelist";
import { storageAvailable } from "./storage";


const App = () => {
  let combatantList = [
    { name: "Fighter", actions: 1 },
    { name: "Magician", actions: 1 },
    { name: "Hunter", actions: 1 },
    { name: "Bard", actions: 1 },
    { name: "Orc 1", actions: 1 },
    { name: "Orc 2", actions: 1 },
    { name: "Orc chief", actions: 2 },
  ];

    if(storageAvailable("localStorage")) {
        if(!localStorage.getItem("combatantList")) {
            localStorage.setItem("combatantList", JSON.stringify(combatantList))
        }

        combatantList = JSON.parse(localStorage.getItem("combatantList")!);

    }

  return (
    <div className="container text-center">
      <div className="row align-items-start">
        <div className="col">
          <InitiativeList combatants={combatantList} shift={true} />
        </div>
        <div className="col">
          <Combatants combatants={combatantList} />
        </div>
      </div>
    </div>
  );
};

const domContainer = document.getElementById("initiativeTracker");
const root = ReactDOMClient.createRoot(domContainer!);
root.render(App());
