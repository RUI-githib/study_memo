import { useState, useRef, useMemo, useEffect } from "react";
import "./App.css";
import { MemoForm } from "./components/MemoForm";
import { MemoList } from "./components/MemoList";
import { TotalTime } from "./components/TotalTime";
import { supabase } from "./lib/supabase";
import { StudyChart } from "./components/StudyCharts";
import type {Session} from "@supabase/supabase-js";
import {AuthForm} from "./components/AuthForm";

type Memo = {
  id: string;
  content: string;
  time: number;
};

function App() {
  const [content, setContent] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [memo, setMemo] = useState<Memo[]>([]);
  const [error, setError] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const contentInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };

    void getInitialSession();

    const { 
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event,session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    }
  },[]);

  useEffect(() => {
    if (!session) return;

    const fetchMemos = async () => {
      const { data, error } = await supabase
        .from("study_memo")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setMemo(data);
      }
    };
    fetchMemos();
  }, [session]);

  useEffect(() => {
     const handleKeyDown = (e:KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();

        if (memo.length === 0) return;

        const latestMemo = memo[0];
        onClickDelete(latestMemo.id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown",handleKeyDown);
  },[memo]);

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTime(value === "" ? 0 : Number(value));
  };

  const onClickAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      setError("ログインが必要です");
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent || time <= 0) {
      setError("学習時間と内容を正しく入力してください");
      return;
    }

    const { data, error } = await supabase
      .from("study_memo")
      .insert({ content: trimmedContent, time, user_id: session.user.id })
      .select();

    if (error) {
      console.log(error);
      setError("保存に失敗しました");
      return;
    }

    if (data) {
      setMemo((prev) => [...data, ...prev]);
    }

    setContent("");
    setTime(0);
    setError("");

    contentInputRef.current?.focus();
  };

  const onClickDelete = async (id: string) => {
    const { error } = await supabase.from("study_memo").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setMemo((prev) => prev.filter((item) => item.id !== id));
  };

  const totalTime = useMemo(
    () => memo.reduce((sum, item) => sum + Number(item.time), 0),
    [memo],
  );

  const groupedMemo = useMemo(() => {
    const map = new Map<string, number>();

    memo.forEach((item) => {
      const prev = map.get(item.content) || 0;
      map.set(item.content, prev + Number(item.time));
    });

    return Array.from(map.entries()).map(([content,time]) => ({
      content,
      time,
    }));
  },[memo]);

    if (authLoading){
    return <div className="p-8">読み込み中...</div>;
  }

  if (!session) {
    return <AuthForm />;
  }

return (
  <div className="min-h-screen p-8">
    <div className="max-w-6xl mx-auto grid grid-cols-2 gap-3 ">
      
      <MemoForm
        content={content}
        time={time === 0 ? "" : time}
        onChangeContent={onChangeContent}
        onChangeTime={onChangeTime}
        onClickAdd={onClickAdd}
        contentInputRef={contentInputRef}
        timeInputRef={timeInputRef}
        error={error}
      />
      <StudyChart memo={groupedMemo} />
      <MemoList memo={memo} onClickDelete={onClickDelete} />
      <TotalTime totalTime={totalTime} />
    </div>
  </div>
);
}

export default App;
