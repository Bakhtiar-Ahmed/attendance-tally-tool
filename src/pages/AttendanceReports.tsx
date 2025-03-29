
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

// Mock data - in a real app this would come from an API
const mockClasses = [
  { id: 1, name: 'Web Development', code: 'CS301' },
  { id: 2, name: 'Data Structures', code: 'CS201' },
  { id: 3, name: 'Computer Networks', code: 'CS401' },
  { id: 4, name: 'Database Systems', code: 'CS302' },
];

const mockStudentAttendance = [
  { id: 1, name: 'John Doe', rollNo: 'CS-2021-01', attendance: { 1: 85, 2: 72, 3: 90, 4: 88 } },
  { id: 2, name: 'Jane Smith', rollNo: 'CS-2021-02', attendance: { 1: 92, 2: 95, 3: 88, 4: 90 } },
  { id: 3, name: 'Robert Johnson', rollNo: 'CS-2021-03', attendance: { 1: 78, 2: 65, 3: 72, 4: 70 } },
  { id: 4, name: 'Emily Davis', rollNo: 'CS-2021-04', attendance: { 1: 94, 2: 90, 3: 92, 4: 95 } },
  { id: 5, name: 'Michael Wilson', rollNo: 'CS-2021-05', attendance: { 1: 65, 2: 58, 3: 70, 4: 62 } },
];

const AttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState('1');
  const [activeTab, setActiveTab] = useState('student-wise');

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { status: 'Good', color: 'text-green-500 bg-green-50' };
    if (percentage >= 75) return { status: 'Average', color: 'text-yellow-500 bg-yellow-50' };
    return { status: 'Poor', color: 'text-red-500 bg-red-50' };
  };

  const getNcDcStatus = (percentage: number) => {
    if (percentage < 60) return 'DC';
    if (percentage < 75) return 'NC';
    return '-';
  };

  const sortedStudents = [...mockStudentAttendance].sort(
    (a, b) => b.attendance[parseInt(selectedClass)] - a.attendance[parseInt(selectedClass)]
  );

  const chartData = mockStudentAttendance.map(student => ({
    name: student.name.split(' ')[0],
    attendance: student.attendance[parseInt(selectedClass)]
  }));

  const averageAttendance = (
    mockStudentAttendance.reduce(
      (sum, student) => sum + student.attendance[parseInt(selectedClass)], 
      0
    ) / mockStudentAttendance.length
  ).toFixed(1);

  return (
    <>
      <Navbar />
      <PageContainer title="Attendance Reports">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-64">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student-wise">Student-wise Report</TabsTrigger>
            <TabsTrigger value="nc-dc-list">NC/DC List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student-wise">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averageAttendance}%</div>
                  <Progress value={parseFloat(averageAttendance)} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Best Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div>
                      <div className="text-3xl font-bold">
                        {sortedStudents[0]?.attendance[parseInt(selectedClass)]}%
                      </div>
                      <div className="text-sm text-gray-500">{sortedStudents[0]?.name}</div>
                    </div>
                    <Award className="ml-auto h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Students Below 75%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div>
                      <div className="text-3xl font-bold">
                        {mockStudentAttendance.filter(
                          student => student.attendance[parseInt(selectedClass)] < 75
                        ).length}
                      </div>
                      <div className="text-sm text-gray-500">Students at risk</div>
                    </div>
                    <AlertTriangle className="ml-auto h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Percentage by Student</CardTitle>
                <CardDescription>
                  For {mockClasses.find(cls => cls.id.toString() === selectedClass)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar 
                        dataKey="attendance" 
                        fill="#3B82F6" 
                        name="Attendance %" 
                        label={{ position: 'top', formatter: (value: number) => `${value}%` }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-right">Attendance %</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.map(student => {
                      const attendance = student.attendance[parseInt(selectedClass)];
                      const { status, color } = getAttendanceStatus(attendance);
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNo}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="text-right">{attendance}%</TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                              {status}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nc-dc-list">
            <Card>
              <CardHeader>
                <CardTitle>NC/DC List</CardTitle>
                <CardDescription>
                  Students with attendance below threshold for {mockClasses.find(cls => cls.id.toString() === selectedClass)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">NC List (Below 75%)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockStudentAttendance
                          .filter(student => {
                            const attendance = student.attendance[parseInt(selectedClass)];
                            return attendance < 75 && attendance >= 60;
                          })
                          .map(student => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.rollNo}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell className="text-right">{student.attendance[parseInt(selectedClass)]}%</TableCell>
                            </TableRow>
                          ))}
                        {mockStudentAttendance.filter(student => {
                          const attendance = student.attendance[parseInt(selectedClass)];
                          return attendance < 75 && attendance >= 60;
                        }).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                              No students in NC list
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">DC List (Below 60%)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockStudentAttendance
                          .filter(student => student.attendance[parseInt(selectedClass)] < 60)
                          .map(student => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.rollNo}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell className="text-right">{student.attendance[parseInt(selectedClass)]}%</TableCell>
                            </TableRow>
                          ))}
                        {mockStudentAttendance.filter(student => 
                          student.attendance[parseInt(selectedClass)] < 60
                        ).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                              No students in DC list
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md mt-6">
                  <h3 className="text-amber-800 font-medium mb-2">Note:</h3>
                  <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                    <li>NC (Not Cleared): Attendance between 60% and 75%</li>
                    <li>DC (Detained from Course): Attendance below 60%</li>
                    <li>Students in NC list need to improve their attendance</li>
                    <li>Students in DC list may not be allowed to sit for exams</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
};

export default AttendanceReports;
