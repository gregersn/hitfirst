import * as React from "react";
import {Combatant, Initiative, ListEditState} from "./types"

function shuffle<T>(array: T[]): T[] {
    array = array.slice();
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array

}


export const InitiativeList = (props: { combatants: Combatant[], shift: boolean }) => {
    const initialDnDState: ListEditState = {
        from: 0,
        to: 0,
        processing: false,
        originalOrder: [],
        updateOrder: []
    }

    const initialSwapState: ListEditState = {
        from: 0,
        to: 0,
        processing: false,
        originalOrder: [],
        updateOrder: []
    }

    const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);
    const [swappingState, setSwappingState] = React.useState(initialSwapState)
    const [list, setList] = React.useState(props.combatants.slice().map(n => {return {name: n.name, active: true}}));

    const onDragStart = (event: React.DragEvent<Element>) => {
        if (!(event && event?.target instanceof HTMLElement)) return
        if (swappingState.processing) return
        
        const initialPosition = Number(event.currentTarget.getAttribute("data-position"));

        setDragAndDrop({
            ...dragAndDrop,
            from: initialPosition,
            processing: true,
            originalOrder: list
        });

        event.dataTransfer?.setData("text/html", '');
    }

    const onDragOver = (event: React.DragEvent<Element>) => {
        event.preventDefault();
        const draggedTo = Number(event.currentTarget.getAttribute("data-position"));
        event.preventDefault();

        let newList = dragAndDrop.originalOrder;
        const draggedFrom = dragAndDrop.from;
        const itemDragged = newList[draggedFrom];
        const remainingItems = newList.filter((item, index) => index !== draggedFrom);

        newList = [
            ...remainingItems.slice(0, draggedTo),
            itemDragged,
            ...remainingItems.slice(draggedTo)
        ];

        if (draggedTo !== dragAndDrop.to) {
            setDragAndDrop({
                ...dragAndDrop,
                updateOrder: newList,
                to: draggedTo
            })
        }
    }

    const onDrop = (event: React.DragEvent<Element>) => {
        event.preventDefault();

        if (!props.shift) {
            let from = dragAndDrop.updateOrder[dragAndDrop.from];
            let to = dragAndDrop.updateOrder[dragAndDrop.to]
            dragAndDrop.updateOrder[dragAndDrop.to] = from;
            dragAndDrop.updateOrder[dragAndDrop.from] = to;
        } else {
            let newList = dragAndDrop.originalOrder;
            const draggedFrom = dragAndDrop.from;
            const itemDragged = newList[draggedFrom];
            const remainingItems = newList.filter((item, index) => index !== draggedFrom);

            newList = [
                ...remainingItems.slice(0, dragAndDrop.to),
                itemDragged,
                ...remainingItems.slice(dragAndDrop.to)
            ];

            setDragAndDrop({
                ...dragAndDrop,
                updateOrder: newList
            })
        }

        setList(dragAndDrop.updateOrder);

        setDragAndDrop({
            ...dragAndDrop,
            from: 0,
            to: 0,
            processing: false
        });

        return;
    }

    const onMouseDown = (event: React.MouseEvent<Element, MouseEvent>) => { }
    const onMouseMove = (event: React.MouseEvent<Element, MouseEvent>) => { }
    const onMouseUp = (event: React.MouseEvent<Element, MouseEvent>) => { }

    const removeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const removalIndex = Number(event.currentTarget.getAttribute("data-value"));
        
        //list.splice(removalIndex, 1);
        list[removalIndex].active = false;
        setList(list)
        setDragAndDrop({
            ...dragAndDrop,
            from: 0,
            to: 0,
            processing: false
        });
        setSwappingState({
            ...swappingState,
            from: 0,
            to: 0,
            processing: false
        });
    }

    const swapButtonClick =  (event: React.MouseEvent<HTMLButtonElement>) => {
        if (dragAndDrop.processing) return;
        const swapIndex = Number(event.currentTarget.getAttribute("data-value"));

        if(!swappingState.processing) {
            setSwappingState({
                ...swappingState,
                from: swapIndex,
                processing: true,
                originalOrder: list
            });
        } else {
            const newList = swappingState.originalOrder;
            const from = newList[swappingState.from];
            const to = newList[swapIndex];
            newList[swapIndex] = from;
            newList[swappingState.from] = to;
            setList(newList);          
            setSwappingState({
                ...swappingState,
                from: 0,
                to: 0,
                processing: false
            })

        }
    }

    const initializeRound = (event: React.MouseEvent<HTMLButtonElement>) => {
        const new_round: Initiative[] = []
        props.combatants.forEach(combatant => {
            if(combatant.actions < 1) {}
            else if(combatant.actions > 1) {
                for(let i = 0; i < combatant.actions; i++) {
                    new_round.push({name: `${combatant.name} (${i + 1})`, active: true})
                }
            }
            else {
                new_round.push({name: combatant.name, active: true})
            }
        })
        setList(shuffle(new_round));
        setDragAndDrop({ ...dragAndDrop });
    }
    

    return (
        <section className="initiativeOrder">
            <h2>Round intiative</h2>
            <ul className="big-list list-group">
                {list.map((item: Initiative, index: number) => {
                    return (
                        <li key={index} draggable={item.active}
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            data-position={index}
                            className={"element draggable list-group-item d-flex justify-content-between align-items-center " + (item.active ? "undone" : "done") + ((swappingState.processing && (swappingState.from == index)) ? " swapping" : "")}>
                            <span className={item.active ? "active" : "inactive"}>{item.name}</span>
                            <span>
                            <button className="btn swap" onClick={swapButtonClick} data-value={index}>Swap</button>
                            <button className="btn remove" onClick={removeButtonClick} data-value={index}>Done</button>
                            </span>
                        </li>
                    )
                })}
            </ul>
            <button onClick={initializeRound} className="btn add">New round</button>
        </section>
    )
}

