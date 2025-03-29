
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
  SelectValue 
} from '@/components/ui/select';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

// Mock data - in a real app this would come from an API
const mockStudents = [
  { id: 1, name: 'John Doe', rollNo: 'CS-2021-01', semester: '3rd', email: 'john.doe@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', rollNo: 'CS-2021-02', semester: '3rd', email: 'jane.smith@example.com', phone: '234-567-8901' },
  { id: 3, name: 'Robert Johnson', rollNo: 'CS-2021-03', semester: '3rd', email: 'robert.j@example.com', phone: '345-678-9012' },
  { id: 4, name: 'Emily Davis', rollNo: 'CS-2021-04', semester: '3rd', email: 'emily.d@example.com', phone: '456-789-0123' },
  { id: 5, name: 'Michael Wilson', rollNo: 'CS-2021-05', semester: '3rd', email: 'michael.w@example.com', phone: '567-890-1234' },
];

type Student = {
  id: number;
  name: string;
  rollNo: string;
  semester: string;
  email: string;
  phone: string;
};

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    rollNo: '',
    semester: '',
    email: '',
    phone: ''
  });
  
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(term) ||
        student.rollNo.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNo || !newStudent.semester) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (currentStudent) {
      // Edit existing student
      const updatedStudents = students.map(student => 
        student.id === currentStudent.id ? { ...newStudent, id: student.id } : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      toast({
        title: "Student Updated",
        description: `${newStudent.name} has been updated successfully.`
      });
    } else {
      // Add new student
      const newId = Math.max(...students.map(s => s.id)) + 1;
      const studentToAdd = { ...newStudent, id: newId };
      const updatedStudents = [...students, studentToAdd];
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      toast({
        title: "Student Added",
        description: `${newStudent.name} has been added successfully.`
      });
    }
    
    setIsAddDialogOpen(false);
    setCurrentStudent(null);
    setNewStudent({ name: '', rollNo: '', semester: '', email: '', phone: '' });
  };

  const handleDeleteStudent = () => {
    if (currentStudent) {
      const updatedStudents = students.filter(student => student.id !== currentStudent.id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      
      toast({
        title: "Student Removed",
        description: `${currentStudent.name} has been removed from the system.`
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentStudent(null);
    }
  };

  const openEditDialog = (student: Student) => {
    setCurrentStudent(student);
    setNewStudent({
      name: student.name,
      rollNo: student.rollNo,
      semester: student.semester,
      email: student.email,
      phone: student.phone
    });
    setIsAddDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Navbar />
      <PageContainer title="Student Management">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle>Student List</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button onClick={() => {
                setCurrentStudent(null);
                setNewStudent({ name: '', rollNo: '', semester: '', email: '', phone: '' });
                setIsAddDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(student)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      No students found. {searchTerm && 'Try a different search term.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                {currentStudent 
                  ? 'Update student details. Click save when you\'re done.' 
                  : 'Enter student information. Required fields are marked with *'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rollNo">Roll Number *</Label>
                <Input 
                  id="rollNo" 
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select 
                  value={newStudent.semester}
                  onValueChange={(value) => setNewStudent({...newStudent, semester: value})}
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStudent}>{currentStudent ? 'Save Changes' : 'Add Student'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove {currentStudent?.name} from the system? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteStudent}>Delete Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  );
};

export default StudentManagement;
