import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, Plus, Edit, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  assignment: string;
  grade: number;
  maxGrade: number;
  type: "exam" | "assignment" | "quiz" | "project";
  date: string;
  class: string;
}

const mockGrades: Grade[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Alice Johnson",
    subject: "Mathematics",
    assignment: "Algebra Test 1",
    grade: 85,
    maxGrade: 100,
    type: "exam",
    date: "2024-12-15",
    class: "10A"
  },
  {
    id: "2",
    studentId: "1",
    studentName: "Alice Johnson",
    subject: "English",
    assignment: "Essay Assignment",
    grade: 92,
    maxGrade: 100,
    type: "assignment",
    date: "2024-12-14",
    class: "10A"
  },
  {
    id: "3",
    studentId: "2",
    studentName: "Bob Smith",
    subject: "Mathematics",
    assignment: "Geometry Quiz",
    grade: 78,
    maxGrade: 100,
    type: "quiz",
    date: "2024-12-16",
    class: "11B"
  },
  {
    id: "4",
    studentId: "2",
    studentName: "Bob Smith",
    subject: "Science",
    assignment: "Physics Lab Report",
    grade: 88,
    maxGrade: 100,
    type: "project",
    date: "2024-12-13",
    class: "11B"
  },
  {
    id: "5",
    studentId: "3",
    studentName: "Carol Davis",
    subject: "History",
    assignment: "World War II Test",
    grade: 75,
    maxGrade: 100,
    type: "exam",
    date: "2024-12-12",
    class: "9C"
  }
];

const subjects = ["All Subjects", "Mathematics", "English", "Science", "History", "Geography", "Art", "Music"];
const gradeTypes = ["All Types", "exam", "assignment", "quiz", "project"];

export function GradesManagement() {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterType, setFilterType] = useState("All Types");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    subject: "",
    assignment: "",
    grade: "",
    maxGrade: "100",
    type: "assignment" as Grade["type"],
    class: ""
  });

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "All Subjects" || grade.subject === filterSubject;
    const matchesType = filterType === "All Types" || grade.type === filterType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const handleAddGrade = () => {
    const newGrade: Grade = {
      id: (grades.length + 1).toString(),
      studentId: "unknown",
      studentName: formData.studentName,
      subject: formData.subject,
      assignment: formData.assignment,
      grade: parseInt(formData.grade),
      maxGrade: parseInt(formData.maxGrade),
      type: formData.type,
      date: new Date().toISOString().split('T')[0],
      class: formData.class
    };
    
    setGrades([...grades, newGrade]);
    setFormData({
      studentName: "",
      subject: "",
      assignment: "",
      grade: "",
      maxGrade: "100",
      type: "assignment",
      class: ""
    });
    setIsAddDialogOpen(false);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeBadge = (type: string) => {
    switch (type) {
      case "exam":
        return <Badge className="bg-red-100 text-red-800">Exam</Badge>;
      case "assignment":
        return <Badge className="bg-blue-100 text-blue-800">Assignment</Badge>;
      case "quiz":
        return <Badge className="bg-yellow-100 text-yellow-800">Quiz</Badge>;
      case "project":
        return <Badge className="bg-green-100 text-green-800">Project</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getClassAverage = () => {
    if (filteredGrades.length === 0) return 0;
    const total = filteredGrades.reduce((sum, grade) => sum + (grade.grade / grade.maxGrade) * 100, 0);
    return Math.round(total / filteredGrades.length);
  };

  const getSubjectAverages = () => {
    const subjectGroups = filteredGrades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = [];
      }
      acc[grade.subject].push((grade.grade / grade.maxGrade) * 100);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(subjectGroups).map(([subject, grades]) => ({
      subject,
      average: Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length),
      count: grades.length
    }));
  };

  const classAverage = getClassAverage();
  const subjectAverages = getSubjectAverages();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Grades Management</h1>
          <p className="text-muted-foreground">
            Track and manage student academic performance
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Grade</DialogTitle>
              <DialogDescription>
                Enter the grade information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student Name</Label>
                <Input
                  id="student"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  placeholder="Enter student name"
                />
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
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Grade["type"]})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment/Test Name</Label>
                <Input
                  id="assignment"
                  value={formData.assignment}
                  onChange={(e) => setFormData({...formData, assignment: e.target.value})}
                  placeholder="e.g., Algebra Test 1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    placeholder="85"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGrade">Max Grade</Label>
                  <Input
                    id="maxGrade"
                    type="number"
                    value={formData.maxGrade}
                    onChange={(e) => setFormData({...formData, maxGrade: e.target.value})}
                    placeholder="100"
                  />
                </div>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGrade}>Add Grade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(classAverage)}`}>
              {classAverage}%
            </div>
            <Progress value={classAverage} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredGrades.length}</div>
            <p className="text-xs text-muted-foreground">
              Recorded this semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredGrades.length > 0 ? Math.max(...filteredGrades.map(g => (g.grade / g.maxGrade) * 100)).toFixed(0) + "%" : "0%"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Grade</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredGrades.length > 0 ? Math.min(...filteredGrades.map(g => (g.grade / g.maxGrade) * 100)).toFixed(0) + "%" : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Averages */}
      {subjectAverages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subject Averages</CardTitle>
            <CardDescription>
              Performance breakdown by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjectAverages.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{subject.subject}</span>
                    <span className={`text-sm font-bold ${getGradeColor(subject.average)}`}>
                      {subject.average}%
                    </span>
                  </div>
                  <Progress value={subject.average} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {subject.count} grade{subject.count !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students, subjects, or assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {gradeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All Types" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grades ({filteredGrades.length})</CardTitle>
          <CardDescription>
            A list of all recorded grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => {
                const percentage = Math.round((grade.grade / grade.maxGrade) * 100);
                return (
                  <TableRow key={grade.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${grade.studentName}`} />
                        <AvatarFallback>{grade.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{grade.studentName}</div>
                        <div className="text-sm text-muted-foreground">Class {grade.class}</div>
                      </div>
                    </TableCell>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate">{grade.assignment}</div>
                    </TableCell>
                    <TableCell>{getGradeBadge(grade.type)}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {grade.grade}/{grade.maxGrade}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getGradeColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </TableCell>
                    <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}