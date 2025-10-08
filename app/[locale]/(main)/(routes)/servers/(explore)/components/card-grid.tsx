"use client";

import { useEffect, useState, useTransition } from "react";

import { Card } from "./card";
import Spinner from "../../../../../../../components/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "nuqs";
import { type GetServerDataResponse, getServerData } from "./server-actions";

type FilterQuery = Record<string, string[]>

export function CardGrid () {
    const [ searchQuery ] = useQueryState("q");
    const [ _filterQuery ] = useQueryState("filter");
    const filterQuery = _filterQuery as unknown as FilterQuery;

    const [cardData, setCardData] = useState<GetServerDataResponse>({
      servers: [],
      hasNextPage: false,
      nextCursor: null,
      params: {}
    });
    const [isPending, startTransition] = useTransition();
    
  const { debounce: filterSearchParams, clearDebounce} = useDebounce((search?:string|null, filter: FilterQuery = {}) => {
    startTransition(async () => {
        // TODO: TEMP Simulate a network request
        // await new Promise((resolve) => setTimeout(resolve, 10_000));

        const data = await getServerData({
          search,
          sort: "random",
          limit: 24,
          ...filter,
        });

        setCardData(data);
    });
  }, 1000);

  useEffect(() => {
    filterSearchParams(searchQuery, filterQuery);
  }, [searchQuery, JSON.stringify(filterQuery)]);

  if((searchQuery === cardData.params.search || (searchQuery === null && typeof cardData.params.search === undefined)) 
    && JSON.stringify(filterQuery?.types) === JSON.stringify(cardData.params?.types)
    && JSON.stringify(filterQuery?.states) === JSON.stringify(cardData.params?.states)
  ) {
    clearDebounce();
  }


  const servers = cardData?.servers || [];

  return (
    <div className="p-6">
      {/* Cards*/}
      {isPending ? (
        <Spinner />
      ) : servers.length === 0 ? (
        <div className="pb-4">
          <p className="font-bold text-[20px]">No Results</p>
          <p className="font-semibold text-muted-foreground">
            {`We couldn't find any servers matching your search.`}
          </p>
        </div>
      ) : (
        <>
          <div className="pb-4">
            <p className="font-bold text-[20px]">Featured Servers</p>
            <p className="font-semibold text-muted-foreground">
                {`Some awesome Discords we think you'd love`}
            </p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-y-8 xs:gap-x-2 sm:gap-x-4 mb-4">
            {servers.map((server) => (
              <Card
                key={server.id}
                id={server.id}
                serverName={server.name}
                avatarImage={server.imageUrl}
                bannerImage={server.bannerUrl}
                description={server.description}
                memberCount={server._count.members}
                onlineCount={"?"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
