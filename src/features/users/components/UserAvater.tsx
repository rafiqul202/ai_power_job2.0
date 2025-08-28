import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ user }: { user: { name: string; imageUrl: string } }) => {
  const initials = (user?.name ?? "U N")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Avatar>
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </>
  );
};

export default UserAvatar;
