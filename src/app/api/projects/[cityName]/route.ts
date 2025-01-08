import { scrapeProjects } from '@/lib/scraper';
import { geocodeProjects } from '@/lib/geocoder';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(
  request: Request,
  { params }: { params: { cityName: string } }
) {
  const encoder = new TextEncoder();
  let writerClosed = false;
  
  try {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

    const safeWrite = async (data: string) => {
      if (!writerClosed) {
        try {
          await writer.write(encoder.encode(data));
          return true;
        } catch (error) {
          console.log("Write failed, stream might be closed");
          writerClosed = true;
          return false;
        }
      }
      return false;
    };

    const safeClose = async () => {
      if (!writerClosed) {
        try {
          await writer.close();
          writerClosed = true;
        } catch (error) {
          console.log("Close failed, stream might already be closed");
        }
      }
    };

    request.signal.addEventListener('abort', () => {
      writerClosed = true;
      safeClose();
    });

    (async () => {
      try {
        let projectCount = 0;
        
        for await (const project of scrapeProjects(params.cityName)) {
          if (writerClosed) break;

          const projectWithCoordinates = await geocodeProjects(project);
          const success = await safeWrite(
            `data: ${JSON.stringify({
              type: 'project',
              data: projectWithCoordinates
            })}\n\n`
          );

          if (!success) break;
          projectCount++;

          if (projectCount % 3 === 0) {
            const heartbeatSuccess = await safeWrite(
              `data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`
            );
            if (!heartbeatSuccess) break;
          }
        }

        if (!writerClosed) {
          await safeWrite(
            `data: ${JSON.stringify({ type: 'end', count: projectCount })}\n\n`
          );
        }
      } catch (error:any) {
        console.error('Error processing projects:', error);
        if (!writerClosed) {
          await safeWrite(
            `data: ${JSON.stringify({ 
              type: 'error', 
              message: error.message 
            })}\n\n`
          );
        }
      } finally {
        await safeClose();
      }
    })();

    return response;
  } catch (error:any) {
    console.error('Error setting up stream:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to setup stream' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}