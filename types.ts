export type DistanceCalcCoordStructure = {
  lat: number;
  lng: number;
}

export type ProcessLocationsRequest = {
  dropUrl: string;
  currentLocationString?: string;
  currentLocationCoordinates?: DistanceCalcCoordStructure
}