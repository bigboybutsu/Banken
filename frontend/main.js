/* 
Kommentarer ligger på funktioner jag känner behöver 
förklaras för att enklare kunna hitta deras kontext.
Funktioner utan kommentarer har jag försökt snygga upp
så att dem blir lättlästa och där av inte riktigt behöver en
förklaring. T.ex. createAccount gör exakt vad nämnet säger osv.
*/

import { submitForm, allAccounts, loginContent } from "./divHelpers.js";

const main = document.querySelector("main");
const host = "";

const loginScreenBtn = document.querySelector("#log-in");
const createPost = document.querySelector("#create-post");

// Laddar sidan och kollar om man är inloggad eller inte samt körs varje gång en ändring görs...
// Som t.ex deposit,withdraw,login/logout osv
async function loadPage() {
  const data = await getData();
  const loginCheck = await checkLoginStatus();

  loginScreenBtn.innerText = loginCheck ? "Log Out" : "Log In / Register";
  loginScreenBtn.addEventListener("click", loginScreenBtnHandler);

  if (!loginCheck) {
    if (document.querySelector("#loginDiv")) {
      removeExistingLoginMessage();
    } else {
      removeExistingLoginMessage();
      createLoginMessage();
    }
    createPost.classList.add("hidden");
  } else {
    printAccounts(data);
    createPost.classList.remove("hidden");
    createPost.addEventListener("click", function (e) {
      e.preventDefault();
      createAccount();
    });
  }

  function loginScreenBtnHandler(e) {
    e.preventDefault();
    if (loginCheck) {
      logOut();
    } else {
      loginOrRegister();
    }
  }

  function removeExistingLoginMessage() {
    const loginMessage = document.querySelector("#loginMessage");
    if (loginMessage) {
      loginMessage.remove();
    }
  }

  function createLoginMessage() {
    const p = document.createElement("div");
    p.id = "loginMessage";
    p.classList.add("mx-auto", "text-center", "p-80");
    p.innerHTML = `<p class="flex items-center justify-center">Please login to view accounts</p>`;
    main.append(p);
  }
}

// Gör ett anrop till servern för att kolla om man är inloggad
// Används i loadPage()
async function checkLoginStatus() {
  try {
    const response = await axios.get(`${host}/api/users/loggedin`);
    return response.status === 200 && response.data.loggedIn;
  } catch (error) {
    if (error.response?.status === 401) {
      return false;
    }
    throw error;
  }
}

// Används i loadPage()
async function logOut() {
  main.innerHTML = "";
  await axios.post(`${host}/api/users/logout`);
  loadPage();
}

// Används i loadPage() för data om accounts till printAccounts functionen
async function getData() {
  const data = await axios.get(`${host}/api/accounts`);
  return data.data.accounts;
}

// Används för att kunna logga in eller registera en user
// Funktionen används i loadPage()
function loginOrRegister() {
  main.innerHTML = "";
  const loginDiv = document.createElement("div");
  loginDiv.id = "loginDiv";
  loginDiv.innerHTML = loginContent();
  main.append(loginDiv);

  const loginForm = document.querySelector("#loginForm");
  const registerBtn = document.querySelector("#registerBtn");

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
      if (e.target === loginForm) {
        await axios.post(`${host}/api/users/login`, data);
      } else if (registerBtn) {
        await axios.post(`${host}/api/users/register`, data);
      }

      loadPage();

      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (error) {
      if (e.target === loginForm) {
        alert("Wrong login credentials, please try again.");
      } else if (registerBtn) {
        console.error(error);
      }

      console.error(error);
    }
  };

  loginForm?.addEventListener("submit", submitHandler);
  registerBtn?.addEventListener("click", submitHandler);
}

