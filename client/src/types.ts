export type ProcessState = "initialized" | "error" | "fetching" | "success"
export type SearchMethod = "written" | "geolocation"

export type ProcessStateObject = {
  [k in SearchMethod]: ProcessState
} | {}

export type ResultsObject = {
  [k in SearchMethod]: MethodResults
} | {}

export type MethodResults = {
  finalWaypoints: string,
  individualLinks: IndividualLink[] 
}

export type IndividualLink = {
  address: string;
  link: string;
}

export type Coordinates = {
  lat: number;
  lon: number;
}

export type CurrentLocation = {
  [k in SearchMethod]: string
} | {}

export type ResultsStatus = 'list' | 'waypoints'