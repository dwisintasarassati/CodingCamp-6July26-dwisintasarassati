const form = document.getElementById("transactionForm");
const itemName = document.getElementById("itemName");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const transactionList = document.getElementById("transactionList");
const balance = document.getElementById("balance");
const newCategory = document.getElementById("newCategory");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const sortOption = document.getElementById("sortOption");
const warningMessage = document.getElementById("warningMessage");
const spendingLimit = 100;
const ctx = document.getElementById("expenseChart").getContext("2d");
const balanceCard = document.querySelector(".balance-card");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// =====================
// Chart
// =====================

const expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    },
    options: {
        responsive: true
    }
});

// =====================
// Save Local Storage
// =====================

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ============================================================
// Update Balance dan Peringatan jika pengeluran melebihi 100
// ============================================================

function updateBalance(){

    let total = 0;

    transactions.forEach(transaction => {
        total += Number(transaction.amount);
    });

    balance.textContent = "$" + total.toFixed(2);

    if(total > spendingLimit ){
        balanceCard.classList.add("balance-danger");
        warningMessage.style.display = "block";
        warningMessage.textContent =
        "⚠ Warning! You have exceeded your spending limit.";

        balance.classList.add("over-limit");

    }else{
        balanceCard.classList.remove("balance-danger");
        warningMessage.style.display = "none";
        balance.classList.remove("over-limit");

    }

}

// =====================
// Update Chart
// =====================

function updateChart(){

    const categoryData = {};

    transactions.forEach(transaction=>{

        if(categoryData[transaction.category]){

            categoryData[transaction.category]+=Number(transaction.amount);

        }else{

            categoryData[transaction.category]=Number(transaction.amount);

        }

    });

    expenseChart.data.labels = Object.keys(categoryData);

    expenseChart.data.datasets[0].data = Object.values(categoryData);

    expenseChart.data.datasets[0].backgroundColor=[
        "#3498db",
        "#2ecc71",
        "#f39c12",
        "#9b59b6",
        "#e74c3c",
        "#1abc9c",
        "#f1c40f",
        "#34495e",
        "#e67e22",
        "#16a085"
    ];

    expenseChart.update();

}

// =====================
// Render Transaction
// =====================

function renderTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {

        const div = document.createElement("div");

        div.classList.add("transaction");

        div.innerHTML = `

            <div class="transaction-info">

                <h4>${transaction.name}</h4>

                <p>$${Number(transaction.amount).toFixed(2)}</p>

                <span class="category">
                    ${transaction.category}
                </span>

            </div>

            <button class="delete-btn"
                onclick="deleteTransaction(${index})">

                Delete

            </button>

        `;

        transactionList.appendChild(div);

    });

    updateBalance();

    updateChart();

    saveData();

}

// =====================
// Delete
// =====================

function deleteTransaction(index) {

    transactions.splice(index, 1);

    renderTransactions();

}

// ========================
// Custom Category
// ========================

addCategoryBtn.addEventListener("click", function(){

    const categoryName = newCategory.value.trim();

    if(categoryName === ""){

        alert("Please enter a category.");

        return;

    }

    const option = document.createElement("option");

    option.value = categoryName;

    option.textContent = categoryName;

    category.appendChild(option);

    category.value = categoryName;

    newCategory.value = "";

});

// =====================
// Add Transaction
// =====================

form.addEventListener("submit", function(e) {

    e.preventDefault();

    if (
        itemName.value.trim() === "" ||
        amount.value.trim() === "" ||
        category.value === ""
    ) {

        alert("Please fill in all fields.");

        return;

    }

    const transaction = {

        name: itemName.value,

        amount: parseFloat(amount.value),

        category: category.value

    };

    transactions.push(transaction);

    renderTransactions();

    form.reset();

});

// =====================
// First Load
// =====================

renderTransactions();

// =====================
// Sort
// =====================

sortOption.addEventListener("change", function(){

    switch(sortOption.value){

        case "amountAsc":

            transactions.sort((a,b)=>a.amount-b.amount);

            break;

        case "amountDesc":

            transactions.sort((a,b)=>b.amount-a.amount);

            break;

        case "category":

            transactions.sort((a,b)=>
                a.category.localeCompare(b.category)
            );

            break;

        default:

            transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    }

    renderTransactions();

});