// Används i loadPage() för att ladda in alla accounts
function printAccounts(accounts) {
  main.innerHTML = "";
  const accountsDiv = document.createElement("div");
  accountsDiv.classList.add("accounts", "flex", "justify-center");
  main.append(accountsDiv);

  const accountContainer = document.createElement("div");
  accountContainer.classList.add(
    "container",
    "mx-auto",
    "grid",
    "grid-cols-1",
    "gap-8",
    "w-5/12"
  );
  accountContainer.setAttribute("id", "accountContainer");
  accountsDiv.append(accountContainer);
  console.log(accounts.length);

  if (accounts.length === 0) {
    const div = document.createElement("div");
    div.classList.add("account", "w-full", "text-center", "p-32");
    div.innerHTML = "Please create an account";
    accountContainer.append(div);
  } else {
    accounts.forEach((account) => {
      const balance = parseInt(account.balance);
      const div = document.createElement("div");
      div.classList.add("account", "w-full");
      div.innerHTML = allAccounts(account, balance);
      accountContainer.append(div);
    });
  }

  attachEventListeners("[data-function='delete']", deleteAccount);
  attachEventListeners("[data-function='deposit']", depositOrWithdraw);
  attachEventListeners("[data-function='withdraw']", depositOrWithdraw);

  function attachEventListeners(selector, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => element.addEventListener("click", handler));
  }
}

// Används för att lägga till eller ta bort ett value from ett account.
// Läggs till som eventlisteners inuti printAccounts().
async function depositOrWithdraw(e) {
  const buttonText = e.currentTarget.textContent.trim();
  const id = e.target.dataset.postid;

  const label = document.querySelector(`[data-labelID="${id}"]`);
  const input = document.querySelector(`[data-inputID="${id}"]`);
  const submitBtn = document.querySelector(`[data-submitBtnID="${id}"]`);

  if (buttonText === "Withdraw") {
    label.textContent = "How much do you want to withdraw?";
    input.placeholder = "Minimum 1$ withdrawal";
    submitBtn.textContent = "Withdraw";
  } else if (buttonText === "Deposit") {
    label.textContent = "How much do you want to deposit?";
    input.placeholder = "Minimum 1$ deposit";
    submitBtn.textContent = "Deposit";
  }

  const depositForm = document.querySelector(`[data-depositFormID="${id}"]`);
  depositForm.classList.remove("hidden");

  const button = document.querySelector(`[data-buttonDivID="${id}"]`);
  button.classList.add("hidden");

  const cancelBtn = document.querySelector(`[data-cancelID="${id}"]`);
  cancelBtn.addEventListener("click", cancelHandler);

  const submitForm = document.querySelector(`[data-submitFormID="${id}"]`);
  submitForm.addEventListener("submit", submitHandler);

  function cancelHandler() {
    button.classList.remove("hidden");
    depositForm.classList.add("hidden");
    cancelBtn.removeEventListener("click", cancelHandler);
  }

  // Skickar det värdet som ska uppdateras till servern.
  async function submitHandler(e) {
    e.preventDefault();

    const formData = new FormData(submitForm);
    const data = Object.fromEntries(formData.entries());

    if (buttonText === "Withdraw") {
      data.deposit = false;
    } else if (buttonText === "Deposit") {
      data.deposit = true;
    }

    data._id = id;

    if (data.balance < 1) {
      alert("You cannot deposit less than 1$");
    } else {
      try {
        const result = await axios.post(`${host}/api/accounts/balance`, data);
        if (result.data.badValue === true) {
          alert("You cannot withdraw more than you have!!");
        }
        loadPage();
      } catch (error) {
        console.error(error);
      }
    }

    submitForm.removeEventListener("submit", submitHandler);
  }
}

async function deleteAccount(e) {
  const id = e.target.dataset.postid;
  try {
    await axios.delete(`${host}/api/accounts/${id}`);
    loadPage();
  } catch (error) {
    console.error(error);
  }
}

function createAccount() {
  main.innerHTML = "";

  const container = document.createElement("div");
  container.classList.add(
    "container",
    "mx-auto",
    "grid",
    "grid-cols-1",
    "gap-8",
    "w-5/12"
  );
  container.innerHTML = submitForm();
  main.append(container);

  const submitFormElem = document.querySelector("#submitForm");
  submitFormElem.addEventListener("submit", submitHandler);

  async function submitHandler(e) {
    e.preventDefault();

    const formData = new FormData(submitFormElem);
    const data = Object.fromEntries(formData.entries());

    try {
      await axios.post(`${host}/api/accounts`, data);
      loadPage();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
    }

    submitFormElem.removeEventListener("submit", submitHandler);
  }
}

loadPage();
