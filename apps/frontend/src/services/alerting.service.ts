import { apiGetData, apiPostData, apiPatchData } from './api';

export interface Alert {
  id: string;
  alertTitle: string;
  alertDescription: string;
  alertType: 'info' | 'warning' | 'error';
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
  referenceEventId?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getActiveAlerts = (): Promise<Alert[]> => {
  return apiGetData('/alerting/alerts/active');
};

export const resolveAlert = (id: string, resolutionNotes?: string): Promise<Alert> => {
  return apiPatchData(`/alerting/alerts/${id}/resolve`, { resolutionNotes });
};

export const createAlert = (data: Partial<Alert>): Promise<Alert> => {
  return apiPostData('/alerting/alerts', data);
};
