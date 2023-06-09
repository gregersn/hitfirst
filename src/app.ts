// Code By Webdevtrick ( https://webdevtrick.com )
let btn = document.querySelector('.add');
let remove = document.querySelector('.draggable');

var dragSrcEl;

function dragStart(e: DragEvent) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
};

function dragEnter(e: DragEvent) {
    this.classList.add('over');
}

function dragLeave(e: DragEvent) {
    e.stopPropagation();
    this.classList.remove('over');
}

function dragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer)
        e.dataTransfer.dropEffect = 'move';
    return false;
}

function dragDrop(e: DragEvent) {
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        if (e.dataTransfer)
            this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
}

function dragEnd(e: DragEvent) {
    let listItens = document.querySelectorAll('.draggable');
    [].forEach.call(listItens, function (item: HTMLElement) {
        item.classList.remove('over');
    });
    this.style.opacity = '1';
}

function addEventsDragAndDrop(el: HTMLElement) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
}


function addCombatant(name: string) {
    let ul = document.querySelector('ul.initiativeOrder');
    if (ul) {
        let li = document.createElement('li');
        let attr = document.createAttribute('draggable');
        li.className = 'draggable';
        attr.value = 'true';
        li.setAttributeNode(attr);
        li.appendChild(document.createTextNode(name));
        ul.appendChild(li);
        addEventsDragAndDrop(li);
    }

}


function addNewItem() {
    const inputElement: HTMLInputElement | null = document.querySelector('.input');
    if (!inputElement) return;

    let newItem = inputElement?.value;

    if (newItem != '') {
        inputElement.value = '';
        addCombatant(newItem)
    }
}
let listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function (item) {
    addEventsDragAndDrop(item);
});


function init() {
    if (btn)
        btn.addEventListener('click', addNewItem);


}

var combatants = ['Ankan', 'Dvärgen', 'Draken'];

document.addEventListener('DOMContentLoaded', function (event) {
    console.log("Initiate the page.");

    combatants.forEach(value => addCombatant(value));

})
