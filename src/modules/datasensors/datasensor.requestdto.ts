export class DataSensorRequestDto {
    temperature: number;
    humidity: number;
    brightness: number;
}

export class DataSensorQueryDto {
    page: number;
    limit: number;
    sort: string;
    time: string;
    type: "himidity" | "temperature" | "brightness" | "timestamp" | "";
    value?: number;
} 