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
const LOGIN_URL = '/api/ViewPower/login/userLogin';
const CONTROL_URL = '/api/ViewPower/control/realTimeCtrl';
const SHUTDOWN_URL = '/api/ViewPower/shutdown/updateLocalShutdown';

// Session cookie'yi sakla
let sessionCookie: string | null = null;

export interface UPSShutdownSettings {
  batModeShutdownTime: number;
  batModeShutdownSeconds: number;
  batModeShutdownTime2: number;
  batModeShutdownSeconds2: number;
  modeShutdown: number;
  batCapacity: number;
  batModeShutdownUps: boolean;
  lowBatShutdown: boolean;
  lowBatShutdownUPS: number;
  shutdownMode: number;
  shutdownTime: number;
  excuteProgram: string;
  excuteProgramTime: number;
  cancelShutExcute: string;
  beforeAlertTime: number;
  alertIntervalTime: number;
}

export const updateShutdownSettings = async (settings: Partial<UPSShutdownSettings>): Promise<boolean> => {
  // Default değerler
  const defaultSettings: UPSShutdownSettings = {
    batModeShutdownTime: 0,
    batModeShutdownSeconds: 0,
    batModeShutdownTime2: 0,
    batModeShutdownSeconds2: 0,
    modeShutdown: 2,
    batCapacity: 30,
    batModeShutdownUps: true,
    lowBatShutdown: true,
    lowBatShutdownUPS: 2,
    shutdownMode: 0,
    shutdownTime: 2,
    excuteProgram: '',
    excuteProgramTime: 1,
    cancelShutExcute: '',
    beforeAlertTime: 60,
    alertIntervalTime: 30,
  };

  const finalSettings = { ...defaultSettings, ...settings };

  const cacheBuster = Math.random();
  const response = await fetch(`${SHUTDOWN_URL}?${cacheBuster}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: new URLSearchParams({
      remoteAddrs: '',
      batModeShutdownTime: String(finalSettings.batModeShutdownTime),
      batModeShutdownSeconds: String(finalSettings.batModeShutdownSeconds),
      batModeShutdownTime2: String(finalSettings.batModeShutdownTime2),
      batModeShutdownSeconds2: String(finalSettings.batModeShutdownSeconds2),
      modeShutdown: String(finalSettings.modeShutdown),
      batCapacity: String(finalSettings.batCapacity),
      batModeShutdownUps: finalSettings.batModeShutdownUps ? 'on' : '',
      lowBatShutdown: finalSettings.lowBatShutdown ? 'on' : '',
      lowBatShutdownUPS: String(finalSettings.lowBatShutdownUPS),
      shutdownMode: String(finalSettings.shutdownMode),
      shutdownTime: String(finalSettings.shutdownTime),
      excuteProgram: finalSettings.excuteProgram,
      excuteProgramTime: String(finalSettings.excuteProgramTime),
      cancelShutExcute: finalSettings.cancelShutExcute,
      beforeAlertTime: String(finalSettings.beforeAlertTime),
      alertIntervalTime: String(finalSettings.alertIntervalTime),
    }),
    credentials: 'include',
  });

  console.log('Shutdown settings response:', response.status);
  return response.ok;
};

export const loginToViewPower = async (
  username: string = 'Administrator',
  password: string = 'administrator'
): Promise<string> => {
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      credentials: 'include',
    });

    const responseText = await response.text();
    console.log('Login response status:', response.status);
    console.log('Login response body:', responseText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    // Cookie'yi al
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    if (setCookieHeader) {
      const match = setCookieHeader.match(/VPCookie=([^;]+)/);
      console.log('VPCookie match:', match);
      if (match) {
        sessionCookie = match[1];
        localStorage.setItem('vp-session', sessionCookie);
        console.log('Session cookie saved:', sessionCookie);
        return sessionCookie;
      }
    }

    // Cookie header'da yoksa, belki response'ta başka bir yerde var
    // Veya login başarılıysa cookie tarayıcıda zaten set edilmiştir
    if (responseText.includes('success') || responseText === 'success' || response.status === 200) {
      console.log('Login successful, cookie should be set by browser');
      // Cookie tarayıcı tarafından otomatik set edilmiş olabilir
      return 'browser-managed';
    }

    throw new Error('No session cookie received - check credentials');
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

// Cacheden session'ı yükle
if (typeof window !== 'undefined') {
  sessionCookie = localStorage.getItem('vp-session');
}

export const fetchUPSData = async (): Promise<UPSDataResponse> => {
  const cacheBuster = Math.random();
  const response = await fetch(`${API_URL}?${cacheBuster}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: 'portName=USB4A0DAEE',
    credentials: 'include',
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
    mutationFn: async ({ type, minute }: { type: string; minute?: number }) => {
      const cacheBuster = Math.random();
      
      // Bazı komutlar minute parametresi gerektirmez
      let body = `portName=USB4A0DAEE&type=${type}`;
      if (minute !== undefined) {
        body += `&minute=${minute}`;
      }
      
      console.log('Sending control command:', type);
      console.log('Request body:', body);
      
      const response = await fetch(`${CONTROL_URL}?${cacheBuster}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: body,
        credentials: 'include',
      });

      console.log('Control response status:', response.status);
      const responseText = await response.text();
      console.log('Control response body:', responseText.substring(0, 500));

      if (!response.ok || responseText.includes('NullPointerException') || responseText.includes('error')) {
        // Session expired, tekrar login dene
        if (response.status === 401 || response.status === 403) {
          console.log('Session expired, re-authenticating...');
          await loginToViewPower();
          // Tekrar dene
          const retryResponse = await fetch(`${CONTROL_URL}?${cacheBuster}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: body,
            credentials: 'include',
          });
          
          console.log('Retry response status:', retryResponse.status);
          const responseText = await retryResponse.text();
          if (!retryResponse.ok || responseText.includes('error')) {
            throw new Error(`Failed to send ${type} command`);
          }
          return { success: true };
        }
        throw new Error(`Failed to send ${type} command - check ViewPower logs`);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upsData'] });
    },
  });
};
