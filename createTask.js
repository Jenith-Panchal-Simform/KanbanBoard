import { render } from "./render.js";
import { getData, saveData } from "./storage.js";

export function initCreateTask() {
    let btn = document.querySelector(".board__button")
    btn.addEventListener("click", () => {
        let statusElement = document.querySelector(".droppable")
        let status = statusElement.dataset.status;
        const newCard = {
            id: Date.now().toString(),
            text: "Default Task"
        };
        // update storage
        const data = getData();
        data[status].push(newCard);
        saveData(data);

        render();
    })
}
