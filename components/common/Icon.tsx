
import React from 'react';
import {
  QrCode,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  ScanLine,
  User,
  Store,
  CameraOff,
  ChevronLeft,
  LoaderCircle,
  X,
  Scan,
} from 'lucide-react';

export type IconName =
  | 'qr-code'
  | 'dollar-sign'
  | 'shield-check'
  | 'shield-alert'
  | 'plus-circle'
  | 'scan-line'
  | 'user'
  | 'store'
  | 'camera-off'
  | 'chevron-left'
  | 'loader'
  | 'close'
  | 'scan';

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  switch (name) {
    case 'qr-code':
      return <QrCode className={className} />;
    case 'dollar-sign':
      return <DollarSign className={className} />;
    case 'shield-check':
      return <ShieldCheck className={className} />;
    case 'shield-alert':
      return <ShieldAlert className={className} />;
    case 'plus-circle':
      return <PlusCircle className={className} />;
    case 'scan-line':
      return <ScanLine className={className} />;
    case 'user':
      return <User className={className} />;
    case 'store':
      return <Store className={className} />;
    case 'camera-off':
      return <CameraOff className={className} />;
    case 'chevron-left':
        return <ChevronLeft className={className} />;
    case 'loader':
        return <LoaderCircle className={`animate-spin ${className}`} />;
    case 'close':
        return <X className={className} />;
    case 'scan':
        return <Scan className={className} />;
    default:
      return null;
  }
};
