import bcrypt from 'bcryptjs';

export const hashPassword = async (plainText: string) => {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainText, salt);
}

export const isPasswordCorrect = async (plainText: string, hashedPass: string) => {
  return bcrypt.compareSync(plainText, hashedPass);
}
