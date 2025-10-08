"use client";

import { ChannelType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HashIcon, MicIcon, VideoIcon } from "lucide-react";
import { parseAsJson, useQueryState } from 'nuqs'
import z from "zod";

const iconMap = {
  [ChannelType.TEXT]: HashIcon,
  [ChannelType.AUDIO]: MicIcon,
  [ChannelType.VIDEO]: VideoIcon,
};

export type ServerSidebarCategoryFilter = Record<"types"|"states", {id:string, label:string, icon?:keyof typeof iconMap}[]>;

const filterSchema = z.object({
  types: z.string().array().optional(),
  states: z.string().array().optional(),
});
export function ServerSidebarCategory ({ categories }: { categories: ServerSidebarCategoryFilter }) {
  const [filter, setFilter] = useQueryState('filter', parseAsJson(filterSchema));

  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 px-3">
        {
          Object.entries(categories).map(([_key, items]) => {
            const key = _key as keyof ServerSidebarCategoryFilter
            return (
              <div className="mb-2" key={key}>
                <div className="flex justify-between items-center py-2">
                  <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                    {key}
                  </p>
                </div>
                <div className="space-y-[2px]">
                  {items.map(({ icon = "TEXT", ...item }) => {
                    const Icon = iconMap[icon];
                    return (
                      <button
                        key={item.id}
                        onClick={() => setFilter((current) => {
                          const data = current || {};
                          const currentKey = data[key] ?? [];
                          const keyData = currentKey.includes(item.id) ? currentKey.filter(id => id !== item.id) : [...currentKey, item.id]
                          const newData = {
                            ...data,
                            [key]: keyData.length > 0 ? keyData : undefined
                          }

                          return (newData.types === undefined && newData.states === undefined) ? null : newData;

                        })}
                        className={cn(
                          "group px-2 py-2 rounded-md flex items-center w-full gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                          filter?.[key]?.includes(item.id) && "bg-zinc-700/20 dark:bg-zinc-700"
                        )}
                      >
                        {Icon && <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />}
                        <p
                          className={cn(
                            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                            filter?.[key]?.includes(item.id) &&
                              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                          )}
                        >
                          {item.label}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })
        }
      </ScrollArea>
    </div>
  );
};
