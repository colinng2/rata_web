document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector(".barst");
    const navLinks = document.querySelector(".nav-links");
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("show");
    });

    // Login/Register/Profile/Logout Logic
    const isLoggedIn = localStorage.getItem("loggedIn");

    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const profileLink = document.getElementById("profile-link");
    const logoutLink = document.getElementById("logout-link");
    const userIcon = document.querySelector(".userIcon");

    // If the user is logged in, show Profile and Logout links, hide Login and Register links
    if (isLoggedIn === "true") {
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        profileLink.style.display = "block";
        logoutLink.style.display = "block";

        // Add event listener to user icon to toggle dropdown menu
        userIcon.addEventListener("click", function () {
            const dropdown = document.querySelector(".dropdown-content");
            dropdown.classList.toggle("show");
        });

        // Add event listener to the logout link to log out and redirect
        logoutLink.addEventListener("click", function () {
            localStorage.removeItem("loggedIn");  
            alert("You have logged out.");
            window.location.href = "Home.html";  
        });
    } else {
        // If the user is not logged in, show Login and Register links, hide Profile and Logout links
        loginLink.style.display = "block";
        registerLink.style.display = "block";
        profileLink.style.display = "none";
        logoutLink.style.display = "none";
    }
    // Cart Functionality
    const floatingCart = document.getElementById("floating-cart");
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const checkoutButton = document.getElementById("checkout");
    const cartCounter = document.getElementById("cart-counter");

    let cart = [];

    function loadCart() {
        cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        updateCart();
    }

    function saveCart() {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCounter() {
        const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? "block" : "none";
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        saveCart();
        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const cartItemEl = document.createElement("div");
            cartItemEl.classList.add("cart-item");

            const imgEl = document.createElement("img");
            imgEl.src = item.image;
            cartItemEl.appendChild(imgEl);

            const detailsEl = document.createElement("div");
            detailsEl.classList.add("cart-details");
            detailsEl.innerHTML = `
                <strong>${item.name}</strong>
                <div>Price: RM ${item.price.toFixed(2)}</div>
                <div class="quantity-container">
                    <button class="decrease-qty" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-qty" data-index="${index}">+</button>
                </div>
            `;
            cartItemEl.appendChild(detailsEl);

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.classList.add("remove-btn");
            removeBtn.dataset.index = index;
            cartItemEl.appendChild(removeBtn);

            cartItemsContainer.appendChild(cartItemEl);

            totalPrice += item.price * item.quantity;
        });

        totalPriceEl.textContent = `Total: RM ${totalPrice.toFixed(2)}`;
        updateCartCounter();
    }

    function changeQuantity(index, delta) {
        if (cart[index]) {
            cart[index].quantity += delta;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart();
            updateCart();
        }
    }

    function removeItem(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            saveCart();
            updateCart();
        }
    }

    floatingCart.addEventListener("click", () => {
        cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
    });

    document.querySelectorAll(".menu-item").forEach((menuItem) => {
        menuItem.addEventListener("click", () => {
            const name = menuItem.querySelector("h3").textContent;
            const price = parseFloat(menuItem.querySelector(".price").textContent.replace("RM", "").trim());
            const image = menuItem.querySelector("img").src;

            addToCart({ name, price, image });
        });
    });

    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("increase-qty")) {
            const index = parseInt(e.target.dataset.index, 10);
            changeQuantity(index, 1);
        } else if (e.target.classList.contains("decrease-qty")) {
            const index = parseInt(e.target.dataset.index, 10);
            changeQuantity(index, -1);
        } else if (e.target.classList.contains("remove-btn")) {
            const index = parseInt(e.target.dataset.index, 10);
            removeItem(index);
        }
    });

    checkoutButton.addEventListener("click", () => {
        alert("Checkout functionality coming soon!");
    });

    loadCart(); // Load the cart on page load

    // Menu toggle button
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNavLinks = document.querySelector('.menu-nav-links');

    menuToggle.addEventListener('click', () => {
        menuNavLinks.classList.toggle('show');
        menuToggle.classList.toggle('rotated');
    });
});

// ===== SIGNUP FORM =====
const signUpForm = document.getElementById("signup-form");

if (signUpForm) {
    signUpForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (!username || !email || !password || !confirmPassword) {
            alert("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const userData = { username, email, password };
        localStorage.setItem("user", JSON.stringify(userData)); 

        alert("Registration successful! You will now be redirected to the login page.");
        window.location.href = "login.html"; 
    });
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
            alert("No registered user found! Please sign up first.");
            return;
        }

        const { username: storedUsername, password: storedPassword } = storedUser;

        if (username.toLowerCase() === storedUsername.toLowerCase() && password === storedPassword) {
            localStorage.setItem("loggedIn", "true"); 
            alert("Login successful!");
            window.location.href = "profile.html"; 
        } else {
            alert("Invalid username or password!");
        }
    });
}

// ===== CONTACT FORM =====
const contactForm = document.querySelector(".contact-form");
const contactError = document.getElementById("error-message");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const countryCode = document.getElementById("country-code").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (phone.length < 8 || phone.length > 15) {
            contactError.textContent = "Please enter a valid phone number.";
            contactError.style.display = "block";
            return;
        }

        contactError.style.display = "none";
        alert(`Thank you, ${name}! Your message has been received.`);
        contactForm.reset();
    });
}

// ===== RESERVATION FORM =====
const reservationForm = document.getElementById("reservation-form");
const reservationError = document.getElementById("error-message");

if (reservationForm) {
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const countryCode = document.getElementById("country-code").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const date = document.getElementById("date").value.trim();
        const time = document.getElementById("time").value.trim();
        const guests = document.getElementById("guests").value.trim();
        const specialRequests = document.getElementById("special-requests").value.trim();

        // Phone number validation
        if (phone.length < 8 || phone.length > 15) {
            reservationError.textContent = "Please enter a valid phone number (8–15 digits).";
            reservationError.style.display = "block";
            return;
        }
        
        // Prepare reservation object
        const reservation = {
            name,
            phone: `${countryCode} ${phone}`,
            date,
            time,
            guests,
            specialRequests: specialRequests || "None",
        };

        // Save reservation to localStorage
        const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
        reservations.push(reservation);
        localStorage.setItem("reservations", JSON.stringify(reservations));

        // Confirmation alert
        alert(`Thank you, ${name}! Your reservation for ${date} at ${time} has been confirmed.`);
        reservationForm.reset();
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn && userData) {
        document.getElementById("Username").value = userData.username;
        document.getElementById("email").value = userData.email;

        document.getElementById("login-link").style.display = "none";
        document.getElementById("register-link").style.display = "none";
        document.getElementById("profile-link").style.display = "block";
        document.getElementById("logout-link").style.display = "block";
    }
});

// Logout function
function logout() {
    localStorage.removeItem("loggedIn"); 
    alert("You have been logged out.");
    window.location.href = "Home.html"; 
}

