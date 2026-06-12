const carsData = [
    { id: 1, name: "Tesla Model 3", type: "EV", price: 89, img: "⚡", available: true },
    { id: 2, name: "Toyota Camry", type: "Sedan", price: 59, img: "🚗", available: true },
    { id: 3, name: "Honda CR-V", type: "SUV", price: 79, img: "🚙", available: true },
    { id: 4, name: "Ford Transit", type: "Van", price: 99, img: "🚐", available: false },
    { id: 5, name: "Hyundai Ioniq 5", type: "EV", price: 94, img: "🔋", available: true },
    { id: 6, name: "BMW X5", type: "SUV", price: 119, img: "🏎️", available: true }
];

let activeFilter = "all";

function renderCars() {
    const grid = document.getElementById("carsGrid");
    if (!grid) return;
    
    let filtered = carsData;
    if (activeFilter !== "all") filtered = carsData.filter(car => car.type === activeFilter);
    
    grid.innerHTML = filtered.map(car => `
        <div class="car-card">
            <div class="car-img">${car.img}</div>
            <div class="car-info">
                <div class="car-name">${car.name}</div>
                <div>${car.type} • ${car.available ? "✅ Available" : "🔴 Booked"}</div>
                <div class="price">$${car.price} / day</div>
                <button class="book-btn" onclick="bookCar(${car.id})" ${!car.available ? "disabled style='opacity:0.5'" : ""}>
                    ${car.available ? "Book Now" : "Not available"}
                </button>
                ${!car.available ? "<div class='date-block'>Held: Jun 12-15</div>" : ""}
            </div>
        </div>
    `).join("");
}

function bookCar(id) {
    const car = carsData.find(c => c.id === id);
    if (!car || !car.available) return;
    
    const start = prompt("Enter start date (YYYY-MM-DD):");
    const end = prompt("Enter end date (YYYY-MM-DD):");
    if (!start || !end) return;
    
    let bookings = JSON.parse(localStorage.getItem("trust_bookings") || "[]");
    bookings.push({ carId: id, carName: car.name, start, end, status: "hold" });
    localStorage.setItem("trust_bookings", JSON.stringify(bookings));
    
    car.available = false; // simple hold (in real app you check date overlap)
    renderCars();
    alert(`✅ ${car.name} held from ${start} to ${end}. Complete payment to confirm.`);
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        activeFilter = this.getAttribute("data-type");
        renderCars();
    });
});

renderCars();
