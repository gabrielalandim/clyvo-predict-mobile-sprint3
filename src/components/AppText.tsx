import React from 'react';
import { Platform, Text as NativeText } from 'react-native';

type TextProps = React.ComponentProps<typeof NativeText>;

const ANDROID_FONT = Platform.OS === 'android' ? { fontFamily: 'ClyvoRoboto' } : null;

export function Text({ style, ...props }: TextProps) {
  return <NativeText {...props} style={ANDROID_FONT ? [ANDROID_FONT, style] : style} />;
}
