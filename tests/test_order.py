from hitfirst.order import Battle


def test_swap():
    battle = Battle(["a", "b", "c"])

    battle.swap(0, 0)
    assert battle.order == ["a", "b", "c"]

    battle.swap(0, 2)
    assert battle.order == ["c", "b", "a"]

    battle.swap(2, 0)
    assert battle.order == ["a", "b", "c"]

    battle.swap(0, 1)
    assert battle.order == ["b", "a", "c"]

    battle.swap(1, 0)
    assert battle.order == ["a", "b", "c"]

    battle.swap(1, 2)
    assert battle.order == ["a", "c", "b"]

    battle.swap(2, 1)
    assert battle.order == ["a", "b", "c"]


def test_shift():
    battle = Battle(["a", "b", "c"])

    battle.shift(0, 0)
    assert battle.order == ["a", "b", "c"]

    battle.shift(0, 1)
    assert battle.order == ["b", "a", "c"]

    battle.shift(1, 0)
    assert battle.order == ["a", "b", "c"]

    battle.shift(0, 2)
    assert battle.order == ["b", "c", "a"]

    battle.shift(2, 0)
    assert battle.order == ["a", "b", "c"]


def test_remove():
    battle = Battle(["a", "b", "c"])

    battle.remove(1)
    assert battle.order == ["a", "c"]

    battle.remove(0)
    assert battle.order == ["c"]

    battle.remove(0)
    assert battle.order == []


def test_new_round():
    battle = Battle(["a", "b", "c"])

    round = battle.new_round(shuffle=False)
    assert round.order == ["a", "b", "c"]

    round.remove(0)
    round.remove(0)
    assert round.order == ["c"]

    round = battle.new_round(shuffle=False)
    assert round.order == ["a", "b", "c"]
