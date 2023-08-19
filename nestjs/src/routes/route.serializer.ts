import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';
import { Route } from '@prisma/client';

export class RouteSerializer implements Omit<Route, 'directions'> {
  id: string;
  name: string;
  source: { name: string } & { location: { lat: number; lng: number } };
  destination: { name: string } & { location: { lat: number; lng: number } };
  distance: number;
  duration: number;
  directions: DirectionsResponseData & { request: any };
  create_at: Date;
  update_at: Date;

  constructor(route: Route) {
    this.id = route.id;
    this.name = route.name;
    this.create_at = route.create_at;
    this.update_at = route.update_at;
    this.distance = route.distance;
    this.duration = route.duration;
    this.directions = JSON.parse(route.directions as string);
    this.source = route.source;
    this.destination = route.destination;
  }
}
