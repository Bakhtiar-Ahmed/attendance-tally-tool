
import React from 'react';
import { Link } from 'react-router-dom';
import { School, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-edu-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8" />
            <Link to="/" className="text-xl font-bold">ClassTrack</Link>
          </div>
          
          {isMobile ? (
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-edu-light hover:text-edu-primary">Dashboard</Link>
                  <Link to="/students" className="block px-4 py-2 text-sm text-gray-700 hover:bg-edu-light hover:text-edu-primary">Students</Link>
                  <Link to="/attendance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-edu-light hover:text-edu-primary">Attendance</Link>
                  <Link to="/schedule" className="block px-4 py-2 text-sm text-gray-700 hover:bg-edu-light hover:text-edu-primary">Schedule</Link>
                  <Link to="/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-edu-light hover:text-edu-primary">Reports</Link>
                </div>
              )}
            </div>
          ) : (
            <nav className="flex items-center space-x-6">
              <Link to="/" className="hover:text-edu-accent">Dashboard</Link>
              <Link to="/students" className="hover:text-edu-accent">Students</Link>
              <Link to="/attendance" className="hover:text-edu-accent">Attendance</Link>
              <Link to="/schedule" className="hover:text-edu-accent">Schedule</Link>
              <Link to="/reports" className="hover:text-edu-accent">Reports</Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
