export function initCreateTask()
{   
    let btn=document.querySelector(".board__button")
   btn.addEventListener("click",()=>{
    let status = document.querySelector(".droppable")
    const newDiv=document.createElement("div")
    newDiv.classList.add("card")
    newDiv.textContent="Counter"
    status.append(newDiv);
   })
}
