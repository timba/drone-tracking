export type Location = {
    longitude: number,
    latitude: number,
    altitude: number
}

export type DroneLocation = {
    droneId: string,
    timeReported: Date,
    seqnum: number,
    location: Location,
}
