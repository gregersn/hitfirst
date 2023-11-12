"""Test combat order tracking."""
from hitfirst.order import Battle, swap, shift


def test_combat():
    """Test the basics of combat."""

    battle = Battle(["a", "b", "c", "d"])

    assert len(battle) == 4


def test_swap():
    """Test swapping combatants in a round."""
    battle = Battle(["a", "b", "c"])

    combat_round = battle.new_round()

    swap(combat_round, 0, 0)
    assert combat_round.order == ["a", "b", "c"]

    swap(combat_round, 0, 2)
    assert combat_round.order == ["c", "b", "a"]

    swap(combat_round, 2, 0)
    assert combat_round.order == ["a", "b", "c"]

    swap(combat_round, 0, 1)
    assert combat_round.order == ["b", "a", "c"]

    swap(combat_round, 1, 0)
    assert combat_round.order == ["a", "b", "c"]

    swap(combat_round, 1, 2)
    assert combat_round.order == ["a", "c", "b"]

    swap(combat_round, 2, 1)
    assert combat_round.order == ["a", "b", "c"]


def test_shift():
    """Move a combatant to new spot."""
    battle = Battle(["a", "b", "c"])

    combat_round = battle.new_round()

    shift(combat_round, 0, 0)
    assert combat_round.order == ["a", "b", "c"]

    shift(combat_round, 0, 1)
    assert combat_round.order == ["b", "a", "c"]

    shift(combat_round, 1, 0)
    assert combat_round.order == ["a", "b", "c"]

    shift(combat_round, 0, 2)
    assert combat_round.order == ["b", "c", "a"]

    shift(combat_round, 2, 0)
    assert combat_round.order == ["a", "b", "c"]


def test_remove():
    """Test removing from battle."""
    battle = Battle(["a", "b", "c"])

    battle.remove(1)
    assert battle.combatants == ["a", "c"]

    battle.remove(0)
    assert battle.combatants == ["c"]

    battle.remove(0)
    assert battle.combatants == []


def test_new_round():
    """Test creating new round."""
    battle = Battle(["a", "b", "c"])

    battle_round = battle.new_round(shuffle=False)
    assert battle_round.order == ["a", "b", "c"]

    battle_round.flip(0)
    battle_round.flip(1)
    assert battle_round.order == ["c"]

    battle_round = battle.new_round(shuffle=False)
    assert battle_round.order == ["a", "b", "c"]
