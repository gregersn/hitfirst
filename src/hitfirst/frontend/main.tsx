import * as React from 'preact';
import * as ReactDOM from 'preact';


function sendActions(list: HTMLOListElement, websocket: WebSocket) {
    list.addEventListener("click", ({target}) => {
        const index: string = target!.dataset.index;
        if(index === undefined) return;

        const event = {
            type: "click",
            index: parseInt(index, 10)
        };
        websocket.send(JSON.stringify(event));
    });
};

function render_list(listElement, order: string[]) {
    const new_children = order.map((info, index) => {
        const el = document.createElement('li');
        el.innerText = info;
        el.setAttribute('data-index', index.toString());
        return el;
    });
    console.debug(new_children);
    listElement.replaceChildren(...new_children);
}

type JoinEvent = {
    type: string,
    battle?: string | null,
    secret?: string | null
}

function initGame(websocket: WebSocket) {
    websocket.addEventListener("open", () => {
        const params = new URLSearchParams(window.location.search);

        const event: JoinEvent = { type: "init" };

        if(params.has("battle")) {
            event.battle = params.get("battle");
        }

        if(params.has("secret")) {
            event.secret = params.get("secret");
        }

        console.debug("Sending init", JSON.stringify(event));
        
        websocket.send(JSON.stringify(event));
    });
}

let state = 0;


function recieveActions(list, websocket: WebSocket) {
    websocket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);

        switch(event.type) {
            case "error":
                document.querySelector(".error")!.innerHTML = event.message;
                break;
            case "new_order":
                console.debug("Got new order", data);
                render_list(list, event.order);
                state += 1;
                break;
            case "init":
                console.debug(event);
                (document.querySelector(".player")! as HTMLAnchorElement).href = "?battle=" + event.battle;
                (document.querySelector(".gm")! as HTMLAnchorElement).href = "?battle=" + event.battle + "&secret=" + event.secret;
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}`)
        }
    });
}


function App() {
    switch(state) {
        case 1:
            return <p>Foo</p>
            break;
        case 2:
            return <p>Bar</p>
            break;
        default:
            return <p>Unknown</p>
            break;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const battleorder = document.querySelector(".battleorder");
    const websocket = new WebSocket("ws://localhost:8765/");
    
    initGame(websocket);
    recieveActions(battleorder, websocket);
    sendActions(battleorder, websocket);
    
    console.log("Fight!");
    ReactDOM.render(<App />, document.getElementById('app')!);
});

