import { getData, saveData } from "./storage.js";

export function render() {
  const data = getData();
  let cols = document.querySelectorAll(".droppable");
  cols.forEach((col) => {
    const status = col.dataset.status;
    col.innerHTML = "";

    if (status === "todo" && data[status].length === 0) {
      const blank = document.createElement("div");
      blank.textContent = "No Tasks,Please create";
      col.append(blank);
    }
    data[status].forEach((card) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.dataset.id = card.id;
      //add input element
      const input = document.createElement("input");
      input.classList.add("card__input");
      input.value = card.text;
      input.setAttribute("readonly", true);

      input.addEventListener("click", (e) => {
        e.stopPropagation(); 
        input.removeAttribute("readonly");
        input.focus();
      });
      //save updates
      function save() {
        input.setAttribute("readonly", true);
        const data = getData();
        for (let key in data) {
          data[key] = data[key].map((c) => {
            if (c.id === card.id) {
              return { ...c, text: input.value };
            }
            return c;
          });
        }
        saveData(data);
      }
      //save on blur or enter
      input.addEventListener("blur", save);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
      //delete button
      const delBtn = document.createElement("button");
      delBtn.classList.add("card__delete");
      delBtn.textContent = "✕";

      delBtn.addEventListener("click", () => {
        const data = getData();

        for (let key in data) {
          data[key] = data[key].filter((c) => c.id !== card.id);
        }

        saveData(data);
        render();
      });
      div.appendChild(input);
      div.appendChild(delBtn);
      col.appendChild(div);
    });
  });
}
