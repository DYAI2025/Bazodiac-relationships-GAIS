/* Bazodiac Relationships - Authentication Prototype Logic & Adapter */

// 1. Safe next parameter helper
function getSafeNextParam() {
  const ALLOWED_NEXT = new Set(["create-report", "home"]);
  try {
    const params = new URLSearchParams(window.location.search);
    const nextVal = params.get("next");
    if (ALLOWED_NEXT.has(nextVal)) {
      return nextVal;
    }
  } catch (e) {
    // Ignore error, fallback to home
  }
  return "home";
}

// 2. Authentication adapter boundary (No cookies, no local/session storage, no network)
const authAdapter = {
  async register(input) {
    // Simulate brief network lag for loading state demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      status: "PROTOTYPE_ONLY",
      accountCreated: false,
      message: "Frontend prototype complete. No account was created and no data was sent."
    };
  },

  async login(input) {
    // Simulate brief network lag for loading state demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      status: "PROTOTYPE_ONLY",
      sessionCreated: false,
      message: "Frontend prototype complete. No session was created and no data was sent."
    };
  }
};

// Expose adapter to window
window.authAdapter = authAdapter;

// 3. Password Visibility Toggle helper
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".btn-toggle-password");
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const inputId = btn.getAttribute("aria-controls");
      const inputEl = document.getElementById(inputId);
      if (inputEl) {
        if (inputEl.type === "password") {
          inputEl.type = "text";
          btn.textContent = "Hide password";
        } else {
          inputEl.type = "password";
          btn.textContent = "Show password";
        }
      }
    });
  });
}

// 4. Client-side Form Validations & State Handling
document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();

  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const errorSummary = document.getElementById("error-summary");
  const errorSummaryList = document.getElementById("error-summary-list");
  const statusToastContainer = document.getElementById("status-toast-container");

  // Helper to show modal toast status instead of alert()
  function showStatusToast(title, msg) {
    const toast = document.createElement("div");
    toast.className = "status-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <h4>${title}</h4>
      <p>${msg}</p>
    `;
    if (statusToastContainer) {
      statusToastContainer.innerHTML = "";
      statusToastContainer.appendChild(toast);
      // Auto remove after 6 seconds
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
      }, 6000);
    }
  }

  // Clear existing errors
  function clearErrors(form) {
    if (errorSummary) {
      errorSummary.classList.remove("visible");
      errorSummaryList.innerHTML = "";
    }
    const inputs = form.querySelectorAll(".form-input");
    inputs.forEach(input => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      const errorMsg = document.getElementById(`${input.id}-error`);
      if (errorMsg) {
        errorMsg.classList.remove("visible");
        errorMsg.textContent = "";
      }
    });
  }

  // Show a field-specific error
  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      const errorMsg = document.getElementById(`${inputId}-error`);
      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.add("visible");
      }
    }
  }

  // Append error to summary
  function appendToErrorSummary(message, focusTargetId) {
    if (errorSummary && errorSummaryList) {
      errorSummary.classList.add("visible");
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${focusTargetId}`;
      a.textContent = message;
      a.className = "link-alt";
      a.style.fontSize = "0.85rem";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById(focusTargetId);
        if (el) el.focus();
      });
      li.appendChild(a);
      errorSummaryList.appendChild(li);
    }
  }

  // --- REGISTRATION FORM HANDLER ---
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors(registerForm);

      const emailVal = document.getElementById("email").value.trim();
      const passwordVal = document.getElementById("password").value;
      const confirmPasswordVal = document.getElementById("confirm-password").value;
      const consentChecked = document.getElementById("consent").checked;

      let hasErrors = false;
      const errors = [];

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showFieldError("email", "Email address is required.");
        errors.push({ id: "email", msg: "Email address is required." });
        hasErrors = true;
      } else if (!emailRegex.test(emailVal)) {
        showFieldError("email", "Please enter a valid email address.");
        errors.push({ id: "email", msg: "Please enter a valid email address." });
        hasErrors = true;
      }

      // Password validation
      if (!passwordVal) {
        showFieldError("password", "Password is required.");
        errors.push({ id: "password", msg: "Password is required." });
        hasErrors = true;
      }

      // Confirm Password validation
      if (!confirmPasswordVal) {
        showFieldError("confirm-password", "Please confirm your password.");
        errors.push({ id: "confirm-password", msg: "Please confirm your password." });
        hasErrors = true;
      } else if (passwordVal !== confirmPasswordVal) {
        showFieldError("confirm-password", "Passwords do not match.");
        errors.push({ id: "confirm-password", msg: "Passwords do not match." });
        hasErrors = true;
      }

      // Consent validation
      if (!consentChecked) {
        showFieldError("consent", "You must agree to the terms to continue.");
        errors.push({ id: "consent", msg: "You must agree to the Terms and acknowledge the Privacy Principles." });
        hasErrors = true;
      }

      if (hasErrors) {
        // Populated error summary
        errors.forEach(err => appendToErrorSummary(err.msg, err.id));
        // Move focus to error summary for screen reader notification
        errorSummary.focus();
        return;
      }

      // Enter loading state
      const submitBtn = document.getElementById("submit-btn");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Creating account…";
      submitBtn.disabled = true;
      registerForm.setAttribute("aria-busy", "true");

      try {
        const result = await authAdapter.register({ email: emailVal });
        showStatusToast("Registration Complete", result.message);
        // Clear sensitive password inputs as per security rules
        document.getElementById("password").value = "";
        document.getElementById("confirm-password").value = "";
      } catch (err) {
        appendToErrorSummary("An unexpected error occurred. Please try again.", "email");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        registerForm.setAttribute("aria-busy", "false");
      }
    });
  }

  // --- LOGIN FORM HANDLER ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const emailVal = document.getElementById("email").value.trim();
      const passwordVal = document.getElementById("password").value;

      let hasErrors = false;
      const errors = [];

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showFieldError("email", "Email address is required.");
        errors.push({ id: "email", msg: "Email address is required." });
        hasErrors = true;
      } else if (!emailRegex.test(emailVal)) {
        showFieldError("email", "Please enter a valid email address.");
        errors.push({ id: "email", msg: "Please enter a valid email address." });
        hasErrors = true;
      }

      // Password validation
      if (!passwordVal) {
        showFieldError("password", "Password is required.");
        errors.push({ id: "password", msg: "Password is required." });
        hasErrors = true;
      }

      if (hasErrors) {
        errors.forEach(err => appendToErrorSummary(err.msg, err.id));
        errorSummary.focus();
        return;
      }

      // Enter loading state
      const submitBtn = document.getElementById("submit-btn");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Logging in…";
      submitBtn.disabled = true;
      loginForm.setAttribute("aria-busy", "true");

      try {
        const result = await authAdapter.login({ email: emailVal });
        showStatusToast("Login Status", result.message);
        // Clear sensitive password input as per security rules
        document.getElementById("password").value = "";
      } catch (err) {
        appendToErrorSummary("An unexpected error occurred. Please try again.", "email");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        loginForm.setAttribute("aria-busy", "false");
      }
    });

    // Mock Forgot Password triggers
    const forgotLink = document.getElementById("forgot-password-link");
    const recoveryBox = document.getElementById("recovery-prototype-box");
    if (forgotLink && recoveryBox) {
      forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        recoveryBox.classList.add("visible");
        recoveryBox.focus();
      });
    }

    const cancelRecovery = document.getElementById("cancel-recovery");
    if (cancelRecovery && recoveryBox) {
      cancelRecovery.addEventListener("click", (e) => {
        e.preventDefault();
        recoveryBox.classList.remove("visible");
      });
    }
  }
});
