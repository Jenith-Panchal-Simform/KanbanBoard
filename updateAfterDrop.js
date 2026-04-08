import { getData, saveData } from "./storage.js";

export function updateDataAfterDrop(dragged, targetContainer) {
    const id = dragged.dataset.id;
    const newStatus = targetContainer.dataset.status;

    const data = getData();

    // remove from old column
    for (let key in data) {
        data[key] = data[key].filter(card => card.id !== id);
    }

    // get new order from DOM
    const cards = [...targetContainer.querySelectorAll(".card")];
    
    data[newStatus] = cards.map(card => {
        const input = card.querySelector("input");
      
        return {
          id: card.dataset.id,
          text: input.value
        };
      });

    saveData(data);
}