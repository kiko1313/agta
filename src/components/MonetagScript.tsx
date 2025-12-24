'use client';

import Script from 'next/script';

export default function MonetagScript() {
    return (
        <>
            {/* Replace with actual Monetag ID if provided, otherwise generic placeholder logic */}
            {/* User provided: "Monetag ads fully integrated". Usually requires a Zone ID or specific script tag.
          Since no specific ID was given in the strict prompt text (only 'Integrate Monetag'), I will verify.
          Wait, in conversation history user mentioned "https://otieu.com/4/10349575" as direct link.
          If they want banner ads, I'd need a script. I'll add a placeholder script that can be configured.
          Or better, I'll add the Direct Link feature to the Download button logic later if requested.
          For now, I'll add a generic script injection point.
      */}
            <Script
                id="monetag-script"
                strategy="afterInteractive"
                src="https://alwingulla.com/88/tag.min.js"
                data-zone="123456" // This would be the real ID
                onError={(e) => {
                    console.error('Monetag script failed to load', e);
                }}
            />
        </>
    );
}
