import * as React from "react";

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

type DnDState = {
    draggedFrom: number,
    draggedTo: number,
    isDragging: boolean,
    originalOrder: string[],
    updateOrder: string[]
}


export const InitiativeList = (props: { combatants: string[], shift: boolean }) => {
    const initialDnDState: DnDState = {
        draggedFrom: 0,
        draggedTo: 0,
        isDragging: false,
        originalOrder: [],
        updateOrder: []
    }

    const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);
    const [list, setList] = React.useState(props.combatants.slice());

    const onDragStart = (event: React.DragEvent<Element>) => {
        if (!(event && event?.target instanceof HTMLElement)) return
        const initialPosition = Number(event.currentTarget?.dataset?.position);

        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: initialPosition,
            isDragging: true,
            originalOrder: list
        });

        event.dataTransfer?.setData("text/html", '');
    }

    const onDragOver = (event: React.DragEvent<Element>) => {
        event.preventDefault();
        const draggedTo = Number(event.currentTarget?.dataset.position);
        event.preventDefault();

        let newList = dragAndDrop.originalOrder;
        const draggedFrom = dragAndDrop.draggedFrom;
        const itemDragged = newList[draggedFrom];
        const remainingItems = newList.filter((item, index) => index !== draggedFrom);

        newList = [
            ...remainingItems.slice(0, draggedTo),
            itemDragged,
            ...remainingItems.slice(draggedTo)
        ];

        if (draggedTo !== dragAndDrop.draggedTo) {
            setDragAndDrop({
                ...dragAndDrop,
                updateOrder: newList,
                draggedTo: draggedTo
            })
        }
    }

    const onDrop = (event: React.DragEvent<Element>) => {
        //console.log(event)
        event.preventDefault();

        if (!props.shift) {
            let from = dragAndDrop.updateOrder[dragAndDrop.draggedFrom];
            let to = dragAndDrop.updateOrder[dragAndDrop.draggedTo]
            dragAndDrop.updateOrder[dragAndDrop.draggedTo] = from;
            dragAndDrop.updateOrder[dragAndDrop.draggedFrom] = to;
        } else {
            let newList = dragAndDrop.originalOrder;
            const draggedFrom = dragAndDrop.draggedFrom;
            const itemDragged = newList[draggedFrom];
            const remainingItems = newList.filter((item, index) => index !== draggedFrom);

            newList = [
                ...remainingItems.slice(0, dragAndDrop.draggedTo),
                itemDragged,
                ...remainingItems.slice(dragAndDrop.draggedTo)
            ];

            setDragAndDrop({
                ...dragAndDrop,
                updateOrder: newList
            })
        }

        setList(dragAndDrop.updateOrder);

        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: 0,
            draggedTo: 0,
            isDragging: false
        });

        return;
    }

    const onMouseDown = (event: React.MouseEvent<Element, MouseEvent>) => { }
    const onMouseMove = (event: React.MouseEvent<Element, MouseEvent>) => { }
    const onMouseUp = (event: React.MouseEvent<Element, MouseEvent>) => { }

    const removeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const removalIndex = Number(event.target.parentNode.dataset.position);
        list.splice(removalIndex, 1);
        setList(list)
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: 0,
            draggedTo: 0,
            isDragging: false
        });
    }

    const initializeRound = (event: React.MouseEvent<HTMLButtonElement>) => {
        setList(shuffle(props.combatants));
        setDragAndDrop({ ...dragAndDrop });
    }

    return (
        <section className="initiativeOrder">
            <h2>Round intiative</h2>
            <ul className="big-list list-group">
                {list.map((item: string, index: number) => {
                    return (
                        <li key={index} draggable="true"
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            data-position={index}
                            className="element draggable list-group-item d-flex justify-content-between align-items-center">
                            <span>{item}</span>
                            <button className="btn remove" onClick={removeButtonClick}>Remove</button>
                        </li>
                    )
                })}
            </ul>
            <button onClick={initializeRound} className="btn add">New round</button>
        </section>
    )
}

