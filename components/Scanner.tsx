import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Card from './common/Card';
import { Icon } from './common/Icon';

interface ScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
}

const scannerContainerId = 'qr-reader-container';

const Scanner: React.FC<ScannerProps> = ({ onScan, onError }) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // This ref callback ensures the DOM node is available before we try to use it.
  const containerRef = useCallback(node => {
    if (node !== null && !html5QrCodeRef.current) {
      const qrCodeScanner = new Html5Qrcode(node.id, { verbose: false });
      html5QrCodeRef.current = qrCodeScanner;

      const successCallback = (decodedText: string) => {
        // After a successful scan, call the onScan prop.
        // The parent component will then unmount the scanner, triggering the cleanup effect.
        if (html5QrCodeRef.current?.isScanning) {
            onScan(decodedText);
        }
      };

      const errorCallback = (errorMessage: string) => {
        // This callback is called frequently; we can ignore "not found" errors.
      };

      qrCodeScanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        successCallback,
        errorCallback
      ).catch(err => {
        setCameraError(true);
        onError(err instanceof Error ? err : new Error('Failed to start camera. Check permissions.'));
      });
    }
  }, [onScan, onError]);

  // Cleanup effect runs only on unmount.
  useEffect(() => {
    const qrCodeScanner = html5QrCodeRef.current;
    return () => {
      if (qrCodeScanner && qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(error => {
          console.error('Failed to stop the QR scanner.', error);
        });
        html5QrCodeRef.current = null;
      }
    };
  }, []);

  return (
    <Card className="max-w-xl mx-auto p-4">
      <div className="relative w-full aspect-square bg-brand-dark rounded-lg overflow-hidden flex flex-col justify-center items-center">
        {cameraError ? (
          <div className="text-center text-white p-8">
            <Icon name="camera-off" className="h-16 w-16 mx-auto text-brand-accent mb-4" />
            <h3 className="text-xl font-bold">Camera Error</h3>
            <p className="mt-2 text-gray-300">
              Could not access the camera. Please grant permission in your browser settings.
            </p>
          </div>
        ) : (
          <>
            <div id={scannerContainerId} ref={containerRef} className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[250px] h-[250px] border-4 border-dashed border-brand-primary rounded-lg opacity-75" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white text-center p-2 rounded-lg">
              <p className="font-semibold">Align QR Code within the frame</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default Scanner;
