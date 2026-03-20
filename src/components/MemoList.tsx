import { MemoItem } from "./MemoItem.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Memo = {
  id: string;
  content: string;
  time: number | "";
};

type MemoListProps = {
  memo: Memo[];
  onClickDelete: (id:string) => void;
};

export const MemoList = ({ memo, onClickDelete }: MemoListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>学習メモ一覧</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {memo.map((item) => (
            <MemoItem key={item.id} id={item.id} content={item.content} time={item.time} onClickDelete={onClickDelete} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
