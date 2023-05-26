// Functioner för html element till functioner i main.js
export function submitForm() {
  return `
    <form id="submitForm" class="w-full">
    <h1 class="text-2xl font-bold my-2 text-center">Create Account</h1>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title"> Name </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          value=""
          required
        />
      </div>
      <div class="w-full px-3 mb-6 md:mb-0 relative">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="number">
          Current Balance
        </label>
        <div class="relative rounded-md shadow-sm">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">$</span>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 pl-10 leading-tight focus:outline-none focus:bg-white"
            id="number"
            name="balance"
            type="number"
            placeholder="1000"
            value=""
            required
          />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">
          Submit
        </button>
      </div>
    </div>
  </form>
      `;
}

export function allAccounts(account, balance) {
  return `
    <div class="border rounded-lg p-4 shadow relative">
        <div>
            <div>
            <h2 class="text-xl font-semibold my-5">${account.name}</h2>
              <div class="flex flex-row text-xs absolute top-0 right-0 p-2">
              <p class="text-gray-700 pr-1">Account Number: </p>
              <p class="text-gray-700">${account._id}</p>
              </div>
            </div>
        </div>
        <p class="text-gray-700 mb-4">
            Balance: ${balance.toLocaleString()}$
        </p> 
        <hr class="border-t border-gray-300 my-1" />
        <div  data-buttonDivID="${account._id}" class="mx-auto w-4/5">
          <div class="flex flex-row justify-evenly mt-3">
              <button data-function="deposit" data-postid="${
                account._id
              }" class="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Deposit
              </button>
              <button data-function="withdraw" data-postid="${
                account._id
              }" class="text-xs bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full">
              Withdraw
              </button>
              <button data-function="delete" data-postid="${
                account._id
              }" class="text-xs bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
              Delete Account
              </button>
          </div>
        </div>
        <div data-depositFormID="${account._id}" class="hidden mt-3">
            <form data-submitFormID="${account._id}"id="submitForm" class="w-full">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3 mb-6 md:mb-0 relative">
                    <label data-labelID="${
                      account._id
                    }"class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="number">
                    </label>
                    <div class="relative rounded-md shadow-sm">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">$</span>
                        <input
                          data-inputID="${account._id}"
                          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 pl-10 leading-tight focus:outline-none focus:bg-white"
                          id="number"
                          name="balance"
                          type="number"
                          placeholder="Minimum 1$ deposit"
                          value=""
                          required
                        />
                    </div>
                </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="flex flex-row justify-between w-full md:w-2/5 px-3 mb-6 md:mb-0">
                        <button data-submitBtnID="${
                          account._id
                        }" class="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">
                            
                        </button>
                        <button data-cancelID="${
                          account._id
                        }" class="text-xs bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>`;
}

export function loginContent() {
  return `
  <div class="flex flex-col items-center justify-center p-5">
  <div class="w-5/12">
    <h1 class="text-2xl font-bold mb-6 text-center">Login/Register</h1>
    <form id="loginForm">
      <div class="mb-4">
        <label for="email" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Username</label>
        <input
          type="text"
          id="username"
          name="user"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          placeholder="Enter your username"
          required
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Password</label>
        <input
          type="password"
          id="password"
          name="pass"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          placeholder="Enter your password"
          required
        />
      </div>
      <div class="flex items-center justify-between w-5/12">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 mr-2"
        >
          Login
        </button>
        <button
          type="button"
          id="registerBtn"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</div>`;
}
