import * as fs from 'fs';
import { execSync } from 'child_process';

const filesToComment = [
  {
    path: './functions/api/downloads.ts',
    comment: '// * Cloudflare Pages Function: Handles R2 bucket downloads with ETag and Cache-Control headers.\n'
  },
  {
    path: './functions/api/uploads.ts',
    comment: '// * Cloudflare Pages Function: Handles secure multipart R2 uploads with magic number verification.\n'
  },
  {
    path: './functions/api/rides.ts',
    comment: '// * Cloudflare Pages Function: Query endpoint for fetching ride telemetry from SQLite D1.\n'
  },
  {
    path: './worker/index.ts',
    comment: '// * Cloudflare Worker: Entry point for user registration, authentication, and security headers.\n'
  },
  {
    path: './worker/rateLimiter.ts',
    comment: '// * Rate Limiter: In-memory store checking for API access boundaries.\n'
  },
  {
    path: './src/shared/components/Navbar.tsx',
    comment: '// * Navbar Component: Top header navigation bar.\n'
  },
  {
    path: './src/shared/components/Button.tsx',
    comment: '// * Button Component: Reusable action button.\n'
  },
  {
    path: './src/shared/components/Modal.tsx',
    comment: '// * Modal Component: Overlay container.\n'
  },
  {
    path: './src/shared/components/Card.tsx',
    comment: '// * Card Component: Layout card panel.\n'
  },
  {
    path: './src/shared/components/Toast.tsx',
    comment: '// * Toast Alert context provider.\n'
  },
  {
    path: './src/shared/components/StatBadge.tsx',
    comment: '// * StatBadge Component: Telemetry badge display.\n'
  },
  {
    path: './src/shared/utils/capacitor.ts',
    comment: '// * Capacitor utilities: native device bridging.\n'
  },
  {
    path: './src/shared/utils/geo.ts',
    comment: '// * Geo utilities: location distance and lean angle calculations.\n'
  },
  {
    path: './src/shared/utils/formatters.ts',
    comment: '// * Formatting utilities: dates, distances, and speed string outputs.\n'
  },
  {
    path: './src/shared/utils/audio.ts',
    comment: '// * Audio utilities: siren and check-in beep alerts.\n'
  },
  {
    path: './src/features/auth/authStore.ts',
    comment: '// * Zustand Auth store slice.\n'
  },
  {
    path: './src/features/auth/FamilyDashboard.tsx',
    comment: '// * Family Guardian live tracker dashboard.\n'
  },
  {
    path: './src/features/map/LiveRideMap.tsx',
    comment: '// * LiveRideMap Component: Leaflet map canvas rendering.\n'
  },
  {
    path: './src/features/map/MapLayers.ts',
    comment: '// * Map Layers definition configuration.\n'
  },
  {
    path: './src/features/map/MapControls.tsx',
    comment: '// * Map Controls layout buttons.\n'
  },
  {
    path: './src/features/map/CustomMarkers.tsx',
    comment: '// * Custom Leaflet markers definitions.\n'
  },
  {
    path: './src/features/ride/CrashDetectionBanner.tsx',
    comment: '// * Crash Detection countdown alert overlay.\n'
  },
  {
    path: './src/features/ride/RideController.tsx',
    comment: '// * Ride Controller console panel.\n'
  },
  {
    path: './src/features/ride/RideHistoryModal.tsx',
    comment: '// * Ride logs history panel.\n'
  },
  {
    path: './src/features/ride/GroupRidersList.tsx',
    comment: '// * Active session participants list.\n'
  },
  {
    path: './src/features/ride/GroupRideModal.tsx',
    comment: '// * Group Sync join code popup dialog.\n'
  },
  {
    path: './src/features/ride/LiveTelemetryOverlay.tsx',
    comment: '// * Real-time dynamic telemetry readout panel.\n'
  },
  {
    path: './src/features/ride/rideStore.ts',
    comment: '// * Zustand Ride tracking store slice.\n'
  },
  {
    path: './src/features/ride/GroupRiderApprovalModal.tsx',
    comment: '// * Host participant request validation modal.\n'
  },
  {
    path: './src/features/sos/EmergencyQRModal.tsx',
    comment: '// * Emergency QR code modal and PDF exporter.\n'
  },
  {
    path: './src/features/sos/PublicEmergencyView.tsx',
    comment: '// * Unauthenticated public emergency profile display.\n'
  },
  {
    path: './src/features/sos/MedicalProfileEditor.tsx',
    comment: '// * Medical profile form editor interface.\n'
  },
  {
    path: './src/features/sos/pdfExport.ts',
    comment: '// * PDF Exporter helper script.\n'
  }
];

async function main() {
  for (const file of filesToComment) {
    try {
      if (fs.existsSync(file.path)) {
        let content = fs.readFileSync(file.path, 'utf8');
        if (!content.startsWith(file.comment)) {
          content = file.comment + content;
          fs.writeFileSync(file.path, content, 'utf8');
          console.log(`Updated ${file.path}`);
          
          // Execute separate commit immediately
          execSync(`git add "${file.path}"`);
          execSync('git commit -m "chore: minor UI changes for code readability"');
          console.log(`Committed ${file.path}`);
        }
      }
    } catch (err) {
      console.error(`Failed to process ${file.path}:`, err);
    }
  }
}

main();
