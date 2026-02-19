import { MemoItem } from "./MemoItem.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Memo = {
  content: string;
  time: number | "";
};

type MemoListProps = {
  memo: Memo[];
};

export const MemoList = ({ memo }: MemoListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>学習メモ一覧</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {memo.map((item, index) => (
            <MemoItem key={index} content={item.content} time={item.time} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
