document.addEventListener('DOMContentLoaded', () => {
    const passwordToggle = document.querySelectorAll('.toggle-visibility');
    passwordToggle.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggle.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                toggle.textContent = 'Show';
            }
        });
    });

    const toggleLink = document.querySelector('.toggle-link');
    if (toggleLink) {
        toggleLink.addEventListener('click', () => {
            const signupForm = document.querySelector('#signup-form');
            const loginForm = document.querySelector('#login-form');
            if (signupForm && loginForm) {
                if (signupForm.style.display === 'none') {
                    signupForm.style.display = 'block';
                    loginForm.style.display = 'none';
                    toggleLink.textContent = 'Already have an account? Login here';
                } else {
                    signupForm.style.display = 'none';
                    loginForm.style.display = 'block';
                    toggleLink.textContent = 'Don\'t have an account? Signup here';
                }
            }
        });
    }

    // Client-side validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            const inputs = form.querySelectorAll('input[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value) {
                    valid = false;
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
            });
            if (!valid) {
                event.preventDefault();
                toastr.error('Please fill in all required fields.');
            }
        });
    });
});


// nav 
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = dropdownMenu.getAttribute('aria-expanded') === 'true' || false;
        dropdownMenu.setAttribute('aria-expanded', !expanded);
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownMenu.setAttribute('aria-expanded', false);
            dropdownMenu.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownMenu.setAttribute('aria-expanded', false);
            dropdownMenu.classList.remove('active');
        }
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
});
