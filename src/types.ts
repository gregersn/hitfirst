type Combatant = {
    name: string,
    actions: number
}

type Initiative = {
    name: string,
    active: boolean
}

type ListEditState = {
    from: number,
    to: number,
    processing: boolean,
    originalOrder: Initiative[],
    updateOrder: Initiative[]
}

