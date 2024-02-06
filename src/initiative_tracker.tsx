import * as React from "react";
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client';

import { Combatants } from './combatants';
import { InitiativeList } from "./initiativelist";

const combatantList = [
    {name: "Ivia", actions: 1}, 
    {name: "Mogge", actions: 1}, {name: "Vidsmyge", actions: 1}, {name: "Vilje", actions: 1}];

const App = () => <div className="container text-center">
    <div className="row align-items-start">
        <div className="col">
            <InitiativeList combatants={combatantList} shift={true} />
        </div>
        <div className="col">
            <Combatants combatants={combatantList} />
        </div>
    </div>
</div>;

const domContainer = document.getElementById("initiativeTracker");
const root = ReactDOMClient.createRoot(domContainer!);
root.render(App());
