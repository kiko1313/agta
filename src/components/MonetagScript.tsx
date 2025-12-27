'use client';

import Script from 'next/script';

export default function MonetagScript() {
    const scriptSrc = process.env.NEXT_PUBLIC_MONETAG_SCRIPT_SRC;
    const zoneId = process.env.NEXT_PUBLIC_MONETAG_ZONE_ID;

    // If no configuration provided, render nothing
    if (!scriptSrc || !zoneId) return null;

    return (
        <Script
            id="monetag-script"
            strategy="afterInteractive"
            src={scriptSrc}
            data-zone={zoneId}
            onError={(e) => {
                console.error('Monetag script failed to load', e);
            }}
        />
    );
}
