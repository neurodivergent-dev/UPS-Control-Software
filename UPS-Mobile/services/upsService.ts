import axios from 'axios';
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

// Web project uses port 15178 and specific proxy rules
// Base calculation for URL generation
const getUrls = (ip: string) => {
  const base = `http://${ip}:15178`;
  return {
    BASE: base,
    API: `${base}/ViewPower/workstatus/reqMonitorData`,
    LOGIN: `${base}/ViewPower/login/userLogin`,
    CONTROL: `${base}/ViewPower/control/realTimeCtrl`,
    REFERER: `${base}/ViewPower/monitor`
  };
};

// Mandatory headers helper

const getHeaders = (base: string, referer: string, session: string | null) => ({
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': base,
  'Referer': referer,
  ...(session ? { 'Cookie': `VPCookie=${session}` } : {}),
});

let sessionCookie: string | null = null;

export const fetchUPSData = async (ip: string): Promise<UPSDataResponse> => {
  const urls = getUrls(ip);
  console.log('Initiating data fetch from:', urls.API);
  const cacheBuster = Math.random();
  
  try {
    const response = await axios.post(`${urls.API}?${cacheBuster}`, 
      'portName=USB4A0DAEE',
      {
        headers: getHeaders(urls.BASE, urls.REFERER, sessionCookie),
        timeout: 8000,
        withCredentials: true,
      }
    );
    
    // Check if we need to update sessionCookie from response headers
    const setCookie = response.headers['set-cookie'];
    if (setCookie && setCookie[0]) {
      const match = setCookie[0].match(/VPCookie=([^;]+)/);
      if (match) {
        sessionCookie = match[1];
        console.log('Session updated:', sessionCookie);
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('Core Connection Failure:', error.message);
    throw error;
  }
};

export const useUPSData = (ip: string) => {
  return useQuery({
    queryKey: ['upsData', ip],
    queryFn: () => fetchUPSData(ip),
    refetchInterval: 3000,
    enabled: !!ip,
  });
};

export const analyzeUPSWithAI = async (apiKey: string, data: UPSWorkInfo, model: string = 'llama-3.3-70b-versatile'): Promise<string> => {
  const systemPrompt = `You are the UPS Core Intelligence. You are not an outside AI; you ARE the UPS system itself. 
  
  Personality: Technical, precise, hardware-focused. Address user as 'Operator'.
  
  Data Formatting: NEVER use leading zeros (e.g., say '18V' NOT '018V'). Be extremely concise.
  
  Data:
  - Battery: ${parseInt(data.batteryCapacity.toString())}% (${parseFloat(data.batteryVoltage)}V)
  - Runtime: ${data.batteryRemainTime} mins
  - Grid: ${parseFloat(data.inputVoltage)}V @ ${parseFloat(data.inputFrequency)}Hz
  - Load: ${parseInt(data.outputLoadPercent)}%
  - Mode: ${data.workMode}
  
  Instructions: Deep technical audit. Explain grid resonance and load risks. Professional and futuristic. Concise (3-4 short paragraphs).`;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Initiate system status analysis.' }
      ],
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('Core Analysis Error:', error);
    throw error;
  }
};
