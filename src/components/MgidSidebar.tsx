"use client";

import { useEffect } from "react";

export default function MgidSidebar() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://jsc.mgid.com/a/g/agtalist.info.123456.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <aside className="hidden xl:block w-[320px] sticky top-24 self-start flex-shrink-0">
            <div className="bg-[#121212] border border-white/10 rounded-xl p-4 min-h-[600px]">
                <p className="text-xs text-white/50 mb-2">Sponsored</p>

                {/* MGID widget container */}
                <div id="MgidWidget-123456"></div>
            </div>
        </aside>
    );
}
