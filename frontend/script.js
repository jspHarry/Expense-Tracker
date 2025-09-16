
const userId = localStorage.getItem("userId");
if (!userId) {
  alert("Please login first.");
  localStorage.setItem("openLoginPopup", "true");
  window.location.href = "home.html";
}

const API_URL = `http://localhost:8081/api/expenses?userId=${userId}`;

// Add Expense
let pendingExpense = null;

// Intercept form submit
document.getElementById("expense-form").addEventListener("submit", (e) => {
  e.preventDefault();

  pendingExpense = {
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };

  // fill modal preview
  document.getElementById("preview-title").textContent = pendingExpense.title;
  document.getElementById("preview-amount").textContent = pendingExpense.amount;
  document.getElementById("preview-category").textContent = pendingExpense.category;
  document.getElementById("preview-date").textContent = pendingExpense.date;

  document.getElementById("preview-modal").style.display = "flex";
});

// Cancel button
document.getElementById("cancel-btn").addEventListener("click", () => {
  // Don't wipe form
  pendingExpense = null; 
  document.getElementById("preview-modal").style.display = "none";
  // user returns to the form with their data intact
  document.getElementById("title").focus();
});


// Confirm button (do actual POST here)
document.getElementById("confirm-btn").addEventListener("click", async () => {
  if (!pendingExpense) return;

  await fetch(`http://localhost:8081/api/expenses?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pendingExpense),
  });

  loadExpenses();
  document.getElementById("expense-form").reset();
  pendingExpense = null;

  document.getElementById("preview-modal").style.display = "none";
  showNotification("Expense added successfully!");
});


// Load Expenses
async function loadExpenses() {
  const res = await fetch(`http://localhost:8081/api/expenses?userId=${userId}`);
  const expenses = await res.json();

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;

  expenses.forEach(exp => {
    if (exp.category === "Income") {
      totalIncome += exp.amount;
    } else {
      totalExpense += exp.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  // Update summary cards
  document.getElementById("total-income").textContent = `₹${totalIncome}`;
  document.getElementById("total-expense").textContent = `₹${totalExpense}`;
  document.getElementById("balance").textContent = `₹${balance}`;

  expenses.forEach((exp) => {
    const li = document.createElement("li");
 li.innerHTML = `
  <div class="expense-item-wrapper">
    <div class="expense-item">
      <span>${exp.title}</span>
      <span>₹${exp.amount}</span>
      <span>${exp.category}</span>
      <span>${exp.date}</span>
    </div>
    <div class="expense-actions">
      <button id="edit" onclick="showUpdateForm(${exp.id}, '${exp.title}', ${exp.amount}, '${exp.category}', '${exp.date}')">✏️</button>
      <button onclick="confirmDelete(${exp.id})">Delete</button>
    </div>
  </div>
`;
    list.appendChild(li);
  });
}
 
// Delete Expense
let expenseToDelete = null;

function confirmDelete(id, title, amount) {
  expenseToDelete = id;
  document.getElementById("delete-text").textContent =
    `Are you sure you want to delete record ?`;
  document.getElementById("delete-modal").style.display = "flex";
}

// Cancel button closes modal
document.getElementById("delete-cancel-btn").addEventListener("click", () => {
  expenseToDelete = null;
  document.getElementById("delete-modal").style.display = "none";
});

// Confirm button does DELETE
document.getElementById("delete-confirm-btn").addEventListener("click", async () => {
  if (!expenseToDelete) return;

  await fetch(`http://localhost:8081/api/expenses/${expenseToDelete}?userId=${userId}`, {
    method: "DELETE",
  });

  loadExpenses();
  expenseToDelete = null;
  document.getElementById("delete-modal").style.display = "none";
  showNotification("Expense deleted successfully!");
});

// Show update modal
function showUpdateForm(id, title, amount, category, date) {
  document.getElementById("update-id").value = id;
  document.getElementById("update-title").value = title;
  document.getElementById("update-amount").value = amount;
  document.getElementById("update-category").value = category;

  updateDatePicker.setDate(date, true); // updates visible altInput

  document.getElementById("update-modal").style.display = "flex";
}

// Cancel update
document.getElementById("update-cancel-btn").addEventListener("click", () => {
  document.getElementById("update-modal").style.display = "none";
});

// Handle update
document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("update-id").value;
  const expense = {
    title: document.getElementById("update-title").value,
    amount: parseFloat(document.getElementById("update-amount").value),
    category: document.getElementById("update-category").value,
    date: document.getElementById("update-date").value,
  };

  await fetch(`http://localhost:8081/api/expenses/${id}?userId=${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });

  document.getElementById("update-modal").style.display = "none";
  loadExpenses();
  showNotification("Expense updated successfully!"); 
});



// Initial Load
loadExpenses();

flatpickr("#date", {
  maxDate:"today",
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
  allowInput: true,
  onChange: function(selectedDates, dateStr, instance) {
    // trigger label float
    instance.input.classList.add("valid");
  }
});
// Initialize flatpickr and save instance
const updateDatePicker = flatpickr("#update-date", {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
  allowInput: true,
  onReady: function(selectedDates, dateStr, instance) {
    instance.altInput.style.color = "#fff";           // White text
    instance.altInput.style.background = "rgba(255,255,255,0.15)"; // Optional glass style
  }
});
 
function showNotification(message, type = "success") {
  Toastify({
     text: message + '<div class="toast-progress"></div>',
    duration: 3000, // 3 seconds
    close: true,
    gravity: "top", // top or bottom
    position: "right", // left, center, right
    escapeMarkup: false,
    backgroundColor: type === "success" ? "green" : "red",
    stopOnFocus: true, // Prevents dismissing on hover
    offset:{
      x:10,
      y:60
    }
  }).showToast();
}




 