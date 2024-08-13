import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AllDatabaseTypes } from "@/types/types";
import { JoinGameDialog } from "./JoinGameDialog";

type GamesTableProps = {
  rooms: AllDatabaseTypes["room"][];
};
export default function GamesTable({ rooms }: GamesTableProps) {
  return (
    <Table>
      <TableCaption>List of available games</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Room name</TableHead>
          <TableHead>Creation date</TableHead>
          <TableHead>Password protected</TableHead>
          <TableHead>Players</TableHead>
          <TableHead className="text-right"> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms?.map((room) => (
          <TableRow key={room._id}>
            <TableCell className="font-medium">{room?.name}</TableCell>
            <TableCell>
              {new Date(room?._creationTime).toLocaleString()}
            </TableCell>
            <TableCell>{room?.password === "" ? "No" : "Yes"}</TableCell>
            <TableCell>
              {room?.players.reduce((accum, current, index) => {
                if (index === room?.players.length - 1) {
                  return accum + current.userName;
                }
                return accum + current.userName + ", ";
              }, "") + ""}
            </TableCell>
            <TableCell className="text-right">
              <JoinGameDialog room={room} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
