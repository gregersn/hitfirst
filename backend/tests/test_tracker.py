
import random
from hitfirst.initiative import InitiativeTracker, Entity, Turn

def test_tracker():
    random.seed = 1
    tracker = InitiativeTracker()

    assert tracker is not None
    assert tracker.id is not None, tracker.id

    albert = Entity(name="Albert")
    bertha = Entity(name="Bertha", turns=3)
    
    assert albert.id != bertha.id

    tracker.add_contender(albert)
    tracker.add_contender(bertha)

    tracker.new_round()

    assert len(tracker.round) == 4

    assert tracker.dict() == {
        'id': tracker.id,
        'contenders': [
            albert.dict(),
            bertha.dict()],
        'round': [contender.dict() for contender in tracker.round],
        'round_counter': 1,
        'turn': tracker.round[0].dict(),
        'turn_pointer': 0
    }

