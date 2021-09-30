export class FireEventDto {
  device?: string;
  eventType?: string;
  executedApplicationName?: string;
  queueSize?: number;
  triggerName?: string;
  additionalProperties: any;
  eventPayloadProperties?: any;
}
