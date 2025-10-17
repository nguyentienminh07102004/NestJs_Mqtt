export class DataHistoryQueryDto {
    page: number;
    limit: number;
    sort: string;
    status: string;
    type: "fan" | "led" | "air_conditioner" | "timestamp" | ""
} 