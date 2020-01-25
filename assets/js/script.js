//pull initial budgetItems/lastID from localStorage to set initial variables
const budgetItems = JSON.parse(localStorage.getItem('budgetItem')) || [];
let lastID = parseInt(localStorage.getItem('lastID')) || 0; 

//function to update localStorage with latest budgetItems and latest lastID
const updateStorage = () => {
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
    localStorage.setItem('lastID', lastID);
}

// function to render budgetItems on table; each item should be rendered in this format:
const renderItems = items => {
    if(!items) items = budgetItems;
    const tbody =  $('#budgetItems tbody');
    tbody.empty();

    for(const {id, date, name, category, amount, notes} of items) {
        const row = `<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`;
       tbody.append(row);
    }

    const total = items.reduce((accum, item) => 
        accum + parseFloat(item.amount), 0);
    $('#total').text(`$${total.toFixed(2)}`);
}

renderItems();
//wire up click event on 'Enter New Budget Item' button to toggle display of form
$('#toggleFormButton, #hideForm').on('click', function(event) {
    // event.preventDefault();
    const addItemForm = $('#addItemForm');

    addItemForm.toggle('slow', () => {
        $('#toggleFormButton').text(addItemForm.is(':visible') ? 'Hide form' : 'Enter new budget item');
    });
});

// wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array
// (each item's object should include: id / date / name / category / amount / notes)... then clear the form
// fields and trigger localStorage update/budgetItems rerender functions, once created

$('#addItem').on('click', function (event) {
    event.preventDefault();

    const newItem = {
        id: ++lastID, // increment and store updated value in one step
        date: moment().format('lll'),
        name: $('#name').val().trim(),
        category: $('#category').val(),
        amount: $('#amount').val().trim(),
        notes: $('#notes').val().trim()
    }

        if(!newItem.name || !newItem.category || !newItem.amount) {
            //if failed validation
          return alert('You must specify name, category, and amount for each budget item.');
        }

        budgetItems.push(newItem);
        $('#addItemForm form')[0].reset();
        updateStorage(); // update local storage
        renderItems(); // re-render our budget items

        localStorage.getItem(JSON.stringify(newItem));
        console.log(newItem);
  
});
// wire up change event on the category select menu, show filtered budgetItems based on selection
 $('#categoryFilter').on('change', function() {
     const category = $(this).val();
     if(category) {
     const filteredItems = budgetItems.filter(item => category === item.category);
     renderItems(filteredItems)} else {
         renderItems();
     }
 });

// wire up click event on the delete button of a given row; on click delete that budgetItem
$('#budgetItems').on('click', '.delete span', function() {
    const id = parseInt($(this).parents('tr').data('id'));
    const remainingItems = budgetItems.filter(item => 
    item.id !== id
    );   
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
    $('#categoryFilter').val('');
});





