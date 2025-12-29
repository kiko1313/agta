// Script to delete all photos from AGTALIST
// This script will call the delete-all-photos API endpoint

const deleteAllPhotos = async () => {
    try {
        console.log('Deleting all photos from the database...');

        // Use the Vercel deployment URL
        const apiUrl = 'https://agtalist.info/api/content/delete-all-photos';

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add your auth token if needed
                // 'Cookie': 'your-auth-cookie-here'
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success:', data.message);
            console.log(`📊 Deleted ${data.deletedCount} photos`);
        } else {
            console.error('❌ Error:', data.error);
            if (response.status === 401) {
                console.log('\n⚠️  You need to be authenticated to delete photos.');
                console.log('Please log in to your admin panel first at: https://agtalist.info/admin');
            }
        }
    } catch (error) {
        console.error('❌ Failed to delete photos:', error.message);
    }
};

deleteAllPhotos();
