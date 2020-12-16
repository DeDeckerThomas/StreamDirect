let email = {},
  signInButton;

const signUp = function () {
  if (!isEmpty(email.input.value) && isValidEmailAddress(email.input.value)) {
    console.log(location.port);
    window.location.href = "/app";
  }
};

const isValidEmailAddress = function (emailAddress) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function (fieldValue) {
  return !fieldValue || !fieldValue.length;
};

const doubleCheckEmailAddress = function () {
  if (!isEmpty(email.input.value) && isValidEmailAddress(email.input.value)) {
    removeErros(email.field, email.errorMessage);
  } else {
    addErrors(email.field, email.errorMessage, "Invalid emailaddress");
  }
};

const removeErros = function (formField, errorField) {
  formField.classList.remove("has-error");
  errorField.innerHTML = "";
};

const addErrors = function (formField, errorField, errorMessage) {
  formField.classList.add("has-error");
  errorField.innerHTML = errorMessage;
};

const enableListeners = function () {
  email.input.addEventListener("blur", () => {
    if (isEmpty(email.input.value) || !isValidEmailAddress(email.input.value)) {
      addErrors(
        email.field,
        email.errorMessage,
        isEmpty(email.input.value) ? "This field is required" : "Invalid emailaddress"
      );
      email.input.addEventListener("input", doubleCheckEmailAddress);
    } else {
      removeErros(email.field, email.errorMessage);
      email.input.removeEventListener("input", doubleCheckEmailAddress);
    }
  });
  signInButton.addEventListener("click", (e) => {
    if (isEmpty(email.input.value) && !isValidEmailAddress(email.input.value)) {
      e.preventDefault();
      addErrors(
        email.field,
        email.errorMessage,
        isEmpty(email.input.value) ? "This field is required" : "Invalid emailaddress"
      );
    }
  });
};

const getDOMElements = function () {
  email.field = document.querySelector(".js-email-field");
  email.input = document.querySelector(".js-email-input");
  email.errorMessage = document.querySelector(".js-email-error-message");
  signInButton = document.querySelector(".js-sign-up-button");
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded! 🥳");
  getDOMElements();
  enableListeners();
});
