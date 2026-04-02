import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Global storage for the discovered port name
// Dynamic Discovery for multi-device support
export let discoveredPortName: string | null = null; 
let sessionCookie: string | null = null;

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
  deviceName?: string;
}

export interface UPSEventLog {
  id: number;
  occurTime: string;
  eventName: string;
  eventLevel: string;
  devName: string;
  sn: string;
}

export interface UPSDataResponse {
  workInfo: UPSWorkInfo;
  version?: string;
  customer?: string;
  protocolType?: string;
  hostName?: string;
}

const getUrls = (ip: string) => {
  const base = `http://${ip}:15178`;
  return {
    BASE: base,
    MONITOR: `${base}/ViewPower/workstatus/reqMonitorData`,
    LOGS: `${base}/ViewPower/history/qryEventRecords`,
    LOGIN: `${base}/ViewPower/login/userLogin`,
    CONTROL: `${base}/ViewPower/control/realTimeCtrl`,
    REFERER: `${base}/ViewPower/monitor`
  };
};

const getHeaders = (base: string, referer: string, session: string | null) => ({
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Requested-With': 'XMLHttpRequest',
  'Origin': base,
  'Referer': referer,
  ...(session ? { 'Cookie': `VPCookie=${session}` } : {}),
});

/**
 * Robust HTML Parser for ViewPower Event Records Table
 */
const parseEventLogsHTML = (html: string): UPSEventLog[] => {
  const logs: UPSEventLog[] = [];
  try {
    // Regex to find all table rows (excluding headers)
    // Looking for <tr>...</tr> that contains data
    const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
    let match;

    while ((match = rowRegex.exec(html)) !== null) {
      const rowContent = match[1];

      // Skip header/footer rows (they don't have style="display: none;")
      if (!rowContent.includes('style="display: none;"')) continue;

      // Extract cells using regex
      // Cells are usually <td ...> ... </td>
      const cellRegex = /<td[\s\S]*?>([\s\S]*?)<\/td>/g;
      const cells: string[] = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        // Clean up whitespace, newlines and tabs
        cells.push(cellMatch[1].replace(/[\n\r\t]/g, '').trim());
      }

      if (cells.length >= 6) {
        // cells[0]: Hidden ID (e.g. "20")
        // cells[1]: Visible ID (e.g. "1")
        // cells[2]: Image Level (e.g. "<img src=\"/ViewPower/images/level3.png\">")
        // cells[3]: Date (e.g. "2026-04-01 21:44:20")
        // cells[4]: Event (e.g. "AC recovery")
        // cells[5]: Type (e.g. "Input event")

        const levelMatch = cells[2].match(/level(\d+)\.png/);
        const level = levelMatch ? levelMatch[1] : "3"; // Default to INFO

        logs.push({
          id: parseInt(cells[0]) || Math.random(),
          occurTime: cells[3],
          eventName: cells[4],
          eventLevel: level === "1" ? "ERROR" : level === "2" ? "WARN" : "INFO",
          devName: cells[5],
          sn: ""
        });
      }
    }
  } catch (e) {
    console.error('HTML Parsing Failed:', e);
  }
  return logs;
};

