
function sendActions(list, websocket) {
    list.addEventListener("click", ({target}) => {
        const index = target.dataset.index;
        if(index === undefined) return;

        const event = {
            type: "click",
            index: parseInt(index, 10)
        };
        websocket.send(JSON.stringify(event));
    });
};

function render_list(listElement, order) {
    const new_children = order.map((info, index) => {
        const el = document.createElement('li');
        el.innerText = info;
        el.setAttribute('data-index', index);
        return el;
    });
    console.log(new_children);
    listElement.replaceChildren(...new_children);
}

function initGame(websocket) {
    websocket.addEventListener("open", () => {
        const params = new URLSearchParams(window.location.search);

        const event = { type: "init" };

        if(params.has("battle")) {
            event.join = params.get("battle");
        }

        if(params.has("secret")) {
            event.secret = params.get("secret");
        }

        console.debug("Sending init", JSON.stringify(event));
        
        websocket.send(JSON.stringify(event));
    });
}

function recieveActions(list, websocket) {
    websocket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);

        switch(event.type) {
            case "new_order":
                console.debug("Got new order", data);
                render_list(list, event.order);
                break;
            case "init":
                console.debug(event);
                document.querySelector(".player").href = "?battle=" + event.join;
                document.querySelector(".gm").href = "?battle=" + event.join + "&secret=" + event.secret;
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}`)
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const battleorder = document.querySelector(".battleorder");
    const websocket = new WebSocket("ws://localhost:8765/");
    
    initGame(websocket);
    recieveActions(battleorder, websocket);
    sendActions(battleorder, websocket);
    
    console.log("Fight!");
});

