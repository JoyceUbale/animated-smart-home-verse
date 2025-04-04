
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export interface DeviceEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  eventType: string;
  status: string;
  timestamp: Date;
}

interface DeviceHistoryProps {
  events: DeviceEvent[];
  className?: string;
}

const DeviceHistory = ({ events, className }: DeviceHistoryProps) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const prevEvents = useRef<string[]>([]);
  
  // Format date to human readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Animate new events
  useEffect(() => {
    if (!tableRef.current) return;
    
    const currentEventIds = events.map(e => e.id);
    const newEvents = currentEventIds.filter(id => !prevEvents.current.includes(id));
    
    // Animate new rows
    newEvents.forEach(id => {
      const row = rowRefs.current.get(id);
      if (row) {
        gsap.fromTo(row,
          { backgroundColor: 'rgba(59, 130, 246, 0.15)', opacity: 0.7, x: -20 },
          { 
            backgroundColor: 'rgba(0, 0, 0, 0)',
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out'
          }
        );
      }
    });
    
    prevEvents.current = currentEventIds;
  }, [events]);
  
  // Save row refs for animation
  const setRowRef = (id: string, element: HTMLTableRowElement) => {
    rowRefs.current.set(id, element);
  };
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Device Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No recent activity
                </TableCell>
              </TableRow>
            ) : (
              events.map(event => (
                <TableRow 
                  key={event.id}
                  ref={el => el && setRowRef(event.id, el)}
                >
                  <TableCell>{formatDate(event.timestamp)}</TableCell>
                  <TableCell>{event.deviceName}</TableCell>
                  <TableCell>{event.eventType}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      event.status === 'on' || event.status === 'unlocked' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    )}>
                      {event.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DeviceHistory;
