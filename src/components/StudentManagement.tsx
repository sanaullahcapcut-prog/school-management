import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  class: string;
  status: "active" | "inactive" | "graduated";
  enrollmentDate: string;
  phone: string;
  address: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    grade: "10",
    class: "10A",
    status: "active",
    enrollmentDate: "2024-09-01",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State"
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    grade: "11",
    class: "11B",
    status: "active",
    enrollmentDate: "2023-09-01",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, City, State"
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@email.com",
    grade: "9",
    class: "9C",
    status: "inactive",
    enrollmentDate: "2024-09-01",
    phone: "(555) 345-6789",
    address: "789 Pine St, City, State"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@email.com",
    grade: "12",
    class: "12A",
    status: "active",
    enrollmentDate: "2021-09-01",
    phone: "(555) 456-7890",
    address: "321 Elm St, City, State"
  }
];

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: "",
    class: "",
    phone: "",
    address: ""
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === "all" || student.grade === filterGrade;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleAddStudent = () => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      grade: formData.grade,
      class: formData.class,
      status: "active",
      enrollmentDate: new Date().toISOString().split('T')[0],
      phone: formData.phone,
      address: formData.address
    };
    
    setStudents([...students, newStudent]);
    setFormData({ name: "", email: "", grade: "", class: "", phone: "", address: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      grade: student.grade,
      class: student.class,
      phone: student.phone,
      address: student.address
    });
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    
    const updatedStudents = students.map(s => 
      s.id === editingStudent.id 
        ? { ...s, ...formData }
        : s
    );
    
    setStudents(updatedStudents);
    setEditingStudent(null);
    setFormData({ name: "", email: "", grade: "", class: "", phone: "", address: "" });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "graduated":
        return <Badge className="bg-blue-100 text-blue-800">Graduated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Student Management</h1>
          <p className="text-muted-foreground">
            Manage student records, enrollment, and information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student's information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter student's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="student@school.edu"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 12}, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Grade {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    placeholder="e.g., 10A"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Student's address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent}>Add Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Array.from({length: 12}, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Grade {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>
            A list of all students in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Grade/Class</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>Grade {student.grade}</div>
                    <div className="text-sm text-muted-foreground">Class {student.class}</div>
                  </TableCell>
                  <TableCell>
                    <div>{student.phone}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-32">
                      {student.address}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-grade">Grade</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-class">Class</Label>
                <Input
                  id="edit-class"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStudent}>Update Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}