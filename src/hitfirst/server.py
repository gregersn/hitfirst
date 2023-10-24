import asyncio
from dataclasses import dataclass
from typing import Any, Dict, Optional, Set, Tuple
from websockets.server import serve, WebSocketServerProtocol
import json
import logging
import secrets

from order import Battle

logging.basicConfig(format="%(message)s", level=logging.DEBUG)

JOIN = {}


@dataclass
class Fight:
    battle: Battle
    round: Battle
    connected: Set[WebSocketServerProtocol]
    secret: str


BATTLES: Dict[str, Fight] = {}


async def error(websocket: WebSocketServerProtocol, message):
    event = {"type": "error", "message": message}
    await websocket.send(json.dumps(event))


async def new_order(connected: Set[WebSocketServerProtocol], battle):
    for websocket in connected:
        await websocket.send(json.dumps({"type": "new_order", "order": battle.order}))


async def player(websocket: WebSocketServerProtocol, game):
    try:
        fight = BATTLES[game]
    except KeyError:
        await error(websocket, "Game not found")
        return

    fight.connected.add(websocket)
    try:
        logging.debug("Player joined battle: %s", id(fight.battle))
        await new_order({websocket}, fight.round)
        async for message in websocket:
            logging.debug("Player sent: %s", message)

    finally:
        fight.connected.remove(websocket)


async def gm(
    websocket: WebSocketServerProtocol,
    game: Optional[str] = None,
    key: Optional[str] = None,
):
    if game is not None and key is not None:
        fight = BATTLES[game]
        if fight.secret != key:
            await error(websocket, "You are not the GM of me!")
            return
        fight.connected.add(websocket)
    else:
        battle = Battle(["A", "B", "og c"])

        game = secrets.token_urlsafe(16)
        secret_key = secrets.token_urlsafe(16)
        fight = Fight(battle, battle.new_round(), {websocket}, secret_key)
        BATTLES[game] = fight

    try:
        event = {"type": "init", "join": game, "secret": fight.secret}

        logging.debug("Sending init: %s", json.dumps(event))
        await websocket.send(json.dumps(event))

        logging.debug("GM started battle: %s", id(fight.battle))
        await new_order(fight.connected, fight.battle)

        async for message in websocket:
            logging.debug("GM sent: %s", message)

            data = json.loads(message)
            if data["type"] == "click":
                logging.debug(message)
                index = data["index"]
                fight.round.remove(index)
                if fight.round.length < 1:
                    fight.round = fight.battle.new_round(shuffle=True)
                await new_order(fight.connected, fight.round)
    finally:
        # TODO: Set a timestamp, and cleanup after a while instead.
        logging.debug("GM disconnected from %s", id(fight.battle))
        fight.connected.remove(websocket)
        # del JOIN[game]


async def handler(websocket: WebSocketServerProtocol):
    message = await websocket.recv()
    event = json.loads(message)

    assert event["type"] == "init"

    if "join" in event:
        logging.debug("Someone wants to join: %s", message)
        if "secret" in event:
            logging.debug("GM is coming back")
            await gm(websocket, event["join"], event["secret"])
        else:
            await player(websocket, event["join"])
    else:
        logging.debug("GM is starting a game: %s", message)
        await gm(websocket)


async def main():
    async with serve(handler, "localhost", 8765):
        await asyncio.Future()  # Run forever!


asyncio.run(main())
