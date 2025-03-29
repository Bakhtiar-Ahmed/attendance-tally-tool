
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Save, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

// Mock data - in a real app this would come from an API
const mockClasses = [
  { id: 1, name: 'Web Development', code: 'CS301' },
  { id: 2, name: 'Data Structures', code: 'CS201' },
  { id: 3, name: 'Computer Networks', code: 'CS401' },
  { id: 4, name: 'Database Systems', code: 'CS302' },
];

const mockStudents = [
  { id: 1, name: 'John Doe', rollNo: 'CS-2021-01' },
  { id: 2, name: 'Jane Smith', rollNo: 'CS-2021-02' },
  { id: 3, name: 'Robert Johnson', rollNo: 'CS-2021-03' },
  { id: 4, name: 'Emily Davis', rollNo: 'CS-2021-04' },
  { id: 5, name: 'Michael Wilson', rollNo: 'CS-2021-05' },
];

type AttendanceRecord = {
  studentId: number;
  present: boolean;
};

const AttendanceTracking = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isAttendanceTaken, setIsAttendanceTaken] = useState(false);
  const { toast } = useToast();

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    
    // Reset attendance when class changes
    const initialAttendance: Record<number, boolean> = {};
    mockStudents.forEach(student => {
      initialAttendance[student.id] = false;
    });
    setAttendance(initialAttendance);
    setIsAttendanceTaken(false);
  };

  const handleAttendanceChange = (studentId: number, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<number, boolean> = {};
    mockStudents.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
  };

  const saveAttendance = () => {
    if (!selectedClass) {
      toast({
        title: "No Class Selected",
        description: "Please select a class before saving attendance.",
        variant: "destructive"
      });
      return;
    }

    if (!date) {
      toast({
        title: "No Date Selected",
        description: "Please select a date for the attendance record.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send data to an API
    console.log('Saving attendance for:', {
      class: selectedClass,
      date: format(date, 'yyyy-MM-dd'),
      attendance
    });

    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(date, 'PP')} has been recorded successfully.`
    });
    
    setIsAttendanceTaken(true);
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Mark Attendance">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle>Attendance Record</CardTitle>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
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
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[200px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            {selectedClass ? (
              <>
                <div className="flex justify-between mb-4">
                  <Button variant="outline" onClick={markAllPresent}>
                    Mark All Present
                  </Button>
                  <Button onClick={saveAttendance} disabled={isAttendanceTaken}>
                    <Save className="mr-2 h-4 w-4" /> Save Attendance
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={attendance[student.id] || false}
                            onCheckedChange={(checked) => {
                              handleAttendanceChange(student.id, checked === true);
                            }}
                            disabled={isAttendanceTaken}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {isAttendanceTaken && (
                  <div className="flex items-center justify-center mt-4 p-3 bg-green-50 text-green-600 rounded-md">
                    <FileCheck className="h-5 w-5 mr-2" />
                    Attendance has been recorded for {format(date!, 'PP')}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Please select a class to view the attendance sheet.
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default AttendanceTracking;
