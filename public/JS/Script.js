//*EVENT LISTENER*//

document.addEventListener("DOMContentLoaded", function() {
    initControllers();
    loadSession();
    logout();
});

//Initializes controllers

function initControllers() {
    if (document.querySelector("#myCarousel")) {
        carouselController();
    }

    if (document.querySelector("#contactForm")) {
        contactFormController();
    }
    

    if (document.querySelector("#userCreationForm")) {
        userRegistrationController();
    }

    if (document.querySelector(".loginForm")) {
        userLoginController();
    }

    if (document.querySelector("#depositForm")) {
        depositController();
    }

    if (document.querySelector("#withdrawForm")) {
        withdrawController();
    }

    if (document.querySelector("#userTableBody")) {
        allDataController();
    }
}

//* CAROUSEL CONTROLLER *//

function carouselController() {
    const carousel = new bootstrap.Carousel(document.querySelector('#myCarousel'), {
        interval: 2000,
        touch: false
    });
}


//* CONTACT FORM *//

function contactFormController() {
    const form = document.querySelector("#contactForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let nombre = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let mensaje = document.getElementById("menssage").value;

        sendDataAPI(name, email, message)
            .then(data => {
                if(data.success) {
                    alert("Thanks, " + nombre + "! We have received your message.");
                } else {
                    alert("There was an error sending the message. Please try again.");
                }
            })
            .catch(error => {
                console.error('There was an error sending the data:', error);
                alert("There was an error sending the message. Please check your connection and try again.");
            });

        console.log(`Name: ${name}, Email: ${email}, Mensaje: ${message}`);

        event.target.reset();
    });
}

function enviarDatosAPI(name, email, message) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => reject(error));
    });
}




//* REGISTER CONTROLLER  *//


function isValidEmail(email) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}


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

        let userEmailField = document.getElementById("useremail");

        if (!isValidEmail(userEmailField.value)) {
            userEmailField.textContent = "Please enter a valid email address.";
            userEmailField.classList.add("is-invalid");
            formIsValid = false;
        } else {
            userEmailField.classList.remove("is-invalid");
        }

        if (!form.checkValidity()) {
            formIsValid = false;
        }

        if (formIsValid) {
            successAlert.style.display = 'block';
            addAnotherAccountButton.style.display = 'block';

            let currentDate = new Date().toISOString().split('T')[0];

            let userData = {
                firstName: document.getElementById("nameid").value,
                lastName: document.getElementById("lastnameid").value,
                email: document.getElementById("useremail").value,
                password: document.getElementById("password").value,
                createdDate: currentDate
            };
            
    
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
                   "Try again later"
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
        event.preventDefault();

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
    const logoutBtn = document.querySelector("#logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("userData");
            localStorage.removeItem("loggedInUser");
            window.location.href = "../HTML/login.html";
        });
    }
}



function loadSession() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const nameAccountElement = document.querySelector("#nameAccount");
    const userEmailElement = document.querySelector("#userInfo");

    if (loggedInUser) {
        if (nameAccountElement) {
            nameAccountElement.textContent = loggedInUser.firstName;
        }
        if (userEmailElement) {
            userEmailElement.textContent = loggedInUser.email;
        }
    }
}

    
    //* ALL DATA *//

function allDataController() {
    if (document.getElementById("userTableBody")) {
        const allDataContainer = document.getElementById("userTableBody");
        
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        
        if(!loggedInUser) {
            console.log("No user logged in.");
            return;
        }

        fetch(`http://localhost:3000/user-data?email=${loggedInUser.email}`)
        .then(response => response.json())
        .then(userData => {
            console.log('Logged in user data:', userData);
            
            allDataContainer.innerHTML = "";

          
            if (userData.transactions && userData.transactions.length > 0) {
                userData.transactions.forEach(transaction => {
                    let transactionRow = document.createElement('tr');
                    transactionRow.innerHTML = `
                        <th scope="row">${transaction.date || "N/A"}</th>
                        <td>${transaction.type === 'deposit' ? `Deposited: ${transaction.amount}` : `Withdrew: ${transaction.amount}`}</td>
                        <td>${transaction.balanceAfterTransaction || "N/A"}</td>
                    `;
                    allDataContainer.appendChild(transactionRow);
                });
            } else {
                let noTransactionsRow = document.createElement('tr');
                noTransactionsRow.innerHTML = `
                    <td colspan="3">No transactions available</td>
                `;
                allDataContainer.appendChild(noTransactionsRow);
            }
            
        })
        .catch(error => console.error('Error loading logged in user data:', error));
    }
}





