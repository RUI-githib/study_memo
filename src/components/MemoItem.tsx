import { Button } from "./ui/button";

type MemoItemProps = {
    id :string;
    content: string;
    time: number | "";
    onClickDelete: (id: string) => void;
}

export const MemoItem = ({ id, content, time,onClickDelete }: MemoItemProps) => {
    return (
        <li>
            {content} :{time}分
            <Button className="bg-black hover:bg-gray-600 text-white" size="sm" onClick={() => onClickDelete(id)}>
                削除
            </Button>
        </li>
    )
};