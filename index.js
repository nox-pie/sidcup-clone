// index.js

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



// Authentication Functions

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

// Event listener for the Confirm button
document.getElementById('confirm-button').addEventListener('click', () => {
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const bays = document.getElementById('bays').value;
  const session = document.querySelector('input[name="session"]:checked').value;

  // Validate form input
  if (!date || !time || !bays || !session) {
    alert('Please fill in all fields.');
    return;
  }

  console.log('Form data:', { date, time, bays, session });  // Log the form data

  // Reference to Firebase 'bookings' node
  const bookingRef = ref(db, 'bookings');
  const bookingQuery = query(bookingRef, orderByChild('date'), equalTo(date));

  // Check if the time slot is already booked
  get(bookingQuery).then((snapshot) => {
    console.log('Snapshot received:', snapshot.exists());  // Log whether a snapshot was received

    let available = true;
    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();
      console.log('Checking booking:', booking);  // Log each booking being checked
      if (booking.time === time && booking.session === session) {
        available = false;
      }
    });

    // Add new booking or show error
    if (available) {
      const newBookingRef = ref(db, 'bookings/' + Date.now());
      set(newBookingRef, { date, time, bays, session })
        .then(() => {
          alert('Booking successful!');  // Log booking success
          console.log('Booking saved successfully.');
        })
        .catch((error) => {
          console.error('Error saving booking:', error);  // Log if there's an error saving
        });
    } else {
      alert('Time slot and session are already booked.');
      console.log('Time slot and session already booked.');
    }
  }).catch((error) => {
    console.error("Error checking availability: ", error);  // Log if there's an error checking availability
  });
});

