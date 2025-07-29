document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignInMobileBtn = document.getElementById('showSignInMobile');
    const showSignUpMobileBtn = document.getElementById('showSignUpMobile');

    // Desktop: Sliding panel toggle
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => container.classList.add("right-panel-active"));
    }
    if (signInBtn) {
        signInBtn.addEventListener('click', () => container.classList.remove("right-panel-active"));
    }

    // Mobile: Show/hide form toggle
    if (showSignInMobileBtn) {
        showSignInMobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            container.classList.remove('show-signup');
        });
    }
    if (showSignUpMobileBtn) {
        showSignUpMobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            container.classList.add('show-signup');
        });
    }

    // --- Modern Form Handling ---

    const setLoading = (button, isLoading) => {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    };

    const showMessage = (form, message, isError = true) => {
        const messageContainer = form.querySelector('.form-message');
        messageContainer.textContent = message;
        messageContainer.className = `form-message ${isError ? 'error' : 'success'}`;
    };

    const clearMessage = (form) => {
        const messageContainer = form.querySelector('.form-message');
        messageContainer.textContent = '';
        messageContainer.className = 'form-message';
    };

    // Sign Up Form Submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearMessage(this);
        const submitButton = this.querySelector('.btn');
        const password = this.password.value;
        const confirmPassword = this.confirmPassword.value;

        if (password.length < 6) {
            showMessage(this, "Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            showMessage(this, "Passwords do not match!");
            return;
        }

        setLoading(submitButton, true);
        // Simulate a network request
        setTimeout(() => {
            setLoading(submitButton, false);
            showMessage(this, "Account created successfully! Please log in.", false);
        }, 2000);
    });

    // Login Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearMessage(this);
        const submitButton = this.querySelector('.btn');

        setLoading(submitButton, true);
        // Simulate a network request
        setTimeout(() => {
            setLoading(submitButton, false);
            // On a real site, you'd check credentials here.
            // For the demo, we'll just show a success message.
            showMessage(this, "Login successful! Redirecting...", false);
            // window.location.href = '/'; // Uncomment to redirect after login
        }, 2000);
    });
});
