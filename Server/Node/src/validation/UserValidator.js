export class UserValidator {
  static validateUser(user) {
    //check if email is valid
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
  }
}
