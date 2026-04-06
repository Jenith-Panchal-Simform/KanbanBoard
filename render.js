import { getData } from "./storage.js";

export function render() {
    const data = getData();
    let cols = document.querySelectorAll(".droppable");

    cols.forEach(col => {
        const status = col.dataset.status;
        console.log(col)
        console.log(status)
        col.innerHTML = "";
        data[status].forEach(card => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.textContent = card.text;
            div.dataset.id = card.id;
            col.appendChild(div);
        });
    });
}