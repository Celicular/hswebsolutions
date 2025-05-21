import { executeQuery } from '../app/api/db.js';

async function verifyAndFixDatabase() {
    console.log('Starting database verification...');
    
    try {
        // 1. Verify frontend_technologies table
        console.log('\nChecking frontend_technologies table...');
        const technologies = await executeQuery({
            query: 'SELECT * FROM frontend_technologies'
        });
        console.log('Current technologies:', technologies);
        
        // 2. Insert missing technologies if needed
        const requiredTechnologies = [
            'html', 'css', 'javascript', 'react', 'vue', 'angular', 
            'nextjs', 'svelte', 'bootstrap', 'tailwind'
        ];
        
        for (const tech of requiredTechnologies) {
            try {
                await executeQuery({
                    query: 'INSERT IGNORE INTO frontend_technologies (tech_name) VALUES (?)',
                    values: [tech]
                });
                console.log(`Ensured technology exists: ${tech}`);
            } catch (error) {
                console.error(`Error ensuring technology ${tech}:`, error);
            }
        }
        
        // 3. Verify the updated table
        console.log('\nVerifying final state of frontend_technologies table...');
        const finalTechnologies = await executeQuery({
            query: 'SELECT * FROM frontend_technologies'
        });
        console.log('Updated technologies:', finalTechnologies);
        
        // 4. Check frontend submissions
        console.log('\nChecking submission_frontend table...');
        const submissions = await executeQuery({
            query: 'SELECT * FROM submission_frontend'
        });
        console.log('Current frontend submissions:', submissions);
        
    } catch (error) {
        console.error('Database verification failed:', error);
    }
}

verifyAndFixDatabase().then(() => {
    console.log('\nDatabase verification complete');
    process.exit(0);
}).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
});
