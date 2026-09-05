// * Host participant request validation modal.
import React from 'react';
import { PendingJoinRequest } from '../../shared/types';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';
import { UserCheck, UserX, Bike, Phone, Clock, ShieldCheck } from 'lucide-react';
import { formatTimestamp } from '../../shared/utils/formatters';

interface GroupRiderApprovalModalProps {
  pendingRequests: PendingJoinRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const GroupRiderApprovalModal: React.FC<GroupRiderApprovalModalProps> = React.memo(({
  pendingRequests,
  onApprove,
  onReject,
}) => {
  if (pendingRequests.length === 0) return null;

  const currentRequest = pendingRequests[0];

  return (
    <Modal
      isOpen={true}
      onClose={() => onReject(currentRequest.id)}
      title={
        <div className="flex items-center gap-2 text-cyan-700">
          <ShieldCheck className="w-5 h-5" />
          <span>Rider Join Request</span>
        </div>
      }
      subtitle={`Ride Code #${currentRequest.rideCode}`}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
            {currentRequest.riderName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-slate-900">{currentRequest.riderName}</h4>
            <div className="flex items-center gap-1.5 text-xs text-cyan-800 font-semibold mt-0.5">
              <Bike className="w-3.5 h-3.5" />
              <span>{currentRequest.bikeModel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{currentRequest.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Requested at {formatTimestamp(currentRequest.requestedAt)}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
          Approving will grant this rider access to your live telemetry, route coordinates, and sync their beacon onto the group map.
        </p>

        {/* Queued count if multiple */}
        {pendingRequests.length > 1 && (
          <p className="text-[11px] text-amber-700 font-bold text-center">
            +{pendingRequests.length - 1} more pending in queue
          </p>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="secondary"
            leftIcon={<UserX className="w-4 h-4" />}
            onClick={() => onReject(currentRequest.id)}
          >
            Decline
          </Button>
          <Button
            variant="success"
            leftIcon={<UserCheck className="w-4 h-4" />}
            onClick={() => onApprove(currentRequest.id)}
          >
            Approve & Sync
          </Button>
        </div>
      </div>
    </Modal>
  );
});

GroupRiderApprovalModal.displayName = 'GroupRiderApprovalModal';
