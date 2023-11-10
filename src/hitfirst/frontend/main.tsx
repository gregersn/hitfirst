function sendActions(battleview: HTMLDivElement, websocket: WebSocket) {
    const list = battleview.getElementsByClassName("roundorder")[0] as HTMLOListElement;
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

function render_list(listElement: HTMLOListElement, order: string[]) {
    listElement.hidden = false;
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


function recieveActions(battleview: HTMLDivElement, websocket: WebSocket) {
    const roundorder = battleview.getElementsByClassName("roundorder")[0] as HTMLOListElement;
    const battleorder = battleview.getElementsByClassName("battleorder")[0] as HTMLOListElement;

    websocket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);

        switch(event.type) {
            case "error":
                console.error("Error event");
                console.error(event);
                document.querySelector(".error")!.innerHTML = event.message;
                break;
            case "new_order":
                console.debug("Got new order", data);
                if(event.order_type == "round")
                    render_list(roundorder, event.order);   
            
                if(event.order_type == "battle")
                    render_list(battleorder, event.order);
                state += 1;
                break;
            case "init":
                console.debug("Init event");
                console.debug(event);
                const xurl: URL = (new URL(window.location.toString()));
                
                xurl.searchParams.set('battle', event.battle);
                xurl.searchParams.set('secret', event.secret);
                window.history.replaceState({}, "", xurl.toString());
                (document.querySelector(".player")! as HTMLAnchorElement).href = "?battle=" + event.battle;
                (document.querySelector(".gm")! as HTMLAnchorElement).href = "?battle=" + event.battle + "&secret=" + event.secret;
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}`)
        }
    });
}


window.addEventListener("DOMContentLoaded", () => {
    const battleview = document.querySelector(".battleview") as HTMLDivElement;
    const websocket = new WebSocket("ws://localhost:8765/");
    
    initGame(websocket);
    recieveActions(battleview, websocket);
    sendActions(battleview, websocket);
    
    console.log("Fight!");
});

