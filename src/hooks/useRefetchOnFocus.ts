import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useRefetchOnFocus(...refetchers: Array<() => unknown>): void {
  const isFirstFocus = useRef(true);
  const refetchersRef = useRef(refetchers);
  refetchersRef.current = refetchers;

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetchersRef.current.forEach((refetch) => refetch());
    }, []),
  );
}
