import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Memo = {
  content: string;
  time: number | "";
};

type StudyChartsProps = {
  memo: Memo[];
};

export const StudyChart = ({ memo }: StudyChartsProps) => {
  const data = memo.map((item) => ({
    name: item.content.length > 8 ? item.content.slice(0, 8) + "..." : item.content,
    time: item.time,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>学習時間グラフ</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart width={400} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis unit="分" />
          <Tooltip formatter={(value) => [`${value}分`, "学習時間"]} />
          <Bar dataKey="time" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </CardContent>
    </Card>
  );
};