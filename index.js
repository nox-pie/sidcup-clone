// index.js

// Import the Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEDsXirvlkiJYBCiA5zqxnnLnbt7WeSnY",
    authDomain: "sidcup-clone.firebaseapp.com",
    projectId: "sidcup-clone",
    storageBucket: "sidcup-clone.appspot.com",
    messagingSenderId: "1098983771870",
    appId: "1:1098983771870:web:ec441d4fd7845992a03c4f",
    measurementId: "G-L8HVH7PQ1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Check login status in localStorage
function checkLoginStatus() {
    return localStorage.getItem('username'); // Assume 'username' is saved when the user logs in
}

// Function to show the account popup
function showAccountPopup(username) {
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerHTML = `<strong>Welcome, ${username}!</strong><br><button id="signout-btn">Sign out</button>`;
    document.getElementById('popup').style.display = 'flex';

    // Sign out functionality
    document.getElementById('signout-btn').addEventListener('click', function() {
        localStorage.removeItem('username'); // Clear login info
        window.location.reload(); // Reload page to reset state
    });
}

// Check login status on page load
const username = checkLoginStatus();
if (username && window.location.pathname !== '/booking.html') {
    showAccountPopup(username);
}

// Handle navigation for login page
const signUpLink = document.getElementById('signUpLink');
if (signUpLink) {
    signUpLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'signup.html';  // Redirect to Signup page
    });
}

const forgotPasswordLink = document.getElementById('forgotPasswordLink');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'forgot-password.html';  // Redirect to Forgot Password page
    });
}

// Handle navigation for signup page
const loginLink = document.getElementById('loginLink');
if (loginLink) {
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'login.html';  // Redirect to Login page
    });
}

// Handle back to login from forgotten password page
const backToLoginButton = document.getElementById('backToLoginButton');
if (backToLoginButton) {
    backToLoginButton.addEventListener('click', function() {
        window.location.href = 'login.html';  // Redirect back to Login page
    });
}

// Go to Home Page
document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Navigation Logic
const navigateTo = (link, targetPage) => {
    if (link) {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = targetPage;
        });
    }
};

// Redirect to Signup and Forgot Password pages from Login
navigateTo(document.getElementById('signUpLink'), 'signup.html');
navigateTo(document.getElementById('forgotPasswordLink'), 'forgot-password.html');

// Redirect to Login page from Signup and Forgot Password pages
navigateTo(document.getElementById('loginLink'), 'login.html');
navigateTo(document.getElementById('backToLoginButton'), 'login.html');

// Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const firstname = document.getElementById('firstname').value;
        const surname = document.getElementById('surname').value;
        const mobile = document.getElementById('mobile').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postcode = document.getElementById('postcode').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Save additional user details in the database
                const userRef = ref(db, 'users/' + user.uid);
                set(userRef, {
                    email,
                    firstname,
                    surname,
                    mobile,
                    address,
                    city,
                    postcode
                })
                .then(() => {
                    alert('Account created successfully!');
                    localStorage.setItem('username', email); // Store username
                    window.location.href = 'login.html';  // Redirect to Login page on success
                })
                .catch((error) => {
                    console.error('Error saving user details:', error);
                });
            })
            .catch((error) => {
                console.error('Error signing up:', error);
                alert('Error signing up: ' + error.message);
            });
    });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('username', email); // Store username
                window.location.href = 'index.html';  // Redirect to the main page on success
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                alert('Error logging in: ' + error.message);
            });
    });
}

// Forgot Password
const forgotPasswordForm = document.getElementById('forgot-password-form');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = forgotPasswordForm.querySelector('input[type="email"]').value;

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Password reset email sent.');
                window.location.href = 'login.html';  // Redirect to Login page on success
            })
            .catch((error) => {
                console.error('Error sending password reset email:', error);
                alert('Error sending password reset email: ' + error.message);
            });
    });
}


// <-----BOOKING LOGIC----->

// Function to set the minimum date for the date picker
function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if necessary

    const minDate = `${year}-${month}-${day}`;
    document.getElementById('date').setAttribute('min', minDate); // Set the min attribute to today's date
}

// Call the function to set the min date when the page loads
setMinDate();

// Event listener for the Confirm button
document.getElementById('confirm-button').addEventListener('click', () => {
    // Check if the user is logged in
    const username = checkLoginStatus();
    if (!username) {
        alert('Please log in to make a booking.');
        return; // Exit the function if the user is not logged in
    }

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const bays = document.getElementById('bays').value;
    const session = document.querySelector('input[name="session"]:checked').value;

    // Validate form input
    if (!date || !time || !bays || !session) {
        alert('Please fill in all fields.');
        return;
    }

    console.log('Form data:', { date, time, bays, session }); // Log the form data

    // Reference to Firebase 'bookings' node
    const bookingRef = ref(db, 'bookings');
    const bookingQuery = query(bookingRef, orderByChild('date'), equalTo(date));

    // Check if the time slot is already booked
    get(bookingQuery).then((snapshot) => {
        console.log('Snapshot received:', snapshot.exists()); // Log whether a snapshot was received

        let available = true;
        snapshot.forEach((childSnapshot) => {
            const booking = childSnapshot.val();
            console.log('Checking booking:', booking); // Log each booking being checked
            if (booking.time === time && booking.session === session) {
                available = false;
            }
        });

        // Add new booking or show error
        if (available) {
            const newBookingRef = ref(db, 'bookings/' + Date.now());
            set(newBookingRef, { date, time, bays, session })
                .then(() => {
                    alert('Booking successful!'); // Log booking success
                    console.log('Booking saved successfully.');

                    // Clear the form fields after successful booking
                    document.getElementById('date').value = '';
                    document.getElementById('time').value = '';
                    document.getElementById('bays').value = '';
                    document.querySelector('input[name="session"]:checked').checked = false;
                })
                .catch((error) => {
                    console.error('Error saving booking:', error); // Log if there's an error saving
                });
        } else {
            alert('Time slot and session are already booked.');
            console.log('Time slot and session already booked.');
        }
    }).catch((error) => {
        console.error("Error checking availability: ", error); // Log if there's an error checking availability
    });
});

