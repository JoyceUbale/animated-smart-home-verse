
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, Device } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface SmartHomeContextType {
  devices: Device[];
  loading: boolean;
  error: string | null;
  refreshDevices: () => Promise<void>;
  toggleLight: (id: string) => Promise<void>;
  setThermostat: (id: string, temperature: number) => Promise<void>;
  toggleLock: (id: string) => Promise<void>;
  getDevicesByType: (type: Device['type']) => Device[];
  getDeviceById: (id: string) => Device | undefined;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

export const SmartHomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDevices = async () => {
    try {
      setLoading(true);
      const fetchedDevices = await api.getDevices();
      setDevices(fetchedDevices);
      setError(null);
    } catch (err) {
      setError('Failed to fetch devices');
      toast({
        title: 'Error',
        description: 'Failed to fetch devices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLight = async (id: string) => {
    try {
      const updatedDevice = await api.toggleLight(id);
      if (updatedDevice) {
        setDevices(devices.map(device => (device.id === id ? updatedDevice : device)));
        toast({
          title: 'Light Updated',
          description: `${updatedDevice.name} turned ${updatedDevice.status}`,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to toggle light',
        variant: 'destructive',
      });
    }
  };

  const setThermostat = async (id: string, temperature: number) => {
    try {
      const updatedDevice = await api.setThermostat(id, temperature);
      if (updatedDevice) {
        setDevices(devices.map(device => (device.id === id ? updatedDevice : device)));
        toast({
          title: 'Thermostat Updated',
          description: `${updatedDevice.name} set to ${temperature}°C`,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to set thermostat',
        variant: 'destructive',
      });
    }
  };

  const toggleLock = async (id: string) => {
    try {
      const updatedDevice = await api.toggleLock(id);
      if (updatedDevice) {
        setDevices(devices.map(device => (device.id === id ? updatedDevice : device)));
        toast({
          title: 'Lock Updated',
          description: `${updatedDevice.name} ${updatedDevice.status}`,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to toggle lock',
        variant: 'destructive',
      });
    }
  };

  const getDevicesByType = (type: Device['type']) => {
    return devices.filter(device => device.type === type);
  };

  const getDeviceById = (id: string) => {
    return devices.find(device => device.id === id);
  };

  useEffect(() => {
    refreshDevices();
  }, []);

  return (
    <SmartHomeContext.Provider
      value={{
        devices,
        loading,
        error,
        refreshDevices,
        toggleLight,
        setThermostat,
        toggleLock,
        getDevicesByType,
        getDeviceById,
      }}
    >
      {children}
    </SmartHomeContext.Provider>
  );
};

export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (context === undefined) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
};
