export interface Now
{
    (): Date;
}

export function RealNow() {
    return new Date(Date.now());
}

export function MakeFakeNow(date: Date): Now {
    return () => date;
}