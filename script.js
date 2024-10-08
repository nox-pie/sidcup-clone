var crsr = document.querySelector("#cursor");
var blur = document.querySelector("#cursor-blur");

document.addEventListener("mousemove", function (dets) {
  crsr.style.left = dets.x + "px";
  crsr.style.top = dets.y + "px";
  blur.style.left = dets.x - 250 + "px";
  blur.style.top = dets.y - 250 + "px";
});

var h4all = document.querySelectorAll("#nav h4");
h4all.forEach(function (elem) {
  elem.addEventListener("mouseenter", function () {
    crsr.style.scale = 3;
    crsr.style.border = "1px solid #fff";
    crsr.style.backgroundColor = "transparent";
  });
  elem.addEventListener("mouseleave", function () {
    crsr.style.scale = 1;
    crsr.style.border = "0px solid #95C11E";
    crsr.style.backgroundColor = "#95C11E";
  });
});

gsap.to("#nav", {
  backgroundColor: "#000",
  duration: 0.5,
  height: "110px",
  scrollTrigger: {
    trigger: "#nav",
    scroller: "body",
    // markers:true,
    start: "top -10%",
    end: "top -11%",
    scrub: 1,
  },
});

gsap.to("#main", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "#main",
    scroller: "body",
    // markers: true,
    start: "top -25%",
    end: "top -70%",
    scrub: 2,
  },
});

gsap.from("#about-us img,#about-us-in", {
  y: 90,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#about-us",
    scroller: "body",
    // markers:true,
    start: "top 70%",
    end: "top 65%",
    scrub: 1,
  },
});
gsap.from(".card", {
  scale: 0.8,
  // opacity:0,
  duration: 1,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".card",
    scroller: "body",
    // markers:false,
    start: "top 70%",
    end: "top 65%",
    scrub: 1,
  },
});
gsap.from("#colon1", {
  y: -70,
  x: -70,
  scrollTrigger: {
    trigger: "#colon1",
    scroller: "body",
    // markers:true,
    start: "top 55%",
    end: "top 45%",
    scrub: 4,
  },
});
gsap.from("#colon2", {
  y: 70,
  x: 70,
  scrollTrigger: {
    trigger: "#colon1",
    scroller: "body",
    // markers:true,
    start: "top 55%",
    end: "top 45%",
    scrub: 4,
  },
});
gsap.from("#page4 h1", {
  y: 50,
  scrollTrigger: {
    trigger: "#page4 h1",
    scroller: "body",
    // markers:true,
    start: "top 75%",
    end: "top 70%",
    scrub: 3,
  },
});


// Go to Account Page
document.querySelector('.account').addEventListener('click', function() {
  const username = checkLoginStatus();
  if (username) {
      showAccountPopup(username);
  } else {
      window.location.href = 'login.html';
  }
});


// Go to Booking Page
document.querySelector('.book').addEventListener('click', function() {
  window.location.href = 'booking.html';
})




        // <-----Popup Functionality----->

var navLinks = document.querySelectorAll("#nav a");
navLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        document.getElementById('popup-message').innerText = 'COMING SOON :)';
        document.getElementById('popup').style.display = 'flex'; // Show the popup
    });
});

// Close popup functionality
document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none'; // Hide the popup
});

// Optional: Close popup when clicking outside of it
window.onclick = function(event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        popup.style.display = 'none'; // Hide the popup
    }
};

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
















