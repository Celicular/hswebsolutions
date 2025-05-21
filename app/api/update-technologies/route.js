import { NextResponse } from 'next/server';
import { executeQuery } from '../db';

export async function GET() {
  try {
    // First truncate the tables (in reverse order of foreign key dependencies)
    await executeQuery({
      query: 'TRUNCATE TABLE submission_frontend'
    });
    
    await executeQuery({
      query: 'TRUNCATE TABLE frontend_technologies'
    });
    
    // Insert new technologies
    const technologies = [
      'html', 'css', 'javascript', 'react', 'vue', 'angular',
      'nextjs', 'svelte', 'bootstrap', 'tailwind'
    ];
    
    for (const tech of technologies) {
      await executeQuery({
        query: 'INSERT INTO frontend_technologies (tech_name) VALUES (?)',
        values: [tech]
      });
    }
    
    // Verify the technologies
    const result = await executeQuery({
      query: 'SELECT * FROM frontend_technologies ORDER BY id'
    });
    
    return NextResponse.json({
      message: 'Successfully updated frontend technologies',
      technologies: result
    });
    
  } catch (error) {
    console.error('Error updating technologies:', error);
    return NextResponse.json(
      { error: 'Failed to update technologies' },
      { status: 500 }
    );
  }
}
