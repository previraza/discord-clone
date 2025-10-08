"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { joinServerAction } from "./join-server.actions";
import { useRouter } from "next/navigation";

interface JoinServerProps {
  serverId: string;
  serverName?: string;
}

export function JoinServer({
  serverId,
  serverName,
}: JoinServerProps) {
  const [isPending, startTransition] = useTransition();
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async () => {
    startTransition(async () => {
      try {
        setError(null);
  
        const result = await joinServerAction(serverId);

        if (result.status === "success") {
          setJoined(true);
          router.refresh();
        } else if(result.message) setError(result.message);
      } catch (err) {
        console.error(err);
        setError("Une erreur est survenue lors de l'affiliation.");
      }
    })
  };

  if (joined) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center space-y-2"
        >
          <h2 className="text-2xl font-semibold text-green-600">
            🎉 Vous avez rejoint {serverName || "l’organisation"} !
          </h2>
          <p className="text-sm text-gray-100 font-semibold">
            Vous allez être redirigé vers cette espace dans un instant.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
        <Card className="mx-auto max-w-2xl mt-10 shadow-lg bg-card/40 px-6 py-10">
            <CardHeader>
                <CardTitle className="text-center">
                Vous n'êtes pas encore membre
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                Rejoignez{" "}
                <span className="font-semibold text-foreground">
                    {serverName || "cette espace"}
                </span>{" "}
                pour accéder à ses fonctionnalités.
                </p>

                {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
                )}

                <Button
                onClick={handleJoin}
                disabled={isPending}
                className="w-full"
                >
                {isPending ? (
                    <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    En cours...
                    </>
                ) : (
                    "Rejoindre l'espace"
                )}
                </Button>
            </CardContent>
            </Card>
    </div>
  );
}
