export class DataSensorRequestDto {
    temperature: number;
    humidity: number;
    brightness: number;
}

export class DataSensorQueryDto {
    page: number;
    limit: number;
    sort: string;
    sortBy: string;
    time: string;
    type: "himidity" | "temperature" | "brightness" | "";
    value?: number;
} 