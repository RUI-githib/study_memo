import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MemoFormProps = {
  content: string;
  time: number | "";
  onChangeContent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAdd: (e: React.ChangeEvent<HTMLFormElement>) => void;
  contentInputRef: React.RefObject<HTMLInputElement | null>;
  timeInputRef: React.RefObject<HTMLInputElement | null>;
  error: string;
};

export const MemoForm = ({
  content,
  time,
  onChangeContent,
  onChangeTime,
  onClickAdd,
  contentInputRef,
  timeInputRef,
  error,
}: MemoFormProps) => {
  return (
      <Card>
        <CardHeader >
          <CardTitle>学習メモ</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onClickAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">学習内容</label>
              <Input
                type="text"
                value={content}
                onChange={onChangeContent}
                ref={contentInputRef}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    timeInputRef.current?.focus();
                  }
                }}
              ></Input>
            </div>
            <div>
              <label className="text-sm font-medium">学習時間</label>
              <Input
                type="number"
                value={time}
                onChange={onChangeTime}
                ref={timeInputRef}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    contentInputRef.current?.focus();
                  }
                }}
              ></Input>
              分
            </div>
            {error && <p className="text-sm textdestructive">{error}</p>}
            <Button type="submit" className="w-full">登録</Button>
          </form>
        </CardContent>
      </Card>
  );
};
