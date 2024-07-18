let orders, customers;

const table = document.getElementById("table");

async function getCustomers() {
  const api = await fetch(`https://my-json-server.typicode.com/B-a-d-r-a-n/Customer-tracking/customers`);
  const response = await api.json();
  customers = response;
}
async function getTransactions() {
  const api = await fetch(`https://my-json-server.typicode.com/B-a-d-r-a-n/Customer-tracking/transactions`);
  const response = await api.json();
  orders = response;
}
async function GetData() {
  const api = await fetch(`https://my-json-server.typicode.com/B-a-d-r-a-n/Customer-tracking/customers`);
  const response = await api.json();
  customers = response;
  const api1 = await fetch(`https://my-json-server.typicode.com/B-a-d-r-a-n/Customer-tracking/transactions`);
  const response2 = await api1.json();
  orders = response2;

  displayTable(customers, orders);
}

GetData();

function displayTable(customers, orders) {
  box = ``;
  for (let order of orders) {
    let customer = customers.find(
      (customer) => customer.id == `${order.customer_id}`
    );
    if (customer) {
      box += `<tr><td>${order.id}</td><td>${customer.name}</td><td>${
        order.amount
      }</td><td>${order.date}</td><td><button onclick="toggleGraph(${
        customer.id
      }, '${customer.name}')">${getToggleButtonText(customer.id)} ${
        customer.name
      } (${customer.id})</button></td>`;
    } else {
      console.log(
        `Order ID: ${order.id}, Customer not found, Date: ${order.date}, Amount: ${order.amount}`
      );
    }
  }
  document.querySelector("tbody").innerHTML = box;
}

let ctx = document.getElementById("myChart").getContext("2d");
let chart;
let graphData = {};

function toggleGraph(customerId, customerName) {
  if (graphData[customerId]) {
    removeGraphLine(customerId);
  } else {
    addGraphLine(customerId, customerName);
  }
}

function addGraphLine(customerId, customerName) {
  let customerOrders = orders.filter(
    (order) => order.customer_id === customerId
  );
  let labels = customerOrders.map((order) => {
    let date = new Date(order.date);
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  });
  let data = customerOrders.map((order) => order.amount);
  let color = getRandomColor();
  graphData[customerId] = {
    label: `Orders for ${customerName} (${customerId})`,
    data: data,
    labels: labels,
    borderWidth: 1,
    backgroundColor: color,
    borderColor: color,
  };
  updateGraph();
}

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function removeGraphLine(customerId) {
  delete graphData[customerId];
  updateGraph();
}
function updateGraph() {
  if (chart) {
    chart.destroy();
  }
  let datasets = Object.values(graphData);
  let allDates = [];
  datasets.forEach((dataset) => {
    dataset.data.forEach((data, i) => {
      let date = new Date(dataset.labels[i]);
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      allDates.push(`${months[date.getMonth()]} ${date.getDate()}`);
    });
  });
  let labels = [...new Set(allDates)];
  labels.sort((a, b) => {
    let dateA = new Date(a);
    let dateB = new Date(b);
    return dateA - dateB;
  });
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function getToggleButtonText(customerId) {
  return graphData[customerId] ? "Hide" : "Show";
}

let sortDirection = {};

function sortItems(column) {
  let tableRows = Array.from(document.querySelectorAll("table tr"));
  tableRows.shift();
  let direction = sortDirection[column] === 1 ? -1 : 1;
  sortDirection[column] = direction;
  tableRows.sort((a, b) => {
    let aValue;
    let bValue;
    if (column === "id") {
      aValue = parseInt(a.children[0].textContent);
      bValue = parseInt(b.children[0].textContent);
    } else if (column === "name") {
      aValue = a.children[1].textContent;
      bValue = b.children[1].textContent;
    } else if (column === "amount") {
      aValue = parseInt(a.children[2].textContent);
      bValue = parseInt(b.children[2].textContent);
    } else if (column === "date") {
      aValue = a.children[3].textContent;
      bValue = b.children[3].textContent;
    }
    if (aValue < bValue) return direction;
    if (aValue > bValue) return -direction;
    return 0;
  });
  let tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = "";
  tableRows.forEach((row) => tableBody.appendChild(row));
}
function searchItems() {
  let searchTerm = document.querySelector("#searchInput").value.toLowerCase();
  let tableRows = Array.from(document.querySelectorAll("table tr"));
  tableRows.shift();
  tableRows.forEach((row) => {
    let rowText = row.textContent.toLowerCase();
    if (rowText.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
document.querySelector("#searchInput").addEventListener("input", searchItems);
