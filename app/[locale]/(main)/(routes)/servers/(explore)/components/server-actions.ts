"use server";

import { db } from "@/lib/db";
import { Prisma, ServerAccessibility } from "@prisma/client";

type WithIncludedParameter = "archived" | "deleted";

type GetServersOptions = {
  search?: string | null;
  region?: string;
  types?: string[];
  states?: string[];
  accessibility?: ServerAccessibility;
  profileId?: string; // pour filtrer les serveurs créés par un profil donné
  sort?:
    | "newest"
    | "oldest"
    | "popular"
    | "name_asc"
    | "name_desc"
    | "random";
  cursor?: string | null;
  limit?: number;
  include?: WithIncludedParameter[];
};

function makeRule<T extends Prisma.ServerWhereInput>(cond: unknown, rule:T) {
  return cond ? rule : {};
}

export async function getServerData(params: GetServersOptions) {
  const {
    search,
    region,
    types,
    states,
    accessibility,
    include = [],
    profileId,
    sort = "newest",
    cursor,
    limit = 24,
  } = params;

  const orderBy: Prisma.ServerOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "oldest"
      ? { createdAt: "asc" }
      : sort === "popular"
      ? { members: { _count: "desc" } }
      : sort === "name_asc"
      ? { name: "asc" }
      : sort === "name_desc"
      ? { name: "desc" }
      : sort === "random"
      ? { id: "asc" } // Prisma ne supporte pas RAND() → géré côté client
      : { createdAt: "desc" };

  const where = {
    AND: [
      makeRule(search, {
        OR: [
        { name: { contains: search||"", mode: "insensitive" } },
        { description: { contains: search||"", mode: "insensitive" } },
        { region: { contains: search||"", mode: "insensitive" } },
        { type: { name: { contains: search||"", mode: "insensitive" } } },
        ],
      }),
      makeRule(region, { region }),
      makeRule(types?.length, { typeId: { in: types } }),
      makeRule(states?.length, { channels: { some: { state: { in: states } } } }),
      makeRule(accessibility, { accessibility }),
      makeRule(profileId, { profileId }),
      makeRule(include.includes('archived'), { isArchived: false }),
      makeRule(include.includes('deleted'), { deletedAt: null }) 
    ]
  };

  const servers = await db.server.findMany({
    where,
    orderBy,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      bannerUrl: true,
      region: true,
      accessibility: true,
      isVerified: true,
      type: { select: { id: true, name: true, iconUrl: true } },
      profile: { select: { id: true, name: true, imageUrl: true } },
      createdAt: true,
      _count: {
        select: {
          members: true,
        },
      },
    }
  });

  const hasNextPage = servers.length > limit;
  const nextCursor = hasNextPage ? servers[limit].id : null;

  return {
    servers: servers.slice(0, limit),
    nextCursor,
    hasNextPage,
    params
  };
}

export type GetServerDataResponse = Awaited<ReturnType<typeof getServerData>>;