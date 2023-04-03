class AuthRepository {
  /**
   * @param {import('sequelize').Model} UserModel - The user model created by sequelize
   */
  constructor(UserModel) {
    this.Model = UserModel;
  }
  /**
   * Create a new user in DB.
   * @param {String} email - Email to save
   * @param {String} nickname - Nickname to save
   * @param {string} hashedPassword - Hashed password to save
   */
  createUser = async (email, nickname, hashedPassword) => {
    await this.Model.create({ email, nickname, password: hashedPassword });
  };
  /**
   * Get user model from the database by email.
   * @param {String} email - Email address of the user you want to find
   * @returns {Promise<import('sequelize').Model> | Promise<undefined>} Found user model, or undefined if not found.
   */
  getUserByEmail = async (email) => {
    const user = await this.Model.findOne({ where: { email } });
    return user;
  };
}

module.exports = AuthRepository;
