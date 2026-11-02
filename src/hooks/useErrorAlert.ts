import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useErrorAlert(error: unknown, title: string): void {
  useEffect(() => {
    if (error) Alert.alert(title, (error as Error).message);
  }, [error, title]);
}
