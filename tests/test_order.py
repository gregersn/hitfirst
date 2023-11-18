"""Test combat order tracking."""
from hitfirst.order import Battle, swap, shift, Combatant


def test_combat():
    """Test the basics of combat."""

    battle = Battle(["a", "b", "c", "d"])
    assert len(battle) == 4

    battle = Battle(["a", Combatant("b", actions=2), "c", "d"])
    assert len(battle) == 5

    del battle[0]
    assert len(battle) == 4

    assert battle.order == [
        {"name": "b", "actions": 2, "active": True, "damage": 0},
        {"name": "c", "actions": 1, "active": True, "damage": 0},
        {"name": "d", "actions": 1, "active": True, "damage": 0},
    ]

    battle.damage(1, 3)

    assert battle.order[1] == {"name": "c", "actions": 1, "active": True, "damage": 3}

    battle.add("foo")

    shift(battle, 3, 0)
    assert battle.order[0] == {"name": "foo", "actions": 1, "active": True, "damage": 0}
    assert len(battle) == 5

    swap(battle, 0, 3)
    assert battle.order[0]["name"] == "d"
    assert battle.order[3]["name"] == "foo"


def test_round():
    """Test combat rounds."""

    battle = Battle(["a", "b", "c", "d"])
    battle_round = battle.new_round()
    assert len(battle_round) == 4

    battle = Battle(["a", Combatant("b", actions=2), "c", "d"])
    battle_round = battle.new_round()
    assert len(battle_round) == 5

    del battle[0]
    battle_round = battle.new_round()
    assert len(battle_round) == 4

    battle_round.flip(0)
    assert len(battle_round.order) == 4
    battle_round.flip(2)
    assert len(battle_round.order) == 4


def test_swap():
    """Test swapping combatants in a round."""
    battle = Battle(["a", "b", "c"])

    combat_round = battle.new_round()

    swap(combat_round, 0, 0)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]

    swap(combat_round, 0, 2)
    assert [c["name"] for c in combat_round.order] == ["c", "b", "a"]

    swap(combat_round, 2, 0)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]

    swap(combat_round, 0, 1)
    assert [c["name"] for c in combat_round.order] == ["b", "a", "c"]

    swap(combat_round, 1, 0)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]

    swap(combat_round, 1, 2)
    assert [c["name"] for c in combat_round.order] == ["a", "c", "b"]

    swap(combat_round, 2, 1)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]


def test_shift():
    """Move a combatant to new spot."""
    battle = Battle(["a", "b", "c"])

    combat_round = battle.new_round()

    shift(combat_round, 0, 0)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]

    shift(combat_round, 0, 1)
    assert [c["name"] for c in combat_round.order] == ["b", "a", "c"]

    shift(combat_round, 1, 0)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]

    shift(combat_round, 0, 2)
    assert [c["name"] for c in combat_round.order] == ["b", "c", "a"]

    shift(combat_round, 2, 0)
    assert [c["name"] for c in combat_round.order] == ["a", "b", "c"]


def test_remove():
    """Test removing from battle."""
    battle = Battle(["a", "b", "c"])

    del battle[1]
    assert battle.combatants == ["a", "c"]

    del battle[0]
    assert battle.combatants == ["c"]

    del battle[0]
    assert battle.combatants == []


def test_new_round():
    """Test creating new round."""
    battle = Battle(["a", "b", "c"])

    battle_round = battle.new_round(shuffle=False)
    assert [c["name"] for c in battle_round.order if not c["done"]] == ["a", "b", "c"]

    battle_round.flip(0)
    battle_round.flip(1)
    assert [c["name"] for c in battle_round.order if not c["done"]] == ["c"]

    battle_round = battle.new_round(shuffle=False)
    assert [c["name"] for c in battle_round.order if not c["done"]] == ["a", "b", "c"]
