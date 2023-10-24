import random
from typing import Any, List


class Battle:
    _combatants: List[Any]

    def __init__(self, combatants: List[Any], shuffle: bool = False):
        self._combatants = combatants

        if shuffle:
            random.shuffle(self._combatants)

    def swap(self, fighter_a: int, fighter_b: int):
        """Swap positions of two fighters."""
        self._combatants[fighter_a], self._combatants[fighter_b] = (
            self._combatants[fighter_b],
            self._combatants[fighter_a],
        )

    def shift(self, fighter_at: int, to_position: int):
        """Move a fighter to specific position."""
        fighter = self._combatants.pop(fighter_at)
        self._combatants.insert(to_position, fighter)

    @property
    def order(self):
        return self._combatants

    @property
    def length(self):
        return len(self._combatants)

    def new_round(self, shuffle: bool = False):
        return self.__class__(self._combatants.copy(), shuffle)

    def remove(self, fighter_at: int):
        """Remove combatant."""
        self._combatants.pop(fighter_at)

    def add(self, combatant: Any, actions: int = 1):
        """Add combatant."""
        for i in range(actions):
            self._combatants.append(combatant)
