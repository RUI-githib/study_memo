import { useState, useRef, useMemo, useEffect } from "react";
import "./App.css";
import { MemoForm } from "./components/MemoForm";
import { MemoList } from "./components/MemoList";
import { TotalTime } from "./components/TotalTime";
import { supabase } from "./lib/supabase";
import { StudyChart } from "./components/StudyCharts";

type Memo = {
  id: string;
  content: string;
  time: number;
};

function App() {
  const [content, setContent] = useState<string>("");
  const [time, setTime] = useState<number | "">("");
  const [memo, setMemo] = useState<Memo[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
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
  }, []);

  const contentInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTime(value === "" ? "" : Number(value));
  };

  const onClickAdd = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content || time === "" || time <= 0) {
      setError("学習内容と時間を入力してください");
      return;
    }

    const { data, error } = await supabase
      .from("study_memo")
      .insert({ content, time })
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
    setTime("");
    setError("");
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

return (
  <div className="min-h-screen p-8">
    <h1 className="text-2xl font-bold mb-8">学習メモ</h1>
    <div className="grid grid-cols-2 gap-8">
      
      <MemoForm
        content={content}
        time={time}
        onChangeContent={onChangeContent}
        onChangeTime={onChangeTime}
        onClickAdd={onClickAdd}
        contentInputRef={contentInputRef}
        timeInputRef={timeInputRef}
        error={error}
      />
      <StudyChart memo={memo} />
      <MemoList memo={memo} onClickDelete={onClickDelete} />
      <TotalTime totalTime={totalTime} />
    </div>
  </div>
);
}

export default App;
