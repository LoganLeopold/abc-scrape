export type ProcessState = "initialized" | "error" | "fetching" | "success"
export type SearcMethod = "written" | "geolocation"

export type ProcessStateObject = {
  [k in SearcMethod]: ProcessState
}

export type ResultsObject = {
  [k in SearcMethod]: MethodResults
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
  lat: number,
  lon: number
} | {}