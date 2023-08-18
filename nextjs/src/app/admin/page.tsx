"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMap } from "../hooks/useMap";
import { socket } from "../utils/socket-io";

export default function AdminPage() {
  const containerMapRef = useRef<HTMLDivElement>(null);
  const map = useMap(containerMapRef);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribeRoute = useCallback(
    async (routeId: string) => {
      console.log(routeId);
      const response = await fetch(`http://localhost:3000/routes/${routeId}`);
      const route = await response.json();
      map!.removeRoute(routeId!);
      map!.addRouteWithIcons({
        routeId: routeId!,
        startMarkerOptions: {
          position: route.source.location,
        },
        endMarkerOptions: {
          position: route.destination.location,
        },
        carMarkerOptions: {
          position: route.source.location,
        },
      });
    },
    [map]
  );

  useEffect(() => {
    
    if (!socket.connected) {
      return;
    }

    socket.on(
      "admin-new-point",
      async (data: { route_id: string; lat: number; lng: number }) => {
        console.log(data);
        if (!map!.hasRoute(data.route_id)) {
          await subscribeRoute(data.route_id);
        }
        map!.moveCar(data.route_id, {
          lat: data.lat,
          lng: data.lng,
        });
        // if (map!.hasRoute(data.route_id)) {
        //   map!.moveCar(data.route_id, {
        //     lat: data.lat,
        //     lng: data.lng,
        //   });
        // }
      }
    );

    return () => {
      socket.off("admin-new-point");
    };
  }, [map, subscribeRoute]);

  return (
    <div className="flex flex-row h-full">
      <div id="map" ref={containerMapRef} className="h-full w-full" />
    </div>
  );
}
