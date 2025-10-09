import { ServerSidebarCategory } from "@/app/[locale]/(main)/(routes)/servers/(explore)/components/sidebar";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { getI18n } from "@/i18n/server";

export default async function ServerIdLayout ({ children }: LayoutProps<"/[locale]/servers">) {
  const t = await getI18n();
  const profile = await currentProfile();
  if (!profile) {
    const authInstance = await auth();
    return authInstance.redirectToSignIn();
  }

  return (
    <div className="h-full">
      <div className="sidebar md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <div className="w-full font-semibold flex items-center border-neutral-200 text-md px-3 h-12 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {t("server.sidebar.category_title")}
        </div>
        <ServerSidebarCategory categories={{
          types: [
            {
              id: "kyaghanda",
              label: t("explore.categories.types.kyaghanda"),
            },{
              id: "vyaghanda",
              label: t("explore.categories.types.vyaghanda"),
            }, {
              id: "vyaswa",
              label: t("explore.categories.types.vyaswa"),
            }, {
              id: "biharo",
              label: t("explore.categories.types.biharo"),
            }
          ], states: [
            {
              id: "live-audio",
              label: t("explore.categories.states.audio_conference"),
              icon: "AUDIO",
            },
            {
              id: "live-video",
              label: t("explore.categories.states.visio_conference"),
              icon: "VIDEO",
            }
          ]
        }} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};