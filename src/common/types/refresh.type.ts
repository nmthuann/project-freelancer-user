import { Payload } from './payload.type';

export type RefreshPayload = Payload & { refreshToken: string };
