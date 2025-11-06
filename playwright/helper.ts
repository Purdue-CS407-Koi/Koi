import { createAccountWithProfile } from "../src/api/users";

const acquireAccount = async (id: number | string) => {
  const email = `playwright-test-runner-${id}@example.com`;
  const password = `playright-runner-password-${id}`;
  const full_name = `Playwright Test Runner ${id}`;
  await createAccountWithProfile(email, password, full_name);
  return { username: email, password };
};

export { acquireAccount };
