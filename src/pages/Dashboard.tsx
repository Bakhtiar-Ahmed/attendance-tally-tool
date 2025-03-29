
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  link 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string; 
  link: string 
}) => (
  <Link to={link}>
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  </Link>
);

const Dashboard = () => {
  // This would come from an API in a real application
  const stats = {
    totalStudents: 87,
    classesScheduled: 6,
    averageAttendance: "78%",
    lowAttendance: 12
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Teacher Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={Users} 
            color="bg-edu-primary" 
            link="/students" 
          />
          <DashboardCard 
            title="Classes Scheduled" 
            value={stats.classesScheduled} 
            icon={Calendar} 
            color="bg-edu-secondary" 
            link="/schedule" 
          />
          <DashboardCard 
            title="Avg. Attendance" 
            value={stats.averageAttendance} 
            icon={CheckCircle} 
            color="bg-green-500" 
            link="/reports" 
          />
          <DashboardCard 
            title="Low Attendance" 
            value={stats.lowAttendance} 
            icon={AlertCircle} 
            color="bg-red-500" 
            link="/reports?filter=low" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
            <div className="space-y-3">
              {[
                { name: "Web Development", time: "9:00 AM - 10:30 AM", room: "Lab 101" },
                { name: "Data Structures", time: "11:00 AM - 12:30 PM", room: "Room 203" },
                { name: "Computer Networks", time: "2:00 PM - 3:30 PM", room: "Lab 105" }
              ].map((cls, index) => (
                <div key={index} className="flex justify-between p-3 bg-edu-light rounded-md">
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-gray-600">{cls.room}</p>
                  </div>
                  <p className="text-sm text-gray-600">{cls.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Overview</h2>
            <div className="space-y-4">
              {[
                { name: "Web Development", percentage: 82 },
                { name: "Data Structures", percentage: 75 },
                { name: "Computer Networks", percentage: 88 },
                { name: "Database Systems", percentage: 65 }
              ].map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className="text-sm text-gray-600">{subject.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        subject.percentage >= 85 ? 'bg-green-500' : 
                        subject.percentage >= 75 ? 'bg-edu-secondary' : 'bg-red-500'
                      }`} 
                      style={{ width: `${subject.percentage}%` }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;
