import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type TotalTimeProps = {
  totalTime: number;
}

export const TotalTime = ({ totalTime, }: TotalTimeProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>合計時間</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {totalTime}分
      </CardContent>
    </Card>
  );
};

