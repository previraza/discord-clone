"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Edit,
  LogInIcon,
  LogOut,
  PlusCircle,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useI18n } from "@/i18n/client";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
  isMember?: boolean;
}

export const ServerHeader = ({ server, role, isMember }: ServerHeaderProps) => {
  const t = useI18n();
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-hidden" asChild>
        <button className="w-full font-semibold flex items-center border-neutral-200 text-md px-3 h-12 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs text-black dark:text-neutral-400 space-y-[2px] font-medium">
        {!isMember ? (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="dark:text-white text-black hover:bg-emerald-600! hover:text-white! dark:hover:bg-emerald-500 text-sm cursor-pointer px-3 py-2"
          >
            {t("server.header.become_member")}
            <LogInIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <>
            {isModerator && (
              <DropdownMenuItem
                onClick={() => onOpen("invite", { server })}
                className="dark:text-white text-black hover:bg-indigo-600! hover:text-white! dark:hover:bg-indigo-500 text-sm cursor-pointer px-3 py-2"
              >
                {t("server.header.invite")}
                <UserPlus className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem
                className="text-sm cursor-pointer px-3 py-2"
                onClick={() => onOpen("editServer", { server })}
              >
                {t("server.header.edit_server")}
                <Edit className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            )}
            {isModerator && (
              <DropdownMenuItem
                className="text-sm cursor-pointer px-3 py-2"
                onClick={() => onOpen("members", { server })}
              >
                {t("server.header.manage_members")}
                <Users className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            )}
            {isModerator && (
              <DropdownMenuItem
                className="text-sm cursor-pointer px-3 py-2"
                onClick={() => onOpen("createChannel", { server })}
              >
                {t("server.header.create_channel")}
                <PlusCircle className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            )}
            {isModerator && <DropdownMenuSeparator />}
            {isAdmin && (
              <DropdownMenuItem
                onClick={() => onOpen("deleteServer", { server })}
                className="text-rose-500 hover:text-white! hover:bg-red-500! dark:hover:bg-red-700 text-sm cursor-pointer px-3 py-2"
              >
                {t("server.header.delete_server")}
                <Trash className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            )}
            {!isAdmin && (
              <DropdownMenuItem
                onClick={() => onOpen("leaveServer", { server })}
                className="text-rose-500 hover:text-white! hover:bg-red-500! dark:hover:bg-red-700 text-sm cursor-pointer px-3 py-2"
              >
                {t("server.header.leave_server")}
                <LogOut className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
