import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { CalendarIcon, Download, Filter, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";
import { format } from "./ui/date-utils";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  class: string;
  grade: string;
  notes?: string;
}

const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Alice Johnson",
    date: "2024-12-18",
    status: "present",
    class: "10A",
    grade: "10"
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Bob Smith",
    date: "2024-12-18",
    status: "late",
    class: "11B",
    grade: "11",
    notes: "Traffic delay"
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Carol Davis",
    date: "2024-12-18",
    status: "absent",
    class: "9C",
    grade: "9",
    notes: "Sick"
  },
  {
    id: "4",
    studentId: "4",
    studentName: "David Wilson",
    date: "2024-12-18",
    status: "present",
    class: "12A",
    grade: "12"
  },
  {
    id: "5",
    studentId: "1",
    studentName: "Alice Johnson",
    date: "2024-12-17",
    status: "present",
    class: "10A",
    grade: "10"
  },
  {
    id: "6",
    studentId: "2",
    studentName: "Bob Smith",
    date: "2024-12-17",
    status: "absent",
    class: "11B",
    grade: "11",
    notes: "Family emergency"
  }
];

const classes = ["All Classes", "9A", "9B", "9C", "10A", "10B", "11A", "11B", "12A", "12B"];

export function AttendanceTracker() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttendance = attendance.filter(record => {
    const matchesDate = record.date === format(selectedDate, "yyyy-MM-dd");
    const matchesClass = selectedClass === "All Classes" || record.class === selectedClass;
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesClass && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case "excused":
        return <Badge className="bg-blue-100 text-blue-800">Excused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateAttendanceStatus = (id: string, newStatus: string) => {
    setAttendance(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, status: newStatus as any }
          : record
      )
    );
  };

  const getAttendanceStats = () => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(r => r.status === "present").length;
    const absent = filteredAttendance.filter(r => r.status === "absent").length;
    const late = filteredAttendance.filter(r => r.status === "late").length;
    const excused = filteredAttendance.filter(r => r.status === "excused").length;
    
    return {
      total,
      present,
      absent,
      late,
      excused,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Attendance Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage student attendance records
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentPercentage}%</div>
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
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-48 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Attendance for {format(selectedDate, "MMMM d, yyyy")}
            {selectedClass !== "All Classes" && ` - ${selectedClass}`}
          </CardTitle>
          <CardDescription>
            Click on status badges to update attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.studentName}`} />
                      <AvatarFallback>{record.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{record.studentName}</div>
                      <div className="text-sm text-muted-foreground">Grade {record.grade}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>
                    <Select 
                      value={record.status} 
                      onValueChange={(value) => updateAttendanceStatus(record.id, value)}
                    >
                      <SelectTrigger className="w-28 border-none p-0 h-auto">
                        <SelectValue asChild>
                          {getStatusBadge(record.status)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="excused">Excused</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {record.notes || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAttendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No attendance records found for the selected date and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}