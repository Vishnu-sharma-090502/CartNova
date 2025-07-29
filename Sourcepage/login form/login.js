const container = document.getElementById('container');
document.getElementById('signUp').addEventListener('click', () => {
  container.classList.add("right-panel-active");
});
document.getElementById('signIn').addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Basic frontend validation example for signup form
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const password = this.password.value;
  const confirmPassword = this.confirmPassword.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Example success action
  alert("Signup successful! (You can connect backend here)");
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Example action
  alert("Login successful! (You can connect backend here)");
});
