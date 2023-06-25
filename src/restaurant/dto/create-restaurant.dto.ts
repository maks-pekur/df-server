import { Contacts, Location, Schedule } from '../entities/restaurant.entity';

export class CreateRestaurantDto {
  location: Location;
  restaurantSchedule: Schedule[];
  deliverySchedule: Schedule[];
  contacts: Contacts;
  stopLists: {
    productUUIDs: string[];
    toppingUUIDs: string[];
  };
  webcamSettings?: {
    cameraId: string;
    serverId: string;
  };
}
