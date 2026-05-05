import { useState } from "react";
import { supabase } from "../lib/supabase";

export function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      setLoading(false);
      return;
    }

    if (mode === "signUp") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setMessage(
        "登録しました。確認メールを送信しましたので、メールボックスを確認してください",
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border p-6 shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">
          {mode === "signIn" ? "ログイン" : "新規登録"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="w-full border rounded px-3 py-2"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            onClick={() => {
              setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"));
              setError("");
              setMessage("");
            }}
            className="mt-4 text-sm text-blue-600 underline"
          >
            {mode === "signIn" ? "新規登録はこちら" : "ログインはこちら"}
          </button>
        </form>
      </div>
    </div>
  );
}
