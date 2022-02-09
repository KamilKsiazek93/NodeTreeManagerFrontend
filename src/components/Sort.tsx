export const handleSortNode = (parentName:string) => {
    const names:any = []
    const childList:NodeListOf<HTMLElement> = document.querySelectorAll(`.${parentName}`);
    childList.forEach(item => names.push(item.innerHTML))
    for(let i = 0, j = names.length - 1; i< childList.length; i++, j--) {
      childList[i].innerHTML = names[j]
    }
  }