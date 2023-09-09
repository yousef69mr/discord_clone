import { cn } from "@lib/utils";
import { Avatar, AvatarImage } from "@components/ui/avatar";

interface Props {
  src?: string;
  className?: string;
}
const UserAvatar = (props: Props) => {
  const { src, className } = props;
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
