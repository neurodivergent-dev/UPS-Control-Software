import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface UPSWorkInfo {
  batteryCapacity: number;
  batteryRemainTime: number;
  inputVoltage: string;
  inputFrequency: string;
  outputVoltage: string;
  outputCurrent: string;
  batteryVoltage: string;
  temperatureView: string;
  workMode: string;
  outputLoadPercent: string;
  buzzerCtrl: boolean;
  ecomode: string;
  autoReboot: string;
  converterMode: string;
  warnings: string[];
}

export interface UPSDataResponse {
  workInfo: UPSWorkInfo;
  version?: string;
  customer?: string;
  protocolType?: string;
  hostName?: string;
}

const API_URL = '/api/ViewPower/workstatus/reqMonitorData';

export const fetchUPSData = async (): Promise<UPSDataResponse> => {
  const cacheBuster = Math.random();
  const response = await fetch(`${API_URL}?${cacheBuster}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'portName=USB4A0DAEE',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const useUPSData = () => {
  return useQuery({
    queryKey: ['upsData'],
    queryFn: fetchUPSData,
    refetchInterval: 3000,
    retry: 3,
  });
};

export const useUPSControlMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ type }: { type: string }) => {
      const cacheBuzzer = Math.random();
      const response = await fetch(`/api/ViewPower/control/realTimeCtrl?${cacheBuzzer}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `portName=USB4A0DAEE&type=${type}&minute=0.2`,
      });
      
      if (!response.ok) throw new Error(`Failed to send ${type} command`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upsData'] });
    },
  });
};
