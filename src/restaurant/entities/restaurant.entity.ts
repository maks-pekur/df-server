export interface Schedule {
  startDay: number;
  endDay: number;
  closeTime: string;
  openTime: string;
}

export interface Location {
  coordinates: {
    _lon: number;
    _lat: number;
  };
  city: string;
  street: {
    fullStreetTypeName: string;
    shortStreetTypeName: string;
    name: string;
  };
  houseNumber: string;
}

export interface Contacts {
  phone: string;
}

export class Restaurant {
  id?: string;
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
