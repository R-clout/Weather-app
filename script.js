const unitContainer = document.querySelector('.unit-selector-container');
const dropdown = unitContainer.querySelector('.dropdown');
const dropdownMenu = unitContainer.querySelector('.dropdown-menu');
const dropdownIcon = unitContainer.querySelector('.dropdown-icon');

// a function for the dropdown menu
function itemsDropdown(e){
    // this is just to make the dropdown menu visibles
    dropdownMenu.classList.toggle('opacity-0');
    dropdownMenu.classList.toggle('-translate-y-2');
    dropdownIcon.classList.toggle('rotate-180');
}

function closeitemsDropdown(e){
    
    if(!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)){
       dropdownMenu.classList.add('opacity-0');
    dropdownMenu.classList.add('-translate-y-2');
    dropdownIcon.classList.remove('rotate-180');
    }
}


document.addEventListener('click', closeitemsDropdown);
dropdown.addEventListener('click', itemsDropdown);
