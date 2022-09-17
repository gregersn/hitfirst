import * as React from "react";

export const Combatants = (props: { combatants: string[] }) => {

    const [list, setList] = React.useState(props.combatants);

    const addCombatantClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Add a combatant")
        const combatantInput: HTMLInputElement = document.getElementById('combatantInput');
        const name = combatantInput.value;
        if (name !== '') {
            props.combatants.push(name);
            setList(props.combatants.slice());
        }
        combatantInput.value = '';

    }

    const removeCombatant = (index: number) => {
        props.combatants.splice(index, 1);
        setList(props.combatants.slice());

    }

    return (
        <section className="combatantsHandler">
            <h2>Combatants</h2>
            <ol className="big-list list-group">{
                list.map((value, index) => {
                    return (
                        <li key={index} className="element list-group-item d-flex justify-content-between align-items-center">
                            <span className="combatant" key={index}>{value}</span>
                            <button className="btn remove" onClick={() => { removeCombatant(index) }} >Remove</button>
                        </li>
                    );
                })
            }</ol>
            <input id="combatantInput" /><button onClick={addCombatantClick} className="btn add">Add</button>
        </section>
    )
}