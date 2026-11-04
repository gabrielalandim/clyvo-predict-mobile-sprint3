import Constants from 'expo-constants';
import { API_BASE_URL } from '@config/env';

export interface AppInfo {
  name: string;
  version: string;
  commitHash: string;
  shortCommitHash: string;
  hasLocalChanges: boolean;
  buildDate: string | null;
  apiBaseUrl: string;
}

export function getAppInfo(): AppInfo {
  const config = Constants.expoConfig;
  const extra = (config?.extra ?? {}) as { commitHash?: string; hasLocalChanges?: boolean; buildDate?: string };
  const commitHash = extra.commitHash ?? 'desconhecido';
  return {
    name: config?.name ?? 'ClyvoPredict',
    version: config?.version ?? '1.0.0',
    commitHash,
    shortCommitHash: commitHash.slice(0, 7),
    hasLocalChanges: !!extra.hasLocalChanges,
    buildDate: extra.buildDate ?? null,
    apiBaseUrl: API_BASE_URL,
  };
}
