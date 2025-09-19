import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  experience: number;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  qualifications: string;
  classes: string[];
}

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    subject: "Mathematics",
    department: "STEM",
    experience: 8,
    status: "active",
    joinDate: "2020-09-01",
    qualifications: "PhD Mathematics, M.Ed",
    classes: ["10A", "10B", "11A"]
  },
  {
    id: "2",
    name: "Mr. Michael Brown",
    email: "michael.brown@school.edu",
    phone: "(555) 234-5678",
    subject: "English Literature",
    department: "Languages",
    experience: 12,
    status: "active",
    joinDate: "2018-08-15",
    qualifications: "MA English Literature",
    classes: ["9A", "9B", "12A"]
  },
  {
    id: "3",
    name: "Ms. Emily Davis",
    email: "emily.davis@school.edu",
    phone: "(555) 345-6789",
    subject: "Physics",
    department: "STEM",
    experience: 5,
    status: "on-leave",
    joinDate: "2021-01-10",
    qualifications: "MSc Physics, B.Ed",
    classes: ["11B", "12B"]
  },
  {
    id: "4",
    name: "Prof. Robert Wilson",
    email: "robert.wilson@school.edu",
    phone: "(555) 456-7890",
    subject: "History",
    department: "Social Studies",
    experience: 15,
    status: "active",
    joinDate: "2015-09-01",
    qualifications: "PhD History, MA Education",
    classes: ["9C", "10C", "11C"]
  }
];

const departments = ["All Departments", "STEM", "Languages", "Social Studies", "Arts", "Physical Education"];
const subjects = ["All Subjects", "Mathematics", "English Literature", "Physics", "Chemistry", "Biology", "History", "Geography", "Art", "Music"];

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
    experience: "",
    qualifications: "",
    classes: ""
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "All Departments" || teacher.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || teacher.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddTeacher = () => {
    const newTeacher: Teacher = {
      id: (teachers.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      department: formData.department,
      experience: parseInt(formData.experience) || 0,
      status: "active",
      joinDate: new Date().toISOString().split('T')[0],
      qualifications: formData.qualifications,
      classes: formData.classes.split(',').map(c => c.trim()).filter(c => c)
    };
    
    setTeachers([...teachers, newTeacher]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      department: "",
      experience: "",
      qualifications: "",
      classes: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      department: teacher.department,
      experience: teacher.experience.toString(),
      qualifications: teacher.qualifications,
      classes: teacher.classes.join(', ')
    });
  };

  const handleUpdateTeacher = () => {
    if (!editingTeacher) return;
    
    const updatedTeachers = teachers.map(t => 
      t.id === editingTeacher.id 
        ? { 
            ...t, 
            ...formData,
            experience: parseInt(formData.experience) || 0,
            classes: formData.classes.split(',').map(c => c.trim()).filter(c => c)
          }
        : t
    );
    
    setTeachers(updatedTeachers);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      department: "",
      experience: "",
      qualifications: "",
      classes: ""
    });
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "on-leave":
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStats = () => {
    const total = teachers.length;
    const active = teachers.filter(t => t.status === "active").length;
    const onLeave = teachers.filter(t => t.status === "on-leave").length;
    const avgExperience = total > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.experience, 0) / total) : 0;
    
    return { total, active, onLeave, avgExperience };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Teacher Management</h1>
          <p className="text-muted-foreground">
            Manage teaching staff, assignments, and information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Enter the teacher's information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john.doe@school.edu"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.slice(1).map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.slice(1).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                  placeholder="PhD Mathematics, M.Ed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classes">Classes (comma-separated)</Label>
                <Input
                  id="classes"
                  value={formData.classes}
                  onChange={(e) => setFormData({...formData, classes: e.target.value})}
                  placeholder="10A, 10B, 11A"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeacher}>Add Teacher</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.onLeave}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgExperience} years</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
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
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers ({filteredTeachers.length})</CardTitle>
          <CardDescription>
            A list of all teaching staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject/Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} />
                      <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm text-muted-foreground">{teacher.qualifications}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{teacher.subject}</div>
                    <div className="text-sm text-muted-foreground">{teacher.department}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-32">{teacher.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{teacher.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.experience} years</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.slice(0, 2).map((cls) => (
                        <Badge key={cls} variant="outline" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                      {teacher.classes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.classes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTeacher(teacher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
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
      <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update the teacher's information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-experience">Experience (years)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.slice(1).map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.slice(1).map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-qualifications">Qualifications</Label>
              <Input
                id="edit-qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-classes">Classes (comma-separated)</Label>
              <Input
                id="edit-classes"
                value={formData.classes}
                onChange={(e) => setFormData({...formData, classes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTeacher(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTeacher}>Update Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}