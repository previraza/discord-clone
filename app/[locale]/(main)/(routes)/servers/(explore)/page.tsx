import { SearchInput } from "@/components/search-input";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import exploreHero from "@/assets/explore-hero.png";
import { CardGrid } from "./components/card-grid";
import { getI18n } from "@/i18n/server";

export default async function ServersExplorePage(props: PageProps<"/[locale]/servers">) {
    const t = await getI18n();
    return (
        <>
            <div className="relative  h-52 sm:h-64  md:h-76 rounded-[0.3rem] z-10">
                <div className="absolute  flex   w-full ">
                    <Image
                        alt="explore-hero"
                        src={exploreHero}
                        className="object-cover w-full rounded-[0.3rem] h-52  md:h-76 sm:h-64  "
                    />
                </div>

                <div className="absolute  flex   w-full h-full bg-black/20 z-10 "></div>

                <div className="relative z-20 p-4 flex flex-col items-center justify-center  h-full font-bold text-white  pb-0 space-y-2">
                    <p className="text-[19px] md:text-[24px] font-black">
                        {t("explore.hero.title")}
                    </p>
                    <p className="pb-2 text-[13.5px] md:text-[17px]    text-white/70">
                        {t("explore.hero.subtitle")}
                    </p>
                    <div className="relative flex items-center mb-4 w-full">
                        <SearchInput
                            type="search"
                            placeholder={t("explore.hero.search_placeholder")}
                            className="bg-sky-100 rounded-[0.3rem] pl-3 placeholder:text-[14px]  md:placeholder:text-[16px] placeholder:text-gray-500 outline-0 py-2 md:py-3 max-w-full w-100 md:w-140 text-black mx-auto"
                        />
                        <SearchIcon className="absolute   text-black right-2" />
                    </div>
                </div>
            </div>
            <CardGrid />
        </>
    );
}