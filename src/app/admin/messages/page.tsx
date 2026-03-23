import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "@/components/admin/message-actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {messages.length} total
            {unreadCount > 0 && (
              <span className="ml-2 text-amber-400">
                · {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Subject</TableHead>
              <TableHead className="text-gray-400">Message</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-8"
                >
                  No messages yet.
                </TableCell>
              </TableRow>
            )}
            {messages.map((message) => (
              <TableRow
                key={message.id}
                className={`border-white/10 transition-colors ${
                  !message.read
                    ? "bg-violet-500/5 hover:bg-violet-500/10"
                    : "hover:bg-white/5"
                }`}
              >
                <TableCell>
                  {message.read ? (
                    <Badge
                      variant="outline"
                      className="border-gray-700 text-gray-500 text-xs"
                    >
                      Read
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">
                      Unread
                    </Badge>
                  )}
                </TableCell>
                <TableCell
                  className={`font-medium ${
                    message.read ? "text-gray-300" : "text-white"
                  }`}
                >
                  {message.name}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {message.email}
                </TableCell>
                <TableCell className="text-gray-400 text-sm max-w-[160px] truncate">
                  {message.subject ?? "—"}
                </TableCell>
                <TableCell className="text-gray-400 text-sm max-w-[200px] truncate">
                  {message.message}
                </TableCell>
                <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                  {formatDate(message.createdAt)}
                </TableCell>
                <TableCell>
                  <MessageActions id={message.id} read={message.read} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
