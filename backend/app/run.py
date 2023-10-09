import random
import logging
from typing import Optional, Dict
from uuid import UUID

from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware import Middleware
from forms import CreateTrackerForm

from hitfirst.initiative import InitiativeTracker

logger = logging.getLogger("run")

middleware = [
    Middleware(SessionMiddleware, secret_key="Mooom")
]

app = FastAPI(title="Hit First", middleware=middleware)
app.mount("/static", StaticFiles(directory="../static"), name="static")

templates = Jinja2Templates(directory="../templates")

TRACKERS: Dict[UUID, InitiativeTracker] = {}


@app.post("/tracker/create")
async def create_tracker():
    tracker = InitiativeTracker()
    TRACKERS[tracker.id] = tracker
    return tracker.dict(secret=True)


@app.get("/tracker/{tracker_id}")
async def get_tracker(tracker_id: str,
                      player_id: Optional[UUID] = None,
                      secret: Optional[UUID] = None):
    if UUID(tracker_id) not in TRACKERS:
        return JSONResponse(status_code=404, content={"message": "Tracker not found"})

    tracker = TRACKERS[UUID(tracker_id)]

    return TRACKERS[UUID(tracker_id)].dict(secret=secret == tracker.secret)


@app.get("/")
async def root(request: Request):
    form = CreateTrackerForm.from_formdata(
        request, meta={'csrf_context': request.session})
    return templates.TemplateResponse('root.html.j2',
                                      {
                                          "request": request,
                                          "forms": {"create_tracker": form}
                                      })


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger.info("Accepting client connection...")

    await websocket.accept()

    while True:
        try:
            logger.warning("Waiting for message from client")
            await websocket.receive_text()

            logger.warning("Send message to client")
            resp = {'value': random.uniform(0, 1)}

            await websocket.send_json(resp)
        except Exception as exc:
            logger.error("error: %s", exc)
            break

    logger.info("Exiting.")
