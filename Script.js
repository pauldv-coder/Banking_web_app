//* CAROUSEL *//

function generalController() {
    const myCarouselElement = document.querySelector('#myCarousel');
    if (myCarouselElement) {
        const carousel = new bootstrap.Carousel(myCarouselElement, {
            interval: 2000,
            touch: false
        });
    }
}

//* REGISTER  *//
    
function userRegistrationController() {
    const inputs = document.querySelectorAll('input');
    const registerButton = document.getElementById("registerButton");
    const form = document.getElementById('userCreationForm');

    function checkInputs() {
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value === "") {
                allFilled = false;
            }
        });

        if (allFilled) {
            registerButton.removeAttribute('disabled');
        } else {
            registerButton.setAttribute('disabled', true);
        }
    }

    
    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);
    });

    const successAlert = document.getElementById('successAlert');
    const addAnotherAccountButton = document.getElementById('addAnotherAccountButton');

    registerButton.addEventListener('click', function () {

        let passwordField = document.getElementById("password");
        let passwordConfirmationField = document.getElementById("passwordConfirmation");
        let passwordLengthHelpText = document.getElementById("passwordLengthHelp");
        let passwordMatchHelpText = document.getElementById("passwordMatchHelp");

        let formIsValid = true;

        if (passwordField && passwordField.value.length < 8) {
            passwordLengthHelpText.textContent = "The password must be at least 8 characters long.";
            passwordField.classList.add("is-invalid");
            formIsValid = false;
        } else if (passwordField) {
            passwordLengthHelpText.textContent = "";
            passwordField.classList.remove("is-invalid");
        }

        if (passwordField && passwordConfirmationField && passwordField.value !== passwordConfirmationField.value) {
            passwordMatchHelpText.textContent = "Passwords do not match.";
            passwordConfirmationField.classList.add("is-invalid");
            formIsValid = false;
        } else if (passwordConfirmationField) {
            passwordMatchHelpText.textContent = "";
            passwordConfirmationField.classList.remove("is-invalid");
        }

        if (!form.checkValidity()) {
            formIsValid = false;
        }

        if (formIsValid) {
            successAlert.style.display = 'block';
            addAnotherAccountButton.style.display = 'block';
    
            let userData = {
                firstName: document.getElementById("nameid").value,
                lastName: document.getElementById("lastnameid").value,
                email: document.getElementById("useremail").value,
                password: document.getElementById("password").value
            };
    
            // Enviar userData al servidor
            fetch('http://localhost:3000/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
        
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            })

            .then(data => {
                if (data.message === "User added successfully!") {
                    setTimeout(() => {
                        window.location.href = '../HTML/Login.html';
                    }, 5000);
                } else {
                   "Intente mas tarde" // manejar errores aquí
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    if (addAnotherAccountButton) {
        addAnotherAccountButton.addEventListener('click', function () {
            form.reset();
            successAlert.style.display = 'none';
        });
    }
}

//* LOGIN *//

function userLoginController() {
    const loginForm = document.querySelector('.loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Descomentado para evitar que la página se refresque

        const userEmail = document.getElementById('useremailLogin').value;
        const userPassword = document.getElementById('passwordLogin').value;

        fetch('http://localhost:3000/all-data')
            .then(response => response.json())
            .then(users => {
                const loggedInUser = users.find(user => user.email === userEmail && user.password === userPassword);

                if (loggedInUser) {
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    window.location.href = '../HTML/Account.html';
                } else {
                    alert('Incorrect email or password!');
                }
            })
            .catch(error => console.error('Error:', error));
    });
}



function logout() {
    document.getElementById("logoutBtn").addEventListener("click", function() {
        
        localStorage.removeItem("userData");
        localStorage.removeItem("loggedInUser");

        
        window.location.href = "../HTML/login.html";
    });
}


function loadSession() {
    
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser && document.getElementById("nameAccount")) {
        
        document.getElementById("nameAccount").textContent = loggedInUser.firstName;
    }
}

    
    // All DATA //

function allDataController() {
    if (document.getElementById("userTableBody")) {
        const allDataContainer = document.getElementById("userTableBody");

        let users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Usuarios cargados del localStorage:', users);

        users.forEach((user, index) => {
            let userInfoRow = document.createElement('tr');
            userInfoRow.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.useremail}</td>
            `;
            allDataContainer.appendChild(userInfoRow);
        });
    }
}

//* VALIDATION AND UPDATE BALANCE *//

function validateInputValue(value) {
    if (isNaN(value) || value.trim() === "") {
        return { isValid: false, message: "Please enter a valid amount." };
    } else if (parseFloat(value) < 0) {
        return { isValid: false, message: "Amount cannot be negative." };
    } else {
        return { isValid: true, message: "" };
    }
}

function updateBalance(currentBalance, amount, operation) {
    if (operation === "deposit") {
        return currentBalance + amount;
    } else if (operation === "withdraw" && amount <= currentBalance) {
        return currentBalance - amount;
    } else {
        return null;
    }
}

    //  DEPOSIT //

function depositController() {
    let currentBalance = parseFloat(document.getElementById('balance').innerText);
    const depositAmountField = document.getElementById('depositAmount');
    const depositButton = document.getElementById('depositButton');
    const successModal = document.getElementById('successModal');

    function validateInput() {
        console.log("Validating input...");
        let value = depositAmountField.value;
        let validationResult = validateInputValue(value);

        if (!validationResult.isValid) {
            depositAmountField.classList.add("is-invalid");
            depositButton.disabled = true;
        } else {
            depositAmountField.classList.remove("is-invalid");
            depositButton.disabled = false;
        }
    }

    function performDeposit() {
        
        console.log("Making deposit...");
        
        const balanceField = document.getElementById('balance');
        let depositAmount = parseFloat(depositAmountField.value);
        const newBalance = updateBalance(currentBalance, depositAmount, "deposit");
        if (newBalance !== null) {
            balanceField.innerText = newBalance.toFixed(2);
        }

        var successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        depositAmountField.value = "";
        depositButton.disabled = true;
    }

    depositAmountField.addEventListener('input', validateInput);
    depositButton.addEventListener('click', performDeposit);

    console.log("Initializing deposit controller...");
}

//*  WITHDRAW  *//

function withdrawController() {

    let currentBalance = parseFloat(document.getElementById('balance').innerText);
    const withdrawAmountField = document.getElementById('withdrawAmount');
    const withdrawButton = document.getElementById('withdrawButton');
    const successModal = document.getElementById('successModal');
    const withdrawHelpText = document.getElementById('yourElementIdForHelpText');

    function validateInput() {
        console.log("Validating input...");
        
        let value = parseFloat(withdrawAmountField.value);
        let validationResult = validateInputValue(value);

        if (!validationResult.isValid || value > currentBalance) {
            withdrawAmountField.classList.add("is-invalid");
            withdrawButton.disabled = true;

            if(value > currentBalance) {
                withdrawHelpText.textContent = "You cannot withdraw more than the available balance.";
            } else {
                withdrawHelpText.textContent = validationResult.message;
            }
        } else {
            withdrawHelpText.textContent = "";
            withdrawAmountField.classList.remove("is-invalid");
            withdrawButton.disabled = false;
        }
    }

    function performWithdrawal() {
        

        var successModalInstance = new bootstrap.Modal(successModal);
        successModalInstance.show();
        withdrawAmountField.value = "";
        withdrawButton.disabled = true;
    }

    
    withdrawAmountField.addEventListener('input', validateInput);
    withdrawButton.addEventListener('click', performWithdrawal);

    console.log("Initializing withdraw controller...");
}

//*CONTENT LOADED*//


document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("withdrawForm")) {
        withdrawController();
    }

    if (document.getElementById("depositForm")) {
        depositController();
    }

    if (document.getElementById("userCreationForm")) {
        userRegistrationController();
    }

    if (document.getElementById("loginForm")) {
        userLoginController();
    }

    if (document.getElementById("userTableBody")) {
        allDataController();
    }

    loadSession();
    logout();
});


