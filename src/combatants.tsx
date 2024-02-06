import * as React from "react";

export const Combatants = (props: { combatants: Combatant[] }) => {

    const [list, setList] = React.useState(props.combatants);

    const addCombatantClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Add a combatant")
        const combatantInput: HTMLInputElement = document.getElementById('combatantInput');
        const name = combatantInput.value;
        if (name !== '') {
            props.combatants.push({name: name, actions: 1});
            setList(props.combatants.slice());
        }
        combatantInput.value = '';

    }

    const removeCombatant = (index: number) => {
        props.combatants.splice(index, 1);
        setList(props.combatants.slice());

    }

    const setActions = (index: number, actions: number) => {
        props.combatants[index].actions = actions
        setList(props.combatants.slice())
    }

    return (
        <section className="combatantsHandler">
            <h2>Combatants</h2>
            <ol className="big-list list-group">{
                list.map((value, index) => {
                    return (
                        <li key={index} className="element list-group-item d-flex justify-content-between align-items-center">
                            <span className="combatant" key={index}>{value.name}</span>
                            <span>
                            <input className="actionCounter"  size={3} type="number" value={value.actions} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setActions(index, event.target.valueAsNumber)}} />
                            <button className="btn remove" onClick={() => { removeCombatant(index) }} >Remove</button>
                            </span>
                        </li>
                    );
                })
            }</ol>
            <input id="combatantInput" /><button onClick={addCombatantClick} className="btn add">Add</button>
        </section>
    )
}
