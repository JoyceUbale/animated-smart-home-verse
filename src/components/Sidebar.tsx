
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Lock, 
  Mic, 
  ClipboardList,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: '/lights', 
      name: 'Lights', 
      icon: <Lightbulb className="h-5 w-5" /> 
    },
    { 
      path: '/thermostat', 
      name: 'Thermostat', 
      icon: <Thermometer className="h-5 w-5" /> 
    },
    { 
      path: '/security', 
      name: 'Security', 
      icon: <Lock className="h-5 w-5" /> 
    },
    { 
      path: '/voice', 
      name: 'Voice Control', 
      icon: <Mic className="h-5 w-5" /> 
    },
    { 
      path: '/history', 
      name: 'Device History', 
      icon: <ClipboardList className="h-5 w-5" /> 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];
  
  // Animation variants
  const sidebarVariants = {
    expanded: { width: '240px', transition: { duration: 0.3 } },
    collapsed: { width: '80px', transition: { duration: 0.3 } },
  };
  
  return (
    <motion.aside
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className={cn(
        "flex flex-col border-r bg-secondary dark:bg-secondary/20 h-screen sticky top-0 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1, transition: { duration: 0.2 } }}
          className="font-bold text-xl"
        >
          SmartHome
        </motion.div>
        <Button
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size={isCollapsed ? "icon" : "default"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isCollapsed ? "justify-center" : ""
                    )}
                  >
                    {item.icon}
                    <motion.span
                      animate={{ opacity: isCollapsed ? 0 : 1 }}
                      className={isCollapsed ? "sr-only" : ""}
                    >
                      {item.name}
                    </motion.span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <motion.div 
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        className="p-4 text-xs text-center text-muted-foreground"
      >
        Smart Home Controller v1.0
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
