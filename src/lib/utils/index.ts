export const isPasswordValid = (password: string) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*_<,>.?/"";:{{}}|+=)(])[A-Za-z\d!@#$%^&*_<,>.?/"";:{{}}|+=)(]{7,}$/;
  const passwordValidate = passwordRegex.test(password);
  if (!passwordValidate) return false;
  return true;
};