export const fetchUPSData = async (ip: string): Promise<UPSDataResponse> => {
  const urls = getUrls(ip);
  const cacheBuster = Math.random();

  try {
    const response = await axios.post(`${urls.MONITOR}?${cacheBuster}`,
      `portName=${discoveredPortName || ''}`,
      {
        headers: getHeaders(urls.BASE, urls.REFERER, sessionCookie),
        timeout: 8000,
        withCredentials: true,
      }
    );

    const setCookie = response.headers['set-cookie'];
    if (setCookie && setCookie[0]) {
      const match = setCookie[0].match(/VPCookie=([^;]+)/);
      if (match) {
        sessionCookie = match[1];
      }
    }

    // SAFE GLOBAL DISCOVERY: Find the real port identity for this user
    const html = response.data;
    if (typeof html === 'string') {
      const portMatch = html.match(/name="portName"\s+value=["'](USB[^"']+)["']/i) ||
                       html.match(/name="comPort"\s+value=["'](USB[^"']+)["']/i);

      if (portMatch && portMatch[1]) {
        discoveredPortName = portMatch[1];
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('Core Connection Failure:', error.message);
    throw error;
  }
};

export const fetchUPSLogs = async (ip: string): Promise<UPSEventLog[]> => {
  // CRITICAL: Ensure discovery is triggered before logs
  if (!discoveredPortName) {
    try {
      await fetchUPSData(ip);
    } catch (e) {}
  }

  const urls = getUrls(ip);
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const lastSevenDays = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];

  const params = new URLSearchParams({
    comPort: discoveredPortName || 'USB4A0DAEE', // Fallback to your ID to fix immediate view
    prodid: 'P01',
    sn: '',
    startDate: lastSevenDays,
    endDate: today
  });

  try {
    const response = await axios.post(urls.LOGS, params.toString(), {
      headers: getHeaders(urls.BASE, urls.REFERER, sessionCookie),
      timeout: 10000,
    });

    if (typeof response.data === 'string') {
      if (response.data.includes('nologin')) {
        return [];
      }
      // If it's a string, it's likely the HTML table we saw
      return parseEventLogsHTML(response.data);
    }

    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Logs Fetch Error:', error.message);
    return [];
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

export const useUPSLogs = (ip: string) => {
  return useQuery({
    queryKey: ['upsLogs', ip],
    queryFn: () => fetchUPSLogs(ip),
    refetchInterval: 15000,
    enabled: !!ip,
  });
};

export const analyzeUPSWithAI = async (
  apiKey: string,
  data: UPSWorkInfo,
  model: string = 'llama-3.3-70b-versatile'
): Promise<string> => {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  const i18n = require('./i18n').default;
  const isTr = i18n.language?.startsWith('tr');

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: isTr
              ? `Sen bir endüstriyel UPS uzmanı ve veri analistisin. Sana gelen donanım verilerini inceleyerek sistemin sağlığını, verimliliğini ve olası riskleri analiz etmelisin. 
                 Yanıtın teknik, profesyonel ve doğrudan olmalı. Madde işaretleri kullan. 'Operatör' diye hitap et.`
              : `You are an industrial UPS expert and data analyst. Analyze the provided hardware data to evaluate system health, efficiency, and potential risks. 
                 Your response must be technical, professional, and direct. Use bullet points. Address user as 'Operator'.`,
          },
          {
            role: 'user',
            content: isTr
              ? `Donanım Verileri: Batarya %${data.batteryCapacity}, Voltaj ${data.batteryVoltage}V, Kalan Süre ${data.batteryRemainTime} dk, Giriş ${data.inputVoltage}V, Çıkış ${data.outputVoltage}V, Yük %${data.outputLoadPercent}, Sıcaklık ${data.temperatureView}°C, Mod ${data.workMode}. Uyarılar: ${data.warnings.join(', ') || 'Yok'}. 
                 Bu verileri analiz et ve sistem durumunu raporla.`
              : `Hardware Data: Battery ${data.batteryCapacity}%, Voltage ${data.batteryVoltage}V, Remaining Time ${data.batteryRemainTime} mins, Input ${data.inputVoltage}V, Output ${data.outputVoltage}V, Load ${data.outputLoadPercent}%, Temp ${data.temperatureView}°C, Mode ${data.workMode}. Warnings: ${data.warnings.join(', ') || 'None'}. 
                 Analyze this data and report the system status.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI Analysis Error:', error.message);
    return isTr 
      ? `VERİ ANALİZİ BAŞARISIZ: ${error.message}`
      : `DATA ANALYSIS FAILED: ${error.message}`;
  }
};
