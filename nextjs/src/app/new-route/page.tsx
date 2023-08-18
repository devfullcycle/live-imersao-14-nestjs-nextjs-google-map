"use client";

import { FormEvent, useRef, useState } from "react";
import { useMap } from "../hooks/useMap";
import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";

export function NewRoutePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);
  const [directionsResponseData, setDirectionsResponseData] = useState<
    DirectionsResponseData & { request: any }
  >();

  async function searchPlaces(event: FormEvent) {
    event.preventDefault();
    const source = document.querySelector<HTMLInputElement>(
      "input[name=source_place]"
    )?.value;
    const destination = document.querySelector<HTMLInputElement>(
      "input[name=destination_place]"
    )?.value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:3001/api/places?text=${source}`),
      fetch(`http://localhost:3001/api/places?text=${destination}`),
    ]);

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
      await Promise.all([sourceResponse.json(), destinationResponse.json()]);

    if (sourcePlace.status !== "OK") {
      console.error(sourcePlace);
      alert("Não foi possível encontrar o local de origem");
      return;
    }

    if (destinationPlace.status !== "OK") {
      console.error(destinationPlace);
      alert("Não foi possível encontrar o local de destino");
      return;
    }

    const queryParams = new URLSearchParams({
      originId: sourcePlace.candidates[0].place_id as string,
      destinationId: destinationPlace.candidates[0].place_id as string,
    });

    const directionsResponse = await fetch(
      `http://localhost:3000/directions?${queryParams.toString()}`
    );

    const directionsResponseData: DirectionsResponseData & { request: any } =
      await directionsResponse.json();
    setDirectionsResponseData(directionsResponseData);
    map?.removeAllRoutes();
    map?.addRouteWithIcons({
      routeId: "1",
      startMarkerOptions: {
        position: directionsResponseData.routes[0]!.legs[0]!.start_location,
      },
      endMarkerOptions: {
        position: directionsResponseData.routes[0]!.legs[0]!.end_location,
      },
      carMarkerOptions: {
        position: directionsResponseData.routes[0]!.legs[0]!.start_location,
      },
      directionsResponseData,
    });
  }

  async function createRoute() {
    const response = await fetch("http://localhost:3000/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${directionsResponseData?.routes[0]!.legs[0]!.start_address} - ${
          directionsResponseData?.routes[0]!.legs[0]!.end_address
        }`,
        source_id: directionsResponseData?.request.origin.place_id,
        destination_id: directionsResponseData?.request.destination.place_id,
      }),
    });

    const route = await response.json();

    const { legs } = route.directions.routes[0];

    const { steps } = legs[0];
    
    for (const step of steps) {
      await sleep(2000);
      moveCar(step.start_location);
      //posicao via websocket ---> nest

      await sleep(2000);
      moveCar(step.end_location);
      //posicao via websocket ----> nest
    }
  }

  function moveCar(point: google.maps.LatLngLiteral) {
    map?.moveCar("1", {
      lat: point.lat,
      lng: point.lng,
    });
  }

  return (
    <div className="flex flex-row h-full">
      <div>
        <h1>Nova rota</h1>
        <form className="flex flex-col" onSubmit={searchPlaces}>
          <input name="source_place" placeholder="origem" />
          <input name="destination_place" placeholder="destino" />
          <button type="submit">Pesquisar</button>
        </form>
        {directionsResponseData && (
          <ul>
            <li>
              Origem:{" "}
              {directionsResponseData?.routes[0]!.legs[0]!.start_address}
            </li>
            <li>
              Destino: {directionsResponseData?.routes[0]!.legs[0]!.end_address}
            </li>
            <li>
              Distância:{" "}
              {directionsResponseData?.routes[0]!.legs[0]!.distance.text}
            </li>
            <li>
              Duração:{" "}
              {directionsResponseData?.routes[0]!.legs[0]!.duration.text}
            </li>
            <li>
              <button
                className="bg-blue-500 p-4 text-white rounded"
                onClick={createRoute}
              >
                Adicionar rota
              </button>
            </li>
          </ul>
        )}
      </div>
      <div id="map" className="h-full w-full" ref={mapContainerRef}></div>
    </div>
  );
}

export default NewRoutePage;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
