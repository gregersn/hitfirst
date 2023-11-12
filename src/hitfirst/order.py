"""Battle order."""
import random
from collections.abc import MutableSequence
from dataclasses import dataclass
from typing import Any, List


@dataclass
class Combatant:
    """A battle combatant."""

    name: str
    actions: int = 1
    damage: int = 0
    active: bool = True


@dataclass
class RoundEntry:
    """An action in a round."""

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
    """One round of combat."""

    _combatants: List[RoundEntry]

    def __init__(self, combatants: List[RoundEntry], shuffle: bool = False):
        self._combatants = combatants
        if shuffle:
            random.shuffle(self._combatants)

    def flip(self, fighter_at: int):
        """Mark an entry in the list as done"""
        self._combatants[fighter_at].done = True

    @property
    def order(self):
        """Get round order."""
        return [{"name": c.combatant.name, "done": c.done} for c in self._combatants]

    def __delitem__(self, pos: int):
        return self._combatants.pop(pos)

    def __getitem__(self, pos: int):
        return self._combatants[pos]

    def __len__(self):
        return len(self._combatants)

    def __setitem__(self, pos: int, obj: Any):
        self._combatants[pos] = obj

    def insert(self, index: int, value: Any):
        self._combatants.insert(index, value)


class Battle(MutableSequence):
    """A battle."""

    _combatants: List[Combatant]
    _round: Round

    def __init__(self, combatants: List[Combatant | str]):
        self._combatants = [
            Combatant(c) if isinstance(c, str) else c for c in combatants
        ]

    @property
    def order(self):
        """Battle order."""
        return [
            {
                "name": c.name,
                "actions": c.actions,
                "active": c.active,
                "damage": c.damage,
            }
            for c in self._combatants
        ]

    @property
    def round(self):
        """Get the round"""
        return self._round

    @property
    def length(self):
        """Number of combatants in battle."""
        return len(self._combatants)

    @property
    def combatants(self):
        """Combat combatantas."""
        return [c.name for c in self._combatants]

    def new_round(self, shuffle: bool = False):
        """Start a new round."""
        round_entries: List[RoundEntry] = []
        for c in self._combatants:
            if c.active:
                for _ in range(c.actions):
                    round_entries.append(RoundEntry(c))
        self._round = Round(round_entries, shuffle=shuffle)
        return self._round

    def remove(self, value: int):
        """Remove combatant."""
        self._combatants.pop(value)

    def add(self, combatant: str | Combatant):
        """Add combatant."""

        if isinstance(combatant, str):
            combatant = Combatant(combatant)

        self._combatants.append(combatant)

    def damage(self, index: int, value: int = 1):
        """Add damage to combatant."""
        self._combatants[index].damage += value

    def __delitem__(self, index: int):
        raise NotImplementedError

    def __getitem__(self, index: int):
        raise NotImplementedError

    def __len__(self):
        return sum([c.actions for c in self._combatants if c.active])

    def __setitem__(self, index: int, value: Any):
        raise NotImplementedError

    def insert(self, index: int, value: Any):
        raise NotImplementedError
