const dropdown = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');

// a function for the dropdown menu
function itemsDropdown(){
    dropdownMenu.classList.toggle('hidden');
    dropdownMenu.classList.toggle('opacity-0');
    dropdownMenu.classList.toggle('-translate-y-2')
}


dropdown.addEventListener('click', itemsDropdown)


// 