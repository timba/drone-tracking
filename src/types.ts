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

export type DroneDistance = {
    distance: number, 
    timeInterval: number
}

export type DronePackets = {
    received: number,
    missed: number,    
}
