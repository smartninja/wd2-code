import { useState, useEffect } from "react";
import { login, logout, getMe, type Me } from "../auth";

function AuthStatus() {
  const [me, setMe] = useState<Me | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // On load, ask the server if we're already signed in — the session cookie
  // survives refreshes, so we don't lose the login when React restarts.
  useEffect(() => {
    getMe().then(setMe);
  }, []);

  async function handleLogin() {
    setError(false);
    try {
      await login(email, password);
      setMe(await getMe());
      setPassword("");
    } catch {
      setError(true);
    }
  }

  async function handleLogout() {
    await logout();
    setMe(null);
  }

  if (me) {
    return (
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-600">Signed in as {me.email}</span>
        <button className="text-blue-600" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center mb-4 text-sm">
      <input
        className="border rounded px-2 py-1"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="px-3 py-1 rounded bg-gray-800 text-white" onClick={handleLogin}>
        Log in
      </button>
      {error && <span className="text-red-600">Login failed</span>}
    </div>
  );
}

export default AuthStatus;
