// Mock only. The real check happens on the backend (bcrypt compare + JWT).
const users = [
  {
    name: "Alex Kumar",
    email: "alex@example.com",
    password: "password123",
    bio: "",
    avatar: null,
    showOnLeaderboard: true,
  },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// never send the password back to the page
function publicUser({ password, ...rest }) {
  return rest;
}

export async function mockLogin(email, password) {
  await wait(800);
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!found || found.password !== password) {
    throw new Error("Incorrect email or password.");
  }
  return publicUser(found);
}

export async function mockSignup({ username, email, password }) {
  await wait(800);
  const mail = email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === mail)) {
    throw new Error("An account with this email already exists.");
  }
  if (users.some((u) => u.name.toLowerCase() === username.trim().toLowerCase())) {
    throw new Error("That username is taken.");
  }
  const created = {
    name: username.trim(),
    email: mail,
    password,
    bio: "",
    avatar: null,
    showOnLeaderboard: true,
  };
  users.push(created);
  return publicUser(created);
}