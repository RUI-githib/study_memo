import { useState, useRef, useMemo, useEffect} from "react";
import "./App.css";
import { MemoForm } from "./components/MemoForm";
import { MemoList } from "./components/MemoList";
import { TotalTime } from "./components/TotalTime";
import { supabase } from "./lib/supabase";

useEffect (() => {
  const fetchMemmos = async () => {
    const {data, error} = await supabase.from("memos").select("*");

    if (error) {
      console.error(error);
    } else { 
      console.log(data);
    }
  };
  fetchMemmos();
},[]);

type Memo = {
  content: string;
  time: number;
};

console.log("テスト");

function App() {
  const [content, setContent] = useState<string>("");
  const [time, setTime] = useState<number | "">("");
  const [memo, setMemo] = useState<Memo[]>([]);
  const [error, setError] = useState<string>("");

  const contentInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTime(value === "" ? "" : Number(value));
  };

  const onClickAdd = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content || time === "" || time <= 0) {
      setError("学習内容と時間を入力してください");
      return;
    }

    const newMemo: Memo = {
      content: content,
      time: time,
    };

    setMemo([...memo, newMemo]);
    setContent("");
    setTime("");
    setError("");
  };

  const totalTime = useMemo(
    () => memo.reduce((sum, item) => sum + Number(item.time), 0),
    [memo],
  );

  return (
    <>
      <div className="min-h-screen bg-muted/40 py-12">
        <div className="max-w-2xl mx-auto space-y-8 px-4">
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
          <MemoList memo={memo} />
          <TotalTime totalTime={totalTime} />
        </div>
      </div>
    </>
  );
}

export default App;
