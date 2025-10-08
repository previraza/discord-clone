"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type JoinServerActionResult = {
  status: "success" | "error";
  message?: string;
};

export async function joinServerAction(serverId: string):Promise<JoinServerActionResult> {
    const profile = await currentProfile();
  
    if (!profile) {
      const authInstance = await auth();
      authInstance.redirectToSignIn();
      return { status: "error", "message": "Vous devez être connecté pour rejoindre cette espace"};
    }
  
    const allReadyMember = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });
  
    if (allReadyMember) {
      return { status: "success", "message": "Vous êtes déjà membre de cette espace"};
    }

    const serverExists = await db.server.findUnique({
      where: { id: serverId }
    });

    if(!serverExists) {
      return { status: "error", "message": "Cette espace n'existe pas"};
    }

    if(serverExists.accessibility === "PRIVATE") {
      return { status: "error", "message": "Cette espace est privée"};
    }

    if(serverExists.accessibility === "PROTECTED") {
      return { status: "error", "message": "Cette espace est protégée"};
    }
  
    const server = await db.server.update({
      where: {
        id: serverExists.id,
      },
      data: {
        members: {
          create: [{ profileId: profile.id }],
        },
      },
    });
  
    if (server) {
      return { status: "success", "message": "Vous avez rejoint cette espace"};
    }

    return { status: "error", "message": "Une erreur est survenue lors de l'ajout de membre"};
}