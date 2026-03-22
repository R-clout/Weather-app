const dropdown = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');
const daysDropdown = document.querySelector('.days-dropdown');
const dropdownIcon = document.querySelector('.dropdown-icon');
const daysdropdownMenu = document.querySelector('.days-dropdown-menu');
const daysdropdownIcon = document.querySelector('.days-dropdown-icon');

// this is a function to call the open weather API































// a function for closing and opening the dropdown menu
function itemsDropdown(){
    // this is just to make the dropdown menu visibles
    dropdownMenu.classList.toggle('opacity-0');
    dropdownMenu.classList.toggle('-translate-y-2');
    dropdownIcon.classList.toggle('rotate-180');
}

// this is to close the dropdown when its clicked outside of it.
function closeitemsDropdown(e){
    if(!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)){
        dropdownMenu.classList.add('opacity-0');
        dropdownMenu.classList.add('-translate-y-2');
        dropdownIcon.classList.remove('rotate-180')
    };

    //close the day-drop if statement because why not.

    if(!daysDropdown.contains(e.target) && !daysdropdownMenu.contains(e.target)){
        daysdropdownMenu.classList.add('opacity-0');
        daysdropdownMenu.classList.add('-translate-y-2');
        daysdropdownIcon.classList.remove('rotate-180');
    };
}

// this is a function for the days-dropdown element, this is just a temporary solution for this.
function toggleDayDropdown(){
    daysdropdownMenu.classList.toggle('opacity-0');
    daysdropdownMenu.classList.toggle('-translate-y-2');
    daysdropdownIcon.classList.toggle('rotate-180');
}

document.addEventListener('click', closeitemsDropdown);
dropdown.addEventListener('click', itemsDropdown);
daysDropdown.addEventListener('click', toggleDayDropdown);