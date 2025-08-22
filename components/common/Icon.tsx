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
  Settings,
  KeyRound,
  Image,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  MessageCircle,
  Send,
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
  | 'scan'
  | 'settings'
  | 'key'
  | 'image'
  | 'generate'
  | 'search'
  | 'eye'
  | 'eye-off'
  | 'message'
  | 'send';

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
    case 'settings':
        return <Settings className={className} />;
    case 'key':
        return <KeyRound className={className} />;
    case 'image':
        return <Image className={className} />;
    case 'generate':
        return <Sparkles className={className} />;
    case 'search':
        return <Search className={className} />;
    case 'eye':
        return <Eye className={className} />;
    case 'eye-off':
        return <EyeOff className={className} />;
    case 'message':
        return <MessageCircle className={className} />;
    case 'send':
        return <Send className={className} />;
    default:
      return null;
  }
};
