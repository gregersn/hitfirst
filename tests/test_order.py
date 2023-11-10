from hitfirst.order import Battle, swap, shift


def test_swap():
    battle = Battle(["a", "b", "c"])

    round = battle.new_round()

    swap(round, 0, 0)
    assert round.order == ["a", "b", "c"]

    swap(round, 0, 2)
    assert round.order == ["c", "b", "a"]

    swap(round, 2, 0)
    assert round.order == ["a", "b", "c"]

    swap(round, 0, 1)
    assert round.order == ["b", "a", "c"]

    swap(round, 1, 0)
    assert round.order == ["a", "b", "c"]

    swap(round, 1, 2)
    assert round.order == ["a", "c", "b"]

    swap(round, 2, 1)
    assert round.order == ["a", "b", "c"]


def test_shift():
    battle = Battle(["a", "b", "c"])

    round = battle.new_round()

    shift(round, 0, 0)
    assert round.order == ["a", "b", "c"]

    shift(round, 0, 1)
    assert round.order == ["b", "a", "c"]

    shift(round, 1, 0)
    assert round.order == ["a", "b", "c"]

    shift(round, 0, 2)
    assert round.order == ["b", "c", "a"]

    shift(round, 2, 0)
    assert round.order == ["a", "b", "c"]


def test_remove():
    battle = Battle(["a", "b", "c"])

    battle.remove(1)
    assert battle.combatants == ["a", "c"]

    battle.remove(0)
    assert battle.combatants == ["c"]

    battle.remove(0)
    assert battle.combatants == []


def test_new_round():
    battle = Battle(["a", "b", "c"])

    round = battle.new_round(shuffle=False)
    assert round.order == ["a", "b", "c"]

    round.flip(0)
    round.flip(1)
    assert round.order == ["c"]

    round = battle.new_round(shuffle=False)
    assert round.order == ["a", "b", "c"]
