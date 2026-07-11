import { apiGetData, apiPostData, apiPatchData } from './api';

export interface AccessEvent {
  id: string;
  licensePlate: string;
  accessPointId?: string;
  direction: 'ENTRADA' | 'SALIDA';
  decision: 'GRANTED' | 'DENIED' | 'PENDING';
  reason?: string;
  vehicleId?: string;
  ownerId?: string;
  createdAt: string;
}

export const getPendingEvents = (): Promise<AccessEvent[]> => {
  return apiGetData('/access-control/events/pending');
};

export const getRecentEvents = (limit: number = 20): Promise<AccessEvent[]> => {
  return apiGetData(`/access-control/events/recent?limit=${limit}`);
};

export const createEvent = (data: Partial<AccessEvent>): Promise<AccessEvent> => {
  return apiPostData('/access-control/events', data);
};

export const getAllEvents = (): Promise<AccessEvent[]> => {
  return apiGetData('/access-control/events');
};
