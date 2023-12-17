function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
  return regex.test(password);
}




const userCreationValidation = (password, rePassword, username, email) => {
  if (!username) {
    return new Error("Username required!");
  }

 

  if (password !== rePassword) {
    return new Error("Passwords do not match!");
  }

  if (!isStrongPassword(password)) {
    return new Error("Password is not strong enough!");
  }

  if (!email) {
    return new Error("Email required!");
  }

  if (!email.includes("@") || email.length < 3) {
    return new Error("Invalid email!");
  }

  return null; // No errors
};

const userLoginValidation = (email, password, user) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!user) {
    throw new Error("Wrong email or password");
  }

  return null;

};





module.exports = { userCreationValidation, userLoginValidation};
