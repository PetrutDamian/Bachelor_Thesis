import { userDB } from "../persistence/UserDB";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../utils/JwtConfig";
import { UserValidator } from "../validation/UserValidator";
import { sendMail } from "../utils/Mailer";
import { RecordingsDatabase } from "../persistence/RecordingsDB";
import { User } from "../model/user";
const createToken = (id) => {
  return jwt.sign({ _id: id }, jwtConfig.secret);
};

export class AuthentificationService {
  userDatabase = userDB;
  recordingsDatabase = RecordingsDatabase;
  sendMailFn = sendMail;

  async login(email, password) {
    const user = await this.userDatabase.findOne({
      email: email,
    });
    if (user === null) throw new Error("Email is not registered!");
    if (user.password != password) throw new Error("Authentification failed!");
    if (user.validated === false) {
      throw new Error("Email is not activated!");
    }
    return createToken(user._id);
  }
  async register(email, password) {
    let user_to_register = new User(undefined, email, password, false);
    if (!UserValidator.validateUser(user_to_register))
      throw new Error("Invalid email!");
    const dbb = this.userDatabase;
    let user = await dbb.findOne({
      email: email,
    });
    if (user !== null) throw new Error("Email is already registered!");
    user = await this.userDatabase.insert(user_to_register);
    this.sendMailFn(user.email, user._id);
  }
  async activateEmail(id) {
    let user = await this.userDatabase.findOne({ _id: id });
    if (user === null) throw new Error();
    await this.userDatabase.update({ _id: id }, { validated: true });
    this.recordingsDatabase.createRecordingsDirectory(`recordings/${id}`);
  }
}

export var authentificationService = new AuthentificationService();
