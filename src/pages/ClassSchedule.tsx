
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO, isEqual } from 'date-fns';
import { PlusCircle, CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

// Mock data for classes
const mockClasses = [
  { id: 1, name: 'Web Development', code: 'CS301' },
  { id: 2, name: 'Data Structures', code: 'CS201' },
  { id: 3, name: 'Computer Networks', code: 'CS401' },
  { id: 4, name: 'Database Systems', code: 'CS302' },
];

// Mock data for scheduled classes
const mockScheduledClasses = [
  { 
    id: 1, 
    classId: 1, 
    date: '2023-09-20', 
    startTime: '09:00', 
    endTime: '10:30', 
    room: 'Lab 101' 
  },
  { 
    id: 2, 
    classId: 2, 
    date: '2023-09-20', 
    startTime: '11:00', 
    endTime: '12:30', 
    room: 'Room 203' 
  },
  { 
    id: 3, 
    classId: 3, 
    date: '2023-09-20', 
    startTime: '14:00', 
    endTime: '15:30', 
    room: 'Lab 105' 
  },
  { 
    id: 4, 
    classId: 4, 
    date: '2023-09-21', 
    startTime: '09:00', 
    endTime: '10:30', 
    room: 'Room 305' 
  },
  { 
    id: 5, 
    classId: 1, 
    date: '2023-09-22', 
    startTime: '09:00', 
    endTime: '10:30', 
    room: 'Lab 101' 
  },
];

type ScheduledClass = {
  id: number;
  classId: number;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
};

const ClassSchedule = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>(mockScheduledClasses);
  const [newClass, setNewClass] = useState<Omit<ScheduledClass, 'id'>>({
    classId: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    room: ''
  });
  
  const { toast } = useToast();

  const getClassesForDate = (selectedDate: Date) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return scheduledClasses.filter(cls => cls.date === formattedDate)
      .map(cls => {
        const classInfo = mockClasses.find(c => c.id === cls.classId);
        return {
          ...cls,
          className: classInfo ? classInfo.name : 'Unknown Class',
          classCode: classInfo ? classInfo.code : 'Unknown'
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const currentDateClasses = getClassesForDate(date);

  const handleScheduleClass = () => {
    if (newClass.classId === 0 || !newClass.startTime || !newClass.endTime || !newClass.room) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...scheduledClasses.map(cls => cls.id), 0) + 1;
    const newScheduledClass: ScheduledClass = {
      id: newId,
      ...newClass
    };

    setScheduledClasses([...scheduledClasses, newScheduledClass]);
    
    toast({
      title: "Class Scheduled",
      description: `Class has been scheduled for ${format(parseISO(newClass.date), 'PP')}.`
    });
    
    setIsDialogOpen(false);
    setNewClass({
      classId: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '',
      endTime: '',
      room: ''
    });
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Class Schedule">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
              />
              <Button 
                className="w-full mt-4"
                onClick={() => {
                  setNewClass({
                    ...newClass,
                    date: format(date, 'yyyy-MM-dd')
                  });
                  setIsDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Class
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Classes for {format(date, 'PP')}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDateClasses.length > 0 ? (
                <div className="space-y-4">
                  {currentDateClasses.map(cls => (
                    <div key={cls.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{cls.className}</h3>
                          <p className="text-sm text-gray-500">{cls.classCode}</p>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{cls.startTime} - {cls.endTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{cls.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No classes scheduled for this date.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Class</DialogTitle>
              <DialogDescription>
                Enter class details to schedule it. Required fields are marked with *
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class *</Label>
                <Select 
                  value={newClass.classId.toString()} 
                  onValueChange={(value) => setNewClass({...newClass, classId: parseInt(value)})}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} ({cls.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <Input 
                    id="date" 
                    type="date"
                    value={newClass.date}
                    onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input 
                    id="startTime" 
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input 
                    id="endTime" 
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room">Room/Location *</Label>
                <Input 
                  id="room" 
                  value={newClass.room}
                  onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleScheduleClass}>Schedule Class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  );
};

export default ClassSchedule;
