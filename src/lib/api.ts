
// Mock API service for smart home devices

interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera';
  status: string;
  room: string;
  data?: Record<string, any>;
}

// Mock data
const devices: Device[] = [
  { 
    id: 'light-1', 
    name: 'Living Room Main Light', 
    type: 'light', 
    status: 'off', 
    room: 'Living Room' 
  },
  { 
    id: 'light-2', 
    name: 'Kitchen Ceiling Light', 
    type: 'light', 
    status: 'off', 
    room: 'Kitchen' 
  },
  { 
    id: 'light-3', 
    name: 'Bedroom Lamp', 
    type: 'light', 
    status: 'off', 
    room: 'Bedroom' 
  },
  { 
    id: 'light-4', 
    name: 'Bathroom Light', 
    type: 'light', 
    status: 'off',
    room: 'Bathroom' 
  },
  { 
    id: 'thermostat-1', 
    name: 'Living Room Thermostat', 
    type: 'thermostat', 
    status: 'on', 
    room: 'Living Room',
    data: { temperature: 22, mode: 'cooling' } 
  },
  { 
    id: 'thermostat-2', 
    name: 'Bedroom Thermostat', 
    type: 'thermostat', 
    status: 'on', 
    room: 'Bedroom',
    data: { temperature: 21, mode: 'cooling' } 
  },
  { 
    id: 'lock-1', 
    name: 'Front Door', 
    type: 'lock', 
    status: 'locked', 
    room: 'Entrance' 
  },
  { 
    id: 'lock-2', 
    name: 'Back Door', 
    type: 'lock', 
    status: 'locked', 
    room: 'Backyard' 
  },
  { 
    id: 'camera-1', 
    name: 'Front Door Camera', 
    type: 'camera', 
    status: 'on', 
    room: 'Entrance' 
  }
];

// Mock API service
export const api = {
  // Get all devices
  getDevices: (): Promise<Device[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...devices]), 500);
    });
  },
  
  // Get devices by type
  getDevicesByType: (type: Device['type']): Promise<Device[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(devices.filter(device => device.type === type)), 500);
    });
  },
  
  // Get device by ID
  getDeviceById: (id: string): Promise<Device | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(devices.find(device => device.id === id)), 300);
    });
  },
  
  // Update device status
  updateDeviceStatus: (id: string, status: string, data?: Record<string, any>): Promise<Device | undefined> => {
    return new Promise((resolve) => {
      const deviceIndex = devices.findIndex(device => device.id === id);
      if (deviceIndex === -1) {
        resolve(undefined);
        return;
      }
      
      devices[deviceIndex] = {
        ...devices[deviceIndex],
        status,
        ...(data ? { data: { ...devices[deviceIndex].data, ...data } } : {})
      };
      
      setTimeout(() => resolve(devices[deviceIndex]), 300);
    });
  },
  
  // Control light
  toggleLight: (id: string): Promise<Device | undefined> => {
    return new Promise((resolve) => {
      const device = devices.find(d => d.id === id && d.type === 'light');
      if (!device) {
        resolve(undefined);
        return;
      }
      
      const newStatus = device.status === 'off' ? 'on' : 'off';
      return resolve(api.updateDeviceStatus(id, newStatus));
    });
  },
  
  // Control thermostat
  setThermostat: (id: string, temperature: number): Promise<Device | undefined> => {
    return new Promise((resolve) => {
      const device = devices.find(d => d.id === id && d.type === 'thermostat');
      if (!device) {
        resolve(undefined);
        return;
      }
      
      return resolve(api.updateDeviceStatus(id, 'on', { temperature }));
    });
  },
  
  // Control lock
  toggleLock: (id: string): Promise<Device | undefined> => {
    return new Promise((resolve) => {
      const device = devices.find(d => d.id === id && d.type === 'lock');
      if (!device) {
        resolve(undefined);
        return;
      }
      
      const newStatus = device.status === 'locked' ? 'unlocked' : 'locked';
      return resolve(api.updateDeviceStatus(id, newStatus));
    });
  }
};

// Types for export
export type { Device };
