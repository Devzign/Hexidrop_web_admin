import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  Upload,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  SwitchCamera,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

export type PhotoTarget =
  | "avatar"
  | "driverPhoto"
  | "nationalIdPhoto"
  | "licensePhoto"
  | "ztsaCertificatePhoto"
  | "policeClearancePhoto"
  | "vehiclePhoto";

interface PhotoCaptureModalProps {
  open: boolean;
  onClose: () => void;
  driverName: string;
  target: PhotoTarget;
  currentPhotoUrl?: string;
  onCapture: (dataUrl: string) => void;
}

const TARGET_META: Record<
  PhotoTarget,
  { title: string; subtitle: string; frameType: "portrait" | "document" | "vehicle"; icon: any }
> = {
  avatar: {
    title: "Take Driver Profile Photo",
    subtitle: "Clear front-facing portrait of the driver without sunglasses or hat",
    frameType: "portrait",
    icon: User,
  },
  driverPhoto: {
    title: "Take Driver Portrait",
    subtitle: "High-resolution portrait for driver identification and passenger trust",
    frameType: "portrait",
    icon: User,
  },
  nationalIdPhoto: {
    title: "Capture National Registration ID",
    subtitle: "Hold the metal or plastic Zimbabwe National ID card flat within the frame",
    frameType: "document",
    icon: ShieldCheck,
  },
  licensePhoto: {
    title: "Capture Driver's License",
    subtitle: "Position Class 2 or Class 4 driver's license showing name and expiry date",
    frameType: "document",
    icon: FileText,
  },
  ztsaCertificatePhoto: {
    title: "Capture ZTSA Safety Certificate",
    subtitle: "Frame the official Zimbabwe Traffic Safety Certificate clearly",
    frameType: "document",
    icon: FileText,
  },
  policeClearancePhoto: {
    title: "Capture CID Police Clearance",
    subtitle: "Photograph the CID Fingerprint clearance document stamp and signature",
    frameType: "document",
    icon: ShieldCheck,
  },
  vehiclePhoto: {
    title: "Capture Vehicle & Number Plate",
    subtitle: "Frame the front of the vehicle clearly showing the registration plate",
    frameType: "vehicle",
    icon: Truck,
  },
};

