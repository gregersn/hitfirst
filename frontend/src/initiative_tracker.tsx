import * as React from "react";
//import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client';

import { Combatants } from './combatants';
import { InitiativeList } from "./initiativelist";

const combatantList = ["Alven", "Ankan", "Draken", "Dvärgen", "Mannen", "Vargen"];

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

const GM = (websocket: WebSocket, game: string|null, secret: string|null) => {
    let responseHandler = websocket.addEventListener("message", ({data}) => {
        console.log(data);

    });
    console.log(responseHandler);

    if(game && secret) {
        const event = { type:"init", join: game, secret: secret};
        websocket.send(JSON.stringify(event));
    } else {
        const event = {type: "init"};
        websocket.send(JSON.stringify(event));
    }
return (<div className="row align-items-start">
        <div className="col">
            <InitiativeList combatants={combatantList} shift={true} />
        </div>
        <div className="col">
            <Combatants combatants={combatantList} />
        </div></div>);
}

const Player = (websocket: WebSocket, game: string|null) => {
    return (<div>Show the order, and list of combatants?</div>);
}

enum AppStates {
    Menu = 1,
    Player,
    GM
}
const websocket = new WebSocket("ws://localhost:8765/");

const App = (props: {}) => {
    const queryParams = new URLSearchParams(window.location.search);
    const state_parameter = queryParams.get("page");
    const battle_parameter = queryParams.get("battle");
    const secret_parameter = queryParams.get("secret");

    console.log(state_parameter);

    let content = <div></div>;
    switch(state_parameter) {
        case "GM":
            content = GM(websocket, battle_parameter, secret_parameter);
            break;
        case "player":
            content = Player(websocket, battle_parameter);
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
