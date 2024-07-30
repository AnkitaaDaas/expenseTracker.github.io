document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const searchInput = document.getElementById("search-expense");
    const budgetForm = document.getElementById("budget-form");
    const budgetStatus = document.getElementById("budget-status");

    let expenses = [];
    let budget = 0;

    
    budgetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        budget = parseFloat(document.getElementById("budget-amount").value);
        budgetStatus.textContent = `Budget set to $${budget.toFixed(2)}`;
        budgetForm.reset();
        updateBudgetStatus();
    });

    
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        updateBudgetStatus();

        expenseForm.reset();
    });

    
    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            updateBudgetStatus();
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            updateBudgetStatus();
        }
    });

    
    filterCategory.addEventListener("change", () => {
        applyFilters();
    });

    
    searchInput.addEventListener("input", () => {
        applyFilters();
    });

    
    function applyFilters() {
        const category = filterCategory.value;
        const searchQuery = searchInput.value.toLowerCase();

        let filteredExpenses = expenses;

        if (category !== "All") {
            filteredExpenses = filteredExpenses.filter(expense => expense.category === category);
        }

        if (searchQuery) {
            filteredExpenses = filteredExpenses.filter(expense => expense.name.toLowerCase().includes(searchQuery));
        }

        displayExpenses(filteredExpenses);
    }

    
    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
        updateBudgetStatus();
    }

   
    function updateBudgetStatus() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        if (budget > 0) {
            if (total > budget) {
                budgetStatus.textContent = `Budget exceeded by $${(total - budget).toFixed(2)}`;
                budgetStatus.style.color = "red";
            } else {
                budgetStatus.textContent = `Under budget by $${(budget - total).toFixed(2)}`;
                budgetStatus.style.color = "green";
            }
        } else {
            budgetStatus.textContent = `No budget set`;
            budgetStatus.style.color = "black";
        }
    }
});