export function PhotoCaptureModal({
  open,
  onClose,
  driverName,
  target,
  currentPhotoUrl,
  onCapture,
}: PhotoCaptureModalProps) {
  const meta = TARGET_META[target] || TARGET_META.avatar;
  const TargetIcon = meta.icon;

  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    setCameraLoading(true);
    setCameraError(null);

    // Stop existing stream if running
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser or environment.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: meta.frameType === "portrait" ? "user" : facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Unable to access camera:", err);
      let msg = "Could not access device camera.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Camera permission was denied. Please allow camera access in browser settings, or switch to Upload tab.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No camera hardware detected on this device. You can upload an image file instead.";
      }
      setCameraError(msg);
      // Auto-switch to upload tab if camera isn't accessible
      setMode("upload");
    } finally {
      setCameraLoading(false);
    }
  }, [facingMode, meta.frameType]);

  // Handle open/close and stream cleanup
  useEffect(() => {
    if (open) {
      setCapturedImage(null);
      setCameraError(null);
      if (mode === "camera") {
        startCamera();
      }
    } else {
      // Clean up stream on modal close
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCapturedImage(null);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [open, mode]);

  // Connect video element when stream or modal opens
  useEffect(() => {
    if (videoRef.current && stream && mode === "camera") {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, mode]);

  // Shutter action
  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Trigger flash animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally if front-facing camera
    if (meta.frameType === "portrait" || facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);

    // Stop video preview while viewing snapshot
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Flip camera between front / rear
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => startCamera(), 100);
  };

  // File upload processing
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCapturedImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Confirm photo
  const handleConfirm = () => {
    if (!capturedImage) return;
    onCapture(capturedImage);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-[100000] flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900 text-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
              <TargetIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{meta.title}</h3>
                <span className="rounded-md bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {driverName}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">{meta.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector (Camera vs Upload) */}
        {!capturedImage && (
          <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3">
            <button
              onClick={() => {
                setMode("camera");
                setCameraError(null);
                startCamera();
              }}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                mode === "camera"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="h-4 w-4" />
              Live Camera
            </button>
            <button
              onClick={() => {
                setMode("upload");
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop());
                  setStream(null);
                }
              }}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                mode === "upload"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload Image File
            </button>
          </div>
        )}

        {/* Main Viewport Content */}
        <div className="relative flex flex-col items-center justify-center bg-slate-950 p-6">
          {/* Flash animation layer */}
          {isFlashing && (
            <div className="absolute inset-0 z-30 bg-white transition-opacity duration-200" />
          )}

          {/* Hidden Canvas used for capturing frames */}
          <canvas ref={canvasRef} className="hidden" />

          {/* 1. Captured Photo Preview State */}
          {capturedImage ? (
            <div className="flex w-full flex-col items-center space-y-4">
              <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-black shadow-lg">
                <img
                  src={capturedImage}
                  alt="Captured snapshot"
                  className={`max-h-[340px] w-auto object-contain ${
                    meta.frameType === "portrait" ? "rounded-2xl" : ""
                  }`}
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-sm">
                  <Check className="h-3.5 w-3.5" /> Photo Ready
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleRetake}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                >
                  <RefreshCw className="h-4 w-4" /> Retake Photo
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
                >
                  <Check className="h-4 w-4" /> Use This Photo
                </button>
              </div>
            </div>
          ) : mode === "camera" ? (
            /* 2. Live Camera Viewfinder */
            <div className="relative flex w-full flex-col items-center">
              {cameraError ? (
                <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/40 bg-red-950/20 p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
                  <h4 className="text-sm font-semibold text-white">Camera Unavailable</h4>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">{cameraError}</p>
                  <button
                    onClick={() => setMode("upload")}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload Image File Instead
                  </button>
                </div>
              ) : (
                <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black shadow-inner">
                  {cameraLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 gap-2">
                      <RefreshCw className="h-7 w-7 animate-spin text-primary" />
                      <span className="text-xs font-medium text-slate-300">Accessing camera feed...</span>
                    </div>
                  )}

                  {/* Video Stream */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-[320px] w-full object-cover ${
                      meta.frameType === "portrait" || facingMode === "user" ? "-scale-x-100" : ""
                    }`}
                  />

                  {/* Viewfinder Overlays based on target */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    {meta.frameType === "portrait" ? (
                      /* Face Silhouette Overlay */
                      <div className="relative flex flex-col items-center justify-center">
                        <div className="h-56 w-44 rounded-[50%] border-2 border-dashed border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
                        <span className="mt-2 text-[11px] font-medium text-white/90 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          Align Face Here
                        </span>
                      </div>
                    ) : meta.frameType === "document" ? (
                      /* Document Bounding Guide */
                      <div className="relative flex flex-col items-center justify-center">
                        <div className="relative h-48 w-72 rounded-xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                          {/* Corner brackets */}
                          <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
                          <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
                          <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />
                        </div>
                        <span className="mt-2 text-[11px] font-medium text-white/90 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          Fit ID / Certificate within frame
                        </span>
                      </div>
                    ) : (
                      /* Vehicle Bounding Guide */
                      <div className="relative flex flex-col items-center justify-center">
                        <div className="h-52 w-80 rounded-xl border-2 border-dashed border-amber-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
                        <span className="mt-2 text-[11px] font-medium text-white/90 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          Vehicle Front & Number Plate
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Switch camera button */}
                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    title="Switch camera"
                    className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition"
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Shutter Bar */}
              {!cameraError && (
                <div className="mt-5 flex w-full items-center justify-center gap-4">
                  <button
                    onClick={handleTakePhoto}
                    disabled={cameraLoading}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-red-600 shadow-xl transition-transform active:scale-95 hover:scale-105 disabled:opacity-50"
                  >
                    <div className="h-11 w-11 rounded-full bg-white transition-colors group-hover:bg-red-100" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 3. Upload File Mode */
            <div className="flex w-full flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-3">
                  <Upload className="h-7 w-7" />
                </div>
                <h4 className="text-sm font-semibold text-white">Click or Drag & Drop Image Here</h4>
                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  Upload JPG, PNG, or WebP photo up to 10MB
                </p>

                {currentPhotoUrl && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    <span>Driver currently has an active image</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Hexidrop Driver Biometrics & Document Verification
          </span>
          <span>WebRTC Camera Active</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
