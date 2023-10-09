import random
from typing import Any, Dict, List
from uuid import UUID, uuid4
from pydantic import BaseModel, Field

class Entity(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    turns: int = 1
    alive: bool = True


class Turn(BaseModel):
    entity: Entity
    active: bool = True


class Round(BaseModel):
    entities: List[Turn]

class Combat(BaseModel):
    entities: List[Entity]
    rounds: List[Round]



class InitiativeTracker:
    id: UUID
    contenders: List[Entity] = []
    round: List[Turn] = []
    round_counter: int = 0
    turn_counter: int = 0
    secret: UUID

    def __init__(self):
        self.id = uuid4()
        self.secret = uuid4()
 
    def add_contender(self, entity: Entity):
        self.contenders.append(entity)
    
    def new_round(self, shuffle: bool = True):
        self.round: List[Turn] = []
        self.round_counter += 1

        for entity in self.contenders:
            for _ in range(entity.turns):
                self.round.append(Turn(entity=entity))
        
        if shuffle:
            random.shuffle(self.round)

    def swap(self, entitya: Turn, entityb: Turn):
        raise NotImplementedError

    def move(self, entitya: Turn, index: int):
        raise NotImplementedError

        
    def dict(self, secret: bool = False):
        output: Dict[str, Any] = {
            'id': self.id,
            'contenders': [contender.dict() for contender in self.contenders],
            'round': [contender.dict() for contender in self.round],
            'round_counter': self.round_counter,
            'turn': self.round[self.turn_counter].dict() if self.round else None,
            'turn_pointer': self.turn_counter
        }

        if secret:
            output['secret'] = str(self.secret)

        return output


def main():
    tracker = InitiativeTracker()


if __name__ == '__main__':
    main()
