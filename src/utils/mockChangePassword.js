// Mock only. The real password check will happen on the backend
// (bcrypt compare), and this function becomes an axios PUT request.
const MOCK_CURRENT_PASSWORD = "password123";

export function mockChangePassword(current, next) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (current !== MOCK_CURRENT_PASSWORD) {
        reject(new Error("Current password is incorrect."));
      } else {
        resolve({ ok: true });
      }
    }, 800);
  });
}