import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = [
        'MONGODB_URI',
        'JWT_SECRET',
        'ADMIN_USERNAME',
        'ADMIN_PASSWORD',
        'UPLOADTHING_TOKEN',
        'NEXT_PUBLIC_SITE_URL'
    ];

    const status = envVars.reduce((acc, key) => {
        const val = process.env[key];
        acc[key] = {
            isSet: !!val,
            length: val ? val.length : 0,
            // Show first/last chars for non-sensitive ones or masked ones
            preview: val ? (key.includes('SECRET') || key.includes('URI') || key.includes('TOKEN')
                ? `${val.substring(0, 3)}...${val.substring(val.length - 3)}`
                : val) : 'MISSING'
        };
        return acc;
    }, {} as any);

    return NextResponse.json({
        message: "Environment Diagnostic",
        timestamp: new Date().toISOString(),
        status
    });
}
