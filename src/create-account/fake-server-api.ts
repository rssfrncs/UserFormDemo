function isUsernameAvailable(username: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(username.startsWith("a"));
    }, 2000);
  });
}

type UserAccount = {
  username: string;
  password: string;
  telephone: string;
};
function createAccount(params: UserAccount): Promise<UserAccount> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        username: params.username.trim(),
        password: params.password,
        telephone: params.telephone.trim(),
      });
    }, 3000);
  });
}

export const fakeServer = {
  isUsernameAvailable,
  createAccount,
};
