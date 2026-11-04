const LOCAL_FALLBACK_URL = 'http://192.168.1.175:8080/api';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || LOCAL_FALLBACK_URL).replace(/\/+$/, '');

export const DEFAULT_TIMEOUT_MS = 20000;
export const AI_ANALYSIS_TIMEOUT_MS = 60000;
