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
    <>
      {/* Desktop table view */}
      <div className="hidden md:block">
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
      </div>

      {/* Mobile card view */}
      <div className="md:hidden flex flex-col gap-4">
        <p className="text-center text-sm text-muted-foreground">List of available games</p>
        {rooms?.map((room) => (
          <div
            key={room._id}
            className="border rounded-lg p-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{room?.name}</h3>
              <JoinGameDialog room={room} />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(room?._creationTime).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span>{room?.password === "" ? "No" : "Yes"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Players:</span>
                <span className="text-xs">
                  {room?.players.reduce((accum, current, index) => {
                    if (index === room?.players.length - 1) {
                      return accum + current.userName;
                    }
                    return accum + current.userName + ", ";
                  }, "") + ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
