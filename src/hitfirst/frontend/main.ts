type InitMessage = {
  type: "init";
  battle?: string | null;
  secret?: string | null;
};
type BattleMessage = {
  type: "command";
  command: string;
  params: {};
};

type NewRoundMessage = {
  type: "command";
  command: "new_round";
};

type AddCombatantMessage = {
  type:"command";
  command: "add_combatant";
  params: {
    name: string;
    actions: number;
  }
}

function sendActions(battleview: HTMLDivElement, websocket: WebSocket) {
  // 'New round' button
  const newRound = battleview.getElementsByClassName(
    "btnNewRound"
  )[0] as HTMLButtonElement;
  newRound.addEventListener("click", () => {
    const event: NewRoundMessage = {
      type: "command",
      command: "new_round",
    };
    websocket.send(JSON.stringify(event));
  });


    // Adding combatant
  const addCombatant = battleview.getElementsByClassName("btnAddCombatant")[0] as HTMLButtonElement;
  const combatantName = battleview.getElementsByClassName("combatantInput")[0] as HTMLInputElement;
  const combatantActions = battleview.getElementsByClassName("combatantActions")[0] as HTMLInputElement;
  addCombatant.addEventListener("click", () => {
    const event: AddCombatantMessage = {
      type: "command",
      command: "add_combatant",
      params: {name: combatantName.value,
      actions: Number.parseInt(combatantActions.value)}
    };
    websocket.send(JSON.stringify(event));
  });


  // Clicking on round entries
  const roundlist = battleview.getElementsByClassName(
    "roundorder"
  )[0] as HTMLOListElement;
  roundlist.addEventListener("click", ({ target }) => {
    const index: string = target!.dataset.index;
    if (index === undefined) return;

    const event: BattleMessage = {
      type: "command",
      command: "click",
      params: {
        list: "round",
        index: parseInt(index, 10),
      },
    };
    websocket.send(JSON.stringify(event));
  });

  // Clicking on battle entries
  const battlelist = battleview.getElementsByClassName(
    "battleorder"
  )[0] as HTMLOListElement;
  battlelist.addEventListener("click", ({ target }) => {
    const index: string = target!.dataset.index;
    if (index === undefined) return;

    const event: BattleMessage = {
      type: "command",
      command: "click",
      params: {
        list: "battle",
        index: parseInt(index, 10),
      },
    };
    websocket.send(JSON.stringify(event));
  });

}

type BattleEntry = {
  name: string;
  actions: number;
};

type RoundEntry = {
  name: string;
  done: boolean;
};

function render_list(
  listElement: HTMLOListElement,
  order: BattleEntry[] | RoundEntry[],
  entry_cb
) {
  listElement.hidden = false;
  const new_children = order.map((info, index: number) => {
    const el = document.createElement("li");
    el.appendChild(entry_cb(info));
    el.setAttribute("data-index", index.toString());
    return el;
  });
  console.debug(new_children);
  listElement.replaceChildren(...new_children);
}

function render_round_order(
  listElement: HTMLOListElement,
  order: RoundEntry[]
) {
  render_list(listElement, order, (round_entry: RoundEntry) => {
    const entry = document.createElement("span");
    if (round_entry.done) {
      entry.classList.add("done");
    }
    entry.innerHTML = round_entry.name;
    return entry;
  });
}

function render_battle_order(
  listElement: HTMLOListElement,
  order: BattleEntry[]
) {
  render_list(listElement, order, (battle_entry: BattleEntry) => {
    const entry = document.createElement("span");
    entry.innerHTML = `${battle_entry.name} (${battle_entry.actions})`;
    return entry;
  });
}

function initGame(websocket: WebSocket) {
  websocket.addEventListener("open", () => {
    const params = new URLSearchParams(window.location.search);
    const event: InitMessage = { type: "init" };

    if (params.has("battle")) {
      event.battle = params.get("battle");
    }

    if (params.has("secret")) {
      event.secret = params.get("secret");
    }

    console.debug("Sending init", JSON.stringify(event));

    websocket.send(JSON.stringify(event));
  });
}

let state = 0;

function recieveActions(battleview: HTMLDivElement, websocket: WebSocket) {
  const roundorder = battleview.getElementsByClassName(
    "roundorder"
  )[0] as HTMLOListElement;
  const battleorder = battleview.getElementsByClassName(
    "battleorder"
  )[0] as HTMLOListElement;

  websocket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);

    switch (event.type) {
      case "error":
        console.error("Error event");
        console.error(event);
        document.querySelector(".error")!.innerHTML = event.message;
        break;
      case "new_order":
        console.debug("Got new order", data);
        if (event.order_type == "round")
          render_round_order(roundorder, event.order);

        if (event.order_type == "battle")
          render_battle_order(battleorder, event.order);
        state += 1;
        break;
      case "init":
        console.debug("Init event");
        console.debug(event);
        const xurl: URL = new URL(window.location.toString());

        xurl.searchParams.set("battle", event.battle);
        xurl.searchParams.set("secret", event.secret);
        window.history.replaceState({}, "", xurl.toString());
        (document.querySelector(".player")! as HTMLAnchorElement).href =
          "?battle=" + event.battle;
        (document.querySelector(".gm")! as HTMLAnchorElement).href =
          "?battle=" + event.battle + "&secret=" + event.secret;
        break;
      default:
        throw new Error(`Unsupported event type: ${event.type}`);
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