//* VALIDATION AND UPDATE BALANCE *//

function validateInputValue(value) {
    
    value = String(value).trim();

    if (isNaN(value) || value === "") {
        return { isValid: false, message: "Please enter a valid amount." };
    } else if (parseFloat(value) < 0) {
        return { isValid: false, message: "Amount cannot be negative." };
    } else if (value <= 0) {
        return { isValid: false, message: "Amount should be greater than zero." };
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
    const successModalElement = document.getElementById('successModal');
    const successModal = new bootstrap.Modal(successModalElement);

    successModalElement.addEventListener('hidden.bs.modal', function() {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        for (let backdrop of backdrops) {
            backdrop.remove();
        }
    });

    function validateInput() {
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
        const balanceField = document.getElementById('balance');
        let currentBalance = parseFloat(balanceField.innerText);
        let depositAmount = parseFloat(depositAmountField.value);
        const newBalance = updateBalance(currentBalance, depositAmount, "deposit");
    
        if (newBalance !== null) {
            balanceField.innerText = newBalance.toFixed(2);
    
            
            let transaction = {
                type: "deposit",
                amount: depositAmount,
                date: new Date().toISOString().split('T')[0]
            };
            loggedInUser.transactions.push(transaction);
    
            successModal.show();
            depositAmountField.value = "";
            depositButton.disabled = true;
        }
    }

    depositAmountField.addEventListener('input', validateInput);
    depositButton.addEventListener('click', performDeposit);
}



//*  WITHDRAW  *//

function withdrawController() {
    const balanceField = document.getElementById('balance');
    let currentBalance = parseFloat(balanceField.innerText);
    const withdrawAmountField = document.getElementById('withdrawAmount');
    const withdrawButton = document.getElementById('withdrawButtom');
    const successModal = document.getElementById('successModal');
    const withdrawHelpText = document.getElementById('withdrawHelpText');

    function validateInput() {

        console.log("validateInput function has been called!");

        let value = parseFloat(withdrawAmountField.value);
        console.log("Input value:", value);
        
        let validationResult = validateInputValue(value);
        console.log("Validation result:", validationResult);
    
        if (!validationResult.isValid || value > currentBalance) {
            console.log("Setting button to disabled");
            withdrawAmountField.classList.add("is-invalid");
            withdrawButton.disabled = true;
    
            if(value > currentBalance) {
                withdrawHelpText.textContent = "You cannot withdraw more than the available balance.";
            } else {
                withdrawHelpText.textContent = validationResult.message;
            }
        } else {
            console.log("Setting button to enabled");
            withdrawHelpText.textContent = "";
            withdrawAmountField.classList.remove("is-invalid");
            withdrawButton.disabled = false;
        }
    }
    

    function performWithdrawal() {
        let withdrawalAmount = parseFloat(withdrawAmountField.value);
        const newBalance = updateBalance(currentBalance, withdrawalAmount, "withdraw");
    
        if (newBalance !== null) {
            balanceField.innerText = newBalance.toFixed(2);
    
          
            let transaction = {
                type: "withdraw",
                amount: withdrawalAmount,
                date: new Date().toISOString().split('T')[0]
            };
            loggedInUser.transactions.push(transaction);
    
            var successModalInstance = new bootstrap.Modal(successModal);
            successModalInstance.show();
            withdrawAmountField.value = "";
            withdrawButton.disabled = true;
        } else {
            console.error("Error: Couldn't update the balance.");
        }
    }
    

    withdrawAmountField.addEventListener('input', validateInput);
    withdrawButton.addEventListener('click', performWithdrawal);

    console.log("Initializing withdraw controller...");
}