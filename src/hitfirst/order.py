from dataclasses import dataclass
import random
from typing import Any, List
from collections.abc import MutableSequence


@dataclass
class Combatant:
    name: str
    actions: int = 1


@dataclass
class RoundEntry:
    combatant: Combatant
    done: bool = False


def swap(entries: MutableSequence[Any], fighter_a: int, fighter_b: int):
    """Swap positions of two fighters."""
    entries[fighter_a], entries[fighter_b] = (
        entries[fighter_b],
        entries[fighter_a],
    )


def shift(entries: MutableSequence[Any], fighter_at: int, to_position: int):
    """Move a fighter to specific position."""
    fighter = entries.pop(fighter_at)
    entries.insert(to_position, fighter)


class Round(MutableSequence):
    _combatants: List[RoundEntry]

    def __init__(self, combatants: List[RoundEntry], shuffle: bool = False):
        self._combatants = combatants
        if shuffle:
            random.shuffle(self._combatants)

    def flip(self, fighter_at: int):
        """Mark an entry in the list as done"""
        self._combatants[fighter_at].done = True

    @property
    def order(self, all: bool = False):
        return [c.combatant.name for c in self._combatants if all or not c.done]

    def __delitem__(self, pos: int):
        return self._combatants.pop(pos)

    def __getitem__(self, pos: int):
        return self._combatants[pos]

    def __len__(self):
        raise NotImplementedError

    def __setitem__(self, pos: int, obj: Any):
        self._combatants[pos] = obj

    def insert(self, pos: int, obj: Any):
        self._combatants.insert(pos, obj)


class Battle(MutableSequence):
    _combatants: List[Combatant]
    _round: Round

    def __init__(self, combatants: List[Combatant | str]):
        self._combatants = [
            Combatant(c) if isinstance(c, str) else c for c in combatants
        ]

    @property
    def order(self):
        return [c.name for c in self._combatants]

    @property
    def length(self):
        return len(self._combatants)

    @property
    def combatants(self):
        return [c.name for c in self._combatants]

    def new_round(self, shuffle: bool = False):
        self._round = Round([RoundEntry(c) for c in self._combatants], shuffle=shuffle)
        return self._round

    def remove(self, fighter_at: int):
        """Remove combatant."""
        self._combatants.pop(fighter_at)

    def add(self, combatant: str | Combatant):
        """Add combatant."""

        if isinstance(combatant, str):
            combatant = Combatant(combatant)

        self._combatants.append(combatant)

    def __delitem__(self):
        raise NotImplementedError

    def __getitem__(self):
        raise NotImplementedError

    def __len__(self):
        raise NotImplementedError

    def __setitem__(self):
        raise NotImplementedError

    def insert(self):
        raise NotImplementedError
