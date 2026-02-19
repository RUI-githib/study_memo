type MemoItemProps = {
    content: string;
    time: number | "";
}

export const MemoItem = ({ content, time, }: MemoItemProps) => {
    return (
        <li>
            {content} :{time}分
        </li>
    )
};