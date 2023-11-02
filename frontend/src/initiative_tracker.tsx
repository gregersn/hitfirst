import * as React from "react";
//import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client';

import { Combatants } from './combatants';
import { InitiativeList } from "./initiativelist";

const combatantList = ["Alven", "Ankan", "Draken", "Dvärgen", "Mannen", "Vargen"];
const websocket = new WebSocket("ws://localhost:8765/");

function new_battle() {
    console.log(window.location.search);
    window.location.search = "page=GM";
}

const Menu = ()  => {
    return <div className="menu">
            <input id="gameIdInput" />
            <input id="gameSecretInput" /><button onClick={() => {console.log("Join");}} className="btn add">Join</button>
            <button onClick={new_battle} className="btn add">New</button>
    </div>;
};

const GM = (game: string|null, secret: string|null) => {
return (<div className="row align-items-start">
        <div className="col">
            <InitiativeList combatants={combatantList} shift={true} />
        </div>
        <div className="col">
            <Combatants combatants={combatantList} />
        </div></div>);
}

const Player = (game: string|null) => {
    return (<div>Show the order, and list of combatants?</div>);
}

enum AppStates {
    Menu = 1,
    Player,
    GM
}

const App = (props: {}) => { 
    const queryParams = new URLSearchParams(window.location.search);
    const state = queryParams.get("page");
    const battle = queryParams.get("battle");
    const secret = queryParams.get("secret");
    console.log(state);

    let content = <div></div>;
    switch(state) {
        case "GM":
            content = GM(battle, secret);
            break;
        case "player":
            content = Player(battle);
            break;
        case "menu":
        default:
            content = Menu();
    }
    
    return (<div className="container text-center">
        { content }
        </div>)
};

const domContainer = document.getElementById("initiativeTracker");
const root = ReactDOMClient.createRoot(domContainer!);
root.render(App({}));
