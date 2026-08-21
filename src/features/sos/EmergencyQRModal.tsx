import React, { useState } from 'react';
import { UserProfile } from '../../shared/types';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';
import { QRCodeSVG } from 'qrcode.react';
import { exportEmergencyCardPDF } from './pdfExport';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '../../shared/components/Toast';

interface EmergencyQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenPublicView: () => void;
}

export const EmergencyQRModal: React.FC<EmergencyQRModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenPublicView,
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const publicUrl = `${window.location.origin}/sos/${user.qrToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    success('Link Copied!', 'Emergency public profile link copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    exportEmergencyCardPDF(user);
    success('PDF Generated', 'Your MotoGuard Medical Card has been downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-red-400">
          <QrCode className="w-5 h-5" />
          <span>Emergency Medical QR Badge</span>
        </div>
      }
      subtitle="Scan directly from helmet, fuel tank, or jacket sticker"
      maxWidth="md"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Printable/Scannable Badge Container */}
        <div className="bg-slate-950 border-2 border-red-500/80 rounded-3xl p-6 w-full flex flex-col items-center gap-3 shadow-2xl shadow-red-950/60 relative overflow-hidden">
          <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Heart className="w-3 h-3 fill-current" />
            <span>First Responder Medical ID</span>
          </div>

          <h3 className="text-xl font-black text-white">{user.name}</h3>
          <p className="text-xs text-slate-400 -mt-2">
            Blood Group: <strong className="text-red-400 font-mono text-sm">{user.bloodGroup}</strong>
          </p>

          {/* White High Contrast QR Card */}
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center my-1 border-4 border-slate-900">
            <QRCodeSVG
              value={publicUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
            <span className="text-[10px] text-slate-900 font-black mt-2 font-mono tracking-wider">
              SCAN FOR ICE CONTACTS & ALLERGIES
            </span>
          </div>

          <div className="w-full bg-slate-900/90 rounded-xl p-2.5 text-xs text-slate-300 flex items-center justify-between border border-slate-800">
            <span className="font-mono text-slate-400 truncate max-w-[200px]">{publicUrl}</span>
            <button
              onClick={handleCopyLink}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 shrink-0 cursor-pointer ml-2"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Button
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPDF}
          >
            Download PDF Sheet
          </Button>

          <Button
            variant="secondary"
            leftIcon={<ExternalLink className="w-4 h-4 text-amber-400" />}
            onClick={() => {
              onClose();
              onOpenPublicView();
            }}
          >
            Preview Public View
          </Button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
          💡 <strong>Tip for Bikers:</strong> Print this QR code on a waterproof decal and stick it on the rear left of your helmet and front fork for quick paramedic access.
        </p>
      </div>
    </Modal>
  );
};
