"use client"
import { useState, useEffect } from 'react'
import { Project } from '@/types'

export function useProjects(cityName: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const connectSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      setIsLoading(true);
      eventSource = new EventSource(`/api/projects/${cityName}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'project':
              setProjects(prev => [...prev, data.data]);
              setIsLoading(false);
              break;
            case 'heartbeat':
              break;
            case 'error':
              setError(data.message);
              setIsLoading(false);
              eventSource?.close();
              break;
            case 'end':
              setIsLoading(false);
              eventSource?.close();
              break;
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onopen = () => {
        console.log('SSE Connection opened');
        retryCount = 0;
        setError(null);
      };

      eventSource.onerror = (err) => {
        console.warn('SSE Connection error:', err);
        eventSource?.close();
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${MAX_RETRIES})...`);
          retryTimeout = setTimeout(connectSSE, 1000 * retryCount);
        } else {
          setError('Failed to load projects. Please refresh the page.');
          setIsLoading(false);
        }
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [cityName]);
  return { projects,isLoading,error }
}

