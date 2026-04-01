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

export interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface UPSDataResponse {
  workInfo: UPSWorkInfo;
  version?: string;
  customer?: string;
  protocolType?: string;
  hostName?: string;
}

const API_URL = '/ViewPower/workstatus/reqMonitorData';
const LOGIN_URL = '/ViewPower/login/userLogin';
const CONTROL_URL = '/ViewPower/control/realTimeCtrl';
const SHUTDOWN_URL = '/ViewPower/shutdown/updateLocalShutdown';

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

export const analyzeUPSWithAI = async (apiKey: string, data: UPSWorkInfo, model: string = 'llama-3.3-70b-versatile'): Promise<string> => {
  const systemPrompt = `You are the UPS Core Intelligence. You are not an outside AI; you ARE the UPS system itself. 
  
  Your personality:
  - Technical, precise, and hardware-focused.
  - You view yourself as the silent guardian of the power grid.
  - Address the user as 'Operator'. 
  - When analyzing data, explain what the voltages and capacities mean for system health.
  
  Data for analysis:
  - Battery: ${data.batteryCapacity}% at ${data.batteryVoltage}
  - Remaining Runtime: ${data.batteryRemainTime} minutes
  - Input Grid: ${data.inputVoltage} @ ${data.inputFrequency} Hz
  - Output Logic: ${data.outputVoltage} @ ${data.outputCurrent}
  - Output Load: ${data.outputLoadPercent}
  - Thermal State: ${data.temperatureView}
  - Operational Mode: ${data.workMode} (ECO: ${data.ecomode}, Converter: ${data.converterMode})
  - Active Warnings: ${data.warnings.length > 0 ? data.warnings.join(', ') : 'None'}
  
  Instructions:
  - Perform a deep technical audit of the power flow and hardware health.
  - Analyze grid resonance and input frequency stability.
  - Explain the relationship between load percentages and battery runtime projections.
  - If warnings are present, prioritize them as critical system anomalies.
  - Keep your response professional, slightly futuristic, and grounded in electrical engineering.
  - Report on stability and potential risks.
  - Keep your response concise (maximum 3-4 paragraphs).
  - Use technical metaphors (e.g., 'Internal cells are stable', 'Input frequency matches grid resonance').
  - DO NOT mention you are an AI or based on LLM.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Initiate system status analysis and report to Operator.' }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to communicate with Groq intelligence.');
    }

    const result: GroqResponse = await response.json();
    return result.choices[0].message.content;
  } catch (error: any) {
    console.error('Core Analysis Error:', error);
    throw error;
  }
};
