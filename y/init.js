document.addEventListener('DOMContentLoaded', async () => {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDBNdxCVeRpQWyVQ_HOEP2AY1EeOe7wAxo",
    authDomain: "flightmate2-ab3c4.firebaseapp.com",
    databaseURL: "https://flightmate2-ab3c4-default-rtdb.firebaseio.com",
    projectId: "flightmate2-ab3c4",
    storageBucket: "flightmate2-ab3c4.firebasestorage.app",
    messagingSenderId: "654502431349",
    appId: "1:654502431349:web:29b45d3c4cbbfa6966463c",
    measurementId: "G-TP8R11BTGY"
  };

  // Initialize Firebase
  const app = await firebase.initializeApp(firebaseConfig);

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const authStatus = document.getElementById('auth-status');
  const messageBox = document.getElementById('message');
  const authContainer = document.getElementById('auth-container');
  const logoutBtn = document.getElementById('logout-btn');
  const welcomeUser = document.getElementById('welcome-user');
  const schedulesContainer = document.getElementById('schedules-container');
  const theme1 = document.getElementById('theme1');
  const theme2 = document.getElementById('theme2');

  let storedTheme = localStorage.getItem('theme');
  if (!storedTheme) {
    localStorage.setItem('theme', 'light');
    storedTheme = 'light';
  } else {
    if (storedTheme === 'light') {
      messageBox.style.background = "white";
      messageBox.style.color = "black";
      authContainer.style.background = "white";
      authContainer.style.color = "black";
      document.body.style.background = "#ECEFF1";    
    } else {
      messageBox.style.background = "#333";
      messageBox.style.color = "white";
      authContainer.style.background = "#333";
      authContainer.style.color = "white";
      document.body.style.background = "black";
    }
  }

  const changeTheme = () => {
    if (storedTheme === 'light') {
      messageBox.style.background = "#333";
      messageBox.style.color = "white";
      authContainer.style.background = "#333";
      authContainer.style.color = "white";
      document.body.style.background = "black";
      storedTheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      messageBox.style.background = "white";
      messageBox.style.color = "black";
      authContainer.style.background = "white";
      authContainer.style.color = "black";
      document.body.style.background = "#ECEFF1";
      storedTheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }

  theme1.addEventListener('click', changeTheme)
  theme2.addEventListener('click', changeTheme)

  // Login
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        showMessage(userCredential.user);
      })
      .catch((error) => {
        authStatus.textContent = error.message;
      });
  });

  // Sign Up
  signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        showMessage(userCredential.user);
      })
      .catch((error) => {
        authStatus.textContent = error.message;
      });
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      authContainer.style.display = 'block';
      messageBox.style.display = 'none';
    });
  });

  // Display user info and load schedules
  function showMessage(user) {
    authContainer.style.display = 'none';
    messageBox.style.display = 'block';
    welcomeUser.textContent = `Hello, ${user.email}`;
    loadSchedules();
  }

  // Load schedules from Firestore
  function loadSchedules() {
    firebase.firestore().collection('schedules').get()
      .then((querySnapshot) => {
        const schedules = [];
        querySnapshot.forEach((doc) => {
          schedules.push(doc.data());
        });
        renderSchedules(schedules);
      })
      .catch((error) => {
        schedulesContainer.innerHTML = `<p>Error loading schedules: ${error.message}</p>`;
      });
  }

  // Render schedules to the page
  function renderSchedules(schedules) {
    if (schedules.length === 0) {
      schedulesContainer.innerHTML = '<p>No schedules available.</p>';
      return;
    }

    let tableHtml = `
      <table>
        <tr>
          <th>Airplane Name</th>
          <th>Arrival Airport</th>
          <th>Arrival Time</th>
          <th>Departure Airport</th>
          <th>Departure Time</th>
          <th>Main Pilot Name</th>
          <th>Second Pilot Name</th>
          <th>Timestamp</th>
        </tr>`;

    schedules.forEach((schedule) => {
      const airplaneName = schedule.airplaneName || 'N/A';
      const arrivalAirport = schedule.arrivalAirport || 'N/A';
      const arrivalTime = schedule.arrivalTime || 'N/A';
      const departureAirport = schedule.departureAirport || 'N/A';
      const departureTime = schedule.departureTime || 'N/A';
      const mainPilotName = schedule.mainPilotName || 'N/A';
      const secondPilotName = schedule.secondPilotName || 'N/A';

      let ts = 'N/A';
      if (schedule.timestamp && schedule.timestamp.toDate) {
        ts = schedule.timestamp.toDate().toLocaleString();
      }

      tableHtml += `
        <tr>
          <td>${airplaneName}</td>
          <td>${arrivalAirport}</td>
          <td>${arrivalTime}</td>
          <td>${departureAirport}</td>
          <td>${departureTime}</td>
          <td>${mainPilotName}</td>
          <td>${secondPilotName}</td>
          <td>${ts}</td>
        </tr>`;
    });
    tableHtml += '</table>';
    schedulesContainer.innerHTML = tableHtml;
  }

  // Check auth state
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      showMessage(user);
    }
  });
});