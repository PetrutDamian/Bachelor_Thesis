import { User } from "../model/user";
import { UserDatabase } from "../persistence/UserDB";
import { AuthentificationService } from "../service/AuthentificationService";

const testPath = "./db/test-users.json";

class AuthentificationTestRunner {
  constructor() {
    this.db = new UserDatabase({ filename: testPath, autoload: true });
    this.service = new AuthentificationService();
    this.service.userDatabase = this.db;
    this.service.sendMailFn = async (email, id) => {};
  }
  async unitTestCrudOperations() {
    try {
      await this.db.insert(
        new User(undefined, "email@gmail.com", "abc", false)
      );
      let user = await this.db.findOne({ email: "email@gmail.com" });
      console.assert(user.email === "email@gmail.com", "wrong email!");
      console.assert(user.password === "abc", "wrong password!");
      console.assert(user.validated === false, "wrong validated!");

      await this.db.update({ email: "email@gmail.com" }, { validated: true });
      user = await this.db.findOne({ email: "email@gmail.com" });
      console.assert(user.validated === true, "Validate is not updated!");
    } catch (err) {
      console.log(err);
    } finally {
      await this.db.clear();
    }
  }
  async testRegisterBadEmail() {
    try {
      let result = await this.service.register(
        "test@Email@gmail@.com",
        "password"
      );
      console.assert(false, "Did not throw error!");
    } catch (error) {
      console.assert(error.message === "Invalid email!");
    }
  }
  async testRegisterValidEmail() {
    try {
      let result = await this.service.register("test@gmail.com", "password");
      result = await this.service.userDatabase.findOne({
        email: "test@gmail.com",
      });
      console.assert(result._id !== undefined, "Id undefined!");
    } catch (error) {
      console.assert(false, "Thrown error!");
    } finally {
      await this.service.userDatabase.clear();
    }
  }
  async testRegisterExistingEmail() {
    await this.service.register("test@gmail.com", "password");
    try {
      const result = await this.service.register("test@gmail.com", "random");
      console.assert(false, "Error not thrown!");
    } catch (error) {
      console.assert(
        "Email is already registered!" === error.message,
        "Bad error message"
      );
    } finally {
      await this.service.userDatabase.clear();
    }
  }
  async testActivateEmail() {
    await this.service.register("test@gmail.com", "password");
    let user = await this.service.userDatabase.findOne({
      email: "test@gmail.com",
    });
    try {
      await this.service.activateEmail(user._id);
      user = await this.service.userDatabase.findOne({
        email: "test@gmail.com",
      });
      console.assert(user.validated === true, "Email was not activated!");
    } catch (error) {
      console.assert(false, "Error thrown!");
    } finally {
      await this.service.userDatabase.clear();
    }
  }
  async testLoginEmailNotActivated() {
    await this.service.register("test@gmail.com", "password");
    try {
      const result = await this.service.login("test@gmail.com", "password");
      console.assert(false, "Error not thrown!");
    } catch (error) {
      console.assert(
        error.message === "Email is not activated!",
        "Error message is not correct"
      );
    } finally {
      await this.service.userDatabase.clear();
    }
  }
  async testLoginSuccesfully() {
    await this.service.register("test@gmail.com", "password");
    const user = await this.service.userDatabase.findOne({
      email: "test@gmail.com",
    });
    await this.service.activateEmail(user._id);
    try {
      const result = await this.service.login("test@gmail.com", "password");
      console.assert(
        result !== undefined && result !== null,
        "Result is undefined or null"
      );
    } catch (error) {
      console.assert(false, "Error thrown!");
    } finally {
      this.service.userDatabase.clear();
    }
  }
  async testLoginEmailNotRegistered() {
    try {
      await this.service.login("test@gmail.com", "password");
      console.assert(false, "Error not thrown!");
    } catch (error) {
      console.assert(error.message === "Email is not registered!");
    } finally {
      await this.service.userDatabase.clear();
    }
  }
  async testLoginEmailWrongCredentials() {
    await this.service.register("test@gmail.com", "password");
    const user = await this.service.userDatabase.findOne({
      email: "test@gmail.com",
    });
    await this.service.activateEmail(user._id);
    try {
      await this.service.login("test@gmail.com", "bad_password");
      console.assert(false, "Error not thrown!");
    } catch (error) {
      console.assert(
        error.message === "Authentification failed!",
        "Error message is incorrect!"
      );
    } finally {
      await this.service.userDatabase.clear();
    }
  }

  async integrationTests() {
    await this.testRegisterBadEmail();
    await this.testRegisterValidEmail();
    await this.testRegisterExistingEmail();
    await this.testActivateEmail();
    await this.testLoginEmailNotActivated();
    await this.testLoginSuccesfully();
    await this.testLoginEmailNotRegistered();
    await this.testLoginEmailWrongCredentials();
  }

  async test() {
    await this.unitTestCrudOperations();
    await this.integrationTests();
  }
}
export const authentificationTestRunner = new AuthentificationTestRunner();
