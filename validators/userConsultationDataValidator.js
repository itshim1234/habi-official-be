// validators/userDataValidator.js
function userConsultationDataValidator(body) {
  const errors = [];

  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    errors.push("Name is required and must be a valid string.");
  }

  if (
    !body.phone ||
    typeof body.phone !== "string" ||
    !/^\d{10}$/.test(body.phone)
  ) {
    errors.push("Phone number is required and must be 10 digits.");
  }

  if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.push("Email format is invalid.");
  }

  if (!body.location || !body.location || typeof body.location !== "string") {
    errors.push("location is required and must be a valid string.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = userConsultationDataValidator;
