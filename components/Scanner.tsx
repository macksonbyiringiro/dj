import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Card from './common/Card';
import { Icon } from './common/Icon';

interface ScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
}

const scannerContainerId = 'qr-reader-container';

type ScannerStatus = 'initializing' | 'permissionDenied' | 'noCamerasFound' | 'scanning' | 'error';

const Scanner: React.FC<ScannerProps> = ({ onScan, onError }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasFiredScanEvent = useRef(false);
  const [status, setStatus] = useState<ScannerStatus>('initializing');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Effect to handle permissions and camera setup, which then triggers the scanning state.
  useEffect(() => {
    // This effect runs only once on mount to check for camera availability and permissions.
    const checkPermissionsAndCameras = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          setStatus('noCamerasFound');
          onError(new Error("No cameras found on this device."));
          return;
        }
        // If cameras are found, we are ready to scan. The next effect will handle starting the scanner.
        setStatus('scanning');
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onError(error);
        if (error.name === "NotAllowedError" || error.message.includes("Permission denied")) {
          setStatus('permissionDenied');
        } else {
          setErrorMsg('An unexpected error occurred while checking for cameras.');
          setStatus('error');
        }
      }
    };
    
    checkPermissionsAndCameras();
  }, [onError]);

  // Effect to start/stop the scanner when the component is in the correct state.
  useEffect(() => {
    if (status !== 'scanning') {
      return;
    }
    
    // Do not re-initialize if it's already running.
    if (scannerRef.current) {
        return;
    }
    
    // The container is guaranteed to exist now because status is 'scanning'.
    const scanner = new Html5Qrcode(scannerContainerId, { verbose: false });
    scannerRef.current = scanner;
    hasFiredScanEvent.current = false;

    const start = async () => {
      const successCallback = (decodedText: string) => {
        if (!hasFiredScanEvent.current) {
          hasFiredScanEvent.current = true;
          if (scannerRef.current?.isScanning) {
            scannerRef.current.stop()
              .then(() => onScan(decodedText))
              .catch((err) => {
                console.error("Failed to stop scanner, but proceeding with scan.", err);
                onScan(decodedText);
              });
          } else {
            onScan(decodedText);
          }
        }
      };
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };

      try {
        // First, try to use the rear camera ('environment'), which is best for QR codes.
        await scanner.start({ facingMode: "environment" }, config, successCallback, () => { /* ignore errors */ });
      } catch (err) {
        console.warn("Could not start scanner with rear camera, trying default.", err);
        try {
            // If the rear camera fails (e.g., on a laptop), try again with no specific camera.
            // The library will pick the default, usually the front-facing camera.
            await scanner.start({}, config, successCallback, () => { /* ignore errors */ });
        } catch (finalErr) {
            const error = finalErr instanceof Error ? finalErr : new Error(String(finalErr));
            onError(error);
            setErrorMsg('Could not start the camera. Please check device permissions.');
            setStatus('error');
        }
      }
    };

    start();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(error => console.error('Failed to stop the QR scanner on cleanup.', error));
      }
      scannerRef.current = null;
    };
  }, [status, onScan, onError]);

  const renderContent = () => {
    switch (status) {
      case 'initializing':
        return (
          <div className="text-center text-white p-8 flex flex-col items-center justify-center h-full">
            <Icon name="loader" className="h-16 w-16 mx-auto text-brand-primary mb-4" />
            <h3 className="text-xl font-bold">Initializing Camera</h3>
            <p className="mt-2 text-gray-300">
              Requesting camera access...
            </p>
          </div>
        );
      case 'permissionDenied':
        return (
          <div className="text-center text-white p-8">
            <Icon name="camera-off" className="h-16 w-16 mx-auto text-brand-accent mb-4" />
            <h3 className="text-xl font-bold">Camera Access Denied</h3>
            <p className="mt-2 text-gray-300">
              Please grant camera permission in your browser settings to use the scanner.
            </p>
          </div>
        );
      case 'noCamerasFound':
         return (
          <div className="text-center text-white p-8">
            <Icon name="camera-off" className="h-16 w-16 mx-auto text-brand-accent mb-4" />
            <h3 className="text-xl font-bold">No Camera Found</h3>
            <p className="mt-2 text-gray-300">
              We could not find a camera on your device. Please connect a camera and try again.
            </p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-white p-8">
            <Icon name="shield-alert" className="h-16 w-16 mx-auto text-brand-accent mb-4" />
            <h3 className="text-xl font-bold">Scanner Error</h3>
            <p className="mt-2 text-gray-300">
              {errorMsg || 'An unknown error occurred.'}
            </p>
          </div>
        );
      case 'scanning':
        return (
          <>
            <div id={scannerContainerId} className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[250px] h-[250px] border-4 border-dashed border-brand-primary rounded-lg opacity-75 animate-pulse" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white text-center p-2 rounded-lg">
              <p className="font-semibold">Align QR Code within the frame</p>
            </div>
          </>
        );
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-4">
      <div className="relative w-full aspect-square bg-brand-dark rounded-lg overflow-hidden flex flex-col justify-center items-center">
        {renderContent()}
      </div>
    </Card>
  );
};

export default Scanner;
