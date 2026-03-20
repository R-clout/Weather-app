const unitContainer = document.querySelector('.unit-selector-container');
const dropdown = unitContainer.querySelector('.dropdown');
const dropdownMenu = unitContainer.querySelector('.dropdown-menu');
const daysDropdownMenu = document.querySelector('.days-dropdown-menu')
const daysDropdown = document.querySelector('.days-dropdown');
const dropdownIcon = unitContainer.querySelectorAll('.dropdown-icon');

// a function for closing and opening the dropdown menu
function itemsDropdown(){
    // this is just to make the dropdown menu visibles
    dropdownMenu.classList.toggle('opacity-0');
    dropdownMenu.classList.toggle('-translate-y-2');
    dropdownIcon.forEach(icon => {
        icon.classList.toggle('rotate-180');
    }) || dropdownIcon.classList.toggle('rotate-180')
}

// this is to close the dropdown when its clicked outside of it.
function closeitemsDropdown(e){
    if(!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)){
       dropdownMenu.classList.add('opacity-0');
    dropdownMenu.classList.add('-translate-y-2');
    dropdownIcon.forEach(icon => {
        icon.classList.remove('rotate-180');
    })
    }
}

//this is a function for the daysdropdownMenu, reminder, richard: this is a temporary just to make it work till i find a solution.
function dropdownDaysMenu(){
    daysDropdownMenu.classList.toggle('opacity-0');
    daysDropdownMenu.classList.toggle('-translate-y-2');
}


document.addEventListener('click', closeitemsDropdown);
dropdown.addEventListener('click', itemsDropdown);
//this is for the days dropdown, this is to reminder to find a better way around it but let's do something temporary
daysDropdown.addEventListener('click', dropdownDaysMenu);