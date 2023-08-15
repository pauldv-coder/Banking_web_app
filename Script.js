// CAROUSEL //

function generalController() {
    const myCarouselElement = document.querySelector('#myCarousel');
    if (myCarouselElement) {
        const carousel = new bootstrap.Carousel(myCarouselElement, {
            interval: 2000,
            touch: false
        });
    }
}

//--- REGISTER --- //
    
function userRegistrationController() {
    const inputs = document.querySelectorAll('input');
    const registerButton = document.getElementById("registerButton");
    const form = document.getElementById('userCreationForm');

    
    // Función para verificar si todos los campos tienen datos
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

    // Añadir detector de eventos a cada campo de entrada
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
            // Si es válido, muestra el mensaje de éxito y el botón para añadir otra cuenta
            successAlert.style.display = 'block';
            addAnotherAccountButton.style.display = 'block';

            let userData = {
                firstName: document.getElementById("nameid").value,
                lastName: document.getElementById("lastnameid").value,
                email: document.getElementById("useremail").value,
                password: document.getElementById("password").value  // Añadimos la contraseña aquí
            };

            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            setTimeout(() => {
                window.location.href = '../HTML/Login.html';
            }, 5000); 
            
        }
        
        
    });

    if (addAnotherAccountButton) {
        addAnotherAccountButton.addEventListener('click', function () {
            form.reset(); // Reiniciando directamente el formulario
            successAlert.style.display = 'none';
        });
    }
}


function userLoginController() {
    const loginForm = document.querySelector('.loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userEmail = document.getElementById('useremailLogin').value;
        const userPassword = document.getElementById('passwordLogin').value;

        // Parsea el objeto JSON almacenado
        const storedCredentials = JSON.parse(localStorage.getItem('userCredentials'));
        const storedEmail = storedCredentials ? storedCredentials.email : null;
        const storedPassword = storedCredentials ? storedCredentials.password : null;

        // Verifica si las credenciales ingresadas coinciden con las almacenadas
        if (userEmail === storedEmail && userPassword === storedPassword) {
            window.location.href = 'Account.html';
        } else {
            alert('Incorrect email or password!');
        }
    });
}


function logout() {
    document.getElementById("logoutBtn").addEventListener("click", function() {
        // Limpiar los datos de usuario del localStorage
        localStorage.removeItem("userData");

        // Redirigir al usuario a la página de inicio o inicio de sesión
        window.location.href = "../HTML/login.html"; // Asume que tu página de inicio de sesión se llama "login.html"
    });
}

function loadSession() {
    let userData = localStorage.getItem("userData");
    if (userData) {
        let user = JSON.parse(userData);
        if(document.getElementById("userInfo")) {
            document.getElementById("userInfo").textContent = user.email;
        }
        // Aquí también puedes cargar otros datos, como el saldo, etc.
    }
}

    
    // All DATA //

function allDataController() {
    if (document.getElementById("userTableBody")) {
        const allDataContainer = document.getElementById("userTableBody");

        // Obtener usuarios del localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Usuarios cargados del localStorage:', users);  // Añadido para hacer seguimiento

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

/*VALIDATION AND UPDATE BALANCE*/

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

    // --- Deposit --- //

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

    // Establecer event listeners aquí:
    depositAmountField.addEventListener('input', validateInput);
    depositButton.addEventListener('click', performDeposit);

    console.log("Initializing deposit controller...");
}

// --- Withdraw --- //

function withdrawController() {

    let currentBalance = parseFloat(document.getElementById('balance').innerText);
    const withdrawAmountField = document.getElementById('withdrawAmount');
    const withdrawButton = document.getElementById('withdrawButton'); // Corrección aquí: 'withdrawButton'
    const successModal = document.getElementById('successModal');
    const withdrawHelpText = document.getElementById('yourElementIdForHelpText'); // Asegúrate de asignar el elemento correcto para el texto de ayuda aquí.

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
        // ... (resto del código sigue igual)

        var successModalInstance = new bootstrap.Modal(successModal);
        successModalInstance.show();
        withdrawAmountField.value = "";
        withdrawButton.disabled = true;
    }

    // Establecer event listeners aquí:
    withdrawAmountField.addEventListener('input', validateInput);
    withdrawButton.addEventListener('click', performWithdrawal);

    console.log("Initializing withdraw controller...");
}

/*Session*/


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

    if (document.querySelector('event')) {
        userLoginController();
    }

    if (document.getElementById("userTableBody")) {
        allDataController();
    }

    loadSession();
    logout();
});


