export interface ApprovedReading {
    txId : string,
    temperature : number,
    approvals: number,
    timestamp: number,
    [key: string]: string | number,
}

export interface SensorChaincodeTransaction {
    txId: string,
    creator: string,
    createdTimestamp: number,
    approvals: ApprovalTransaction[],
    reading: TemperatureHumidityReading,
    containerNum: number,
}

interface ApprovalTransaction {
    txId: string,
    creator: string,
    createdTimestamp: number,
}

interface TemperatureHumidityReading {
    temperature: number,
    relativeHumidity: number,
    timestamp: number,
}