export type Combatant = {
    name: string,
    actions: number
}

export type Initiative = {
    name: string,
    active: boolean
}

export type ListEditState = {
    from: number,
    to: number,
    processing: boolean,
    originalOrder: Initiative[],
    updateOrder: Initiative[]
}

