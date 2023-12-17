function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
  return regex.test(password);
}

const isCyrillicString = (str) => {
  const cyrillicRegex = /^[а-яА-Я\s]+$/;
  return cyrillicRegex.test(str);
};


const userCreationValidation = (password, rePassword, body, firstName, lastName) => {
  if (!firstName || !lastName) {
    return new Error("Първото и последното име са задължителни!");
  }

  if(!isCyrillicString(firstName) || !isCyrillicString(lastName)){
    return new Error("Първото и последното име трябва да са на кирилица")
  }

  if (!body.phoneNumber) {
    return new Error("Телефонния номер е задължителен!");
  }

  if (password !== rePassword) {
    return new Error("Паролата и повторната парола не съвпадат!");
  }

  if (!isStrongPassword(password)) {
    return new Error("Паролата не е достатъчно силна!");
  }

  if (!body.email) {
    return new Error("Електронната поща е задължителна!");
  }

  if (!body.email.includes("@") || body.email.length < 3) {
    return new Error("Невалидна електронна поща!");
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

const adminLoginValidation = (firstName, lastName, password, admin) =>{
  if(!firstName || !lastName){
    throw new Error("First and Last names are required!");
  }

  if(!password){
    throw new Error("Password is required!");
  }

  if(!admin){
    throw new Error("No such existing admin!");
  }

  return null;
}

const completeOrderValidation = (receiverAddress, itemsOrdered, receiverClient, receiverOfficeCode) => {
  if(!itemsOrdered){
    return new Error("Няма поръчани продукти!")
  }

  if(!receiverAddress && !receiverOfficeCode){
    return new Error("Изберете адрес или офис за доставка!")
  }

  if(!receiverClient.name || !receiverClient.phones[0]){
    return new Error("За поръчка са необходими две имена и телефонен номер!")
  }

  return null  


}

module.exports = { userCreationValidation, userLoginValidation,  adminLoginValidation, completeOrderValidation};
