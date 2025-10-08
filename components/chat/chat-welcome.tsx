"use client";
import { Hash } from "lucide-react";
import { useI18n } from "@/i18n/client";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}
export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  const t = useI18n();
  return (
    <>
      <div className="flex flex-col gap-y-2 space-x-5">
        <div className="px-4 mb-2 flex flex-row items-center justify-start gap-x-2">
          {type === "channel" && (
            <div className="h-[40px] w-[40px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
              <Hash className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <p className="text-xl md:text-3xl font-bold">
          {type === "channel"
            ? t("chat.welcome.channel.title", { name })
            : t("chat.welcome.conversation.title", { name })}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {type === "channel"
            ? t("chat.welcome.channel.description", { name })
            : t("chat.welcome.conversation.description", { name })}
        </p>
      </div>
    </>
  );
};
