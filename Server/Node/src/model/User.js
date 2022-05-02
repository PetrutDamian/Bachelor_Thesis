export class User {
  constructor(id, email, password, validated) {
    this._id = id;
    this.email = email;
    this.password = password;
    this.validated = validated;
  }
}
