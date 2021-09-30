export class FireEventDto {
  device?: string;
  eventType?: string;
  executedApplicationName?: string;
  sizeThreshold?: number;
  triggerName?: string;
  additionalProperties: any;
  eventPayloadProperties?: any;
}
