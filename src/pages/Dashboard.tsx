import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { GraduationCap, Users, BookOpen, DoorOpen, ClipboardList, Plus, Pencil, Trash2, Euro, Calendar, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import type { Instructors, Participants, Rooms, Courses, Registrations } from '@/types/app';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('courses');

  // Data state
  const [instructors, setInstructors] = useState<Instructors[]>([]);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [registrations, setRegistrations] = useState<Registrations[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [inst, part, rm, crs, reg] = await Promise.all([
          LivingAppsService.getInstructors(),
          LivingAppsService.getParticipants(),
          LivingAppsService.getRooms(),
          LivingAppsService.getCourses(),
          LivingAppsService.getRegistrations()
        ]);
        setInstructors(inst);
        setParticipants(part);
        setRooms(rm);
        setCourses(crs);
        setRegistrations(reg);
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Helper to get name from record URL
  const getInstructorName = (url?: string) => {
    const id = extractRecordId(url);
    const inst = instructors.find(i => i.record_id === id);
    return inst?.fields.name || '-';
  };

  const getParticipantName = (url?: string) => {
    const id = extractRecordId(url);
    const part = participants.find(p => p.record_id === id);
    return part?.fields.name || '-';
  };

  const getRoomName = (url?: string) => {
    const id = extractRecordId(url);
    const room = rooms.find(r => r.record_id === id);
    return room?.fields.room_name || '-';
  };

  const getCourseName = (url?: string) => {
    const id = extractRecordId(url);
    const course = courses.find(c => c.record_id === id);
    return course?.fields.title || '-';
  };

  // Stats
  const totalCourses = courses.length;
  const totalParticipants = participants.length;
  const totalInstructors = instructors.length;
  const totalRooms = rooms.length;
  const paidRegistrations = registrations.filter(r => r.fields.paid).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-glow">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Kursverwaltung</h1>
              <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Kurse, Dozenten und Teilnehmer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Kurse"
            value={totalCourses}
            loading={loading}
          />
          <StatsCard
            icon={<GraduationCap className="h-5 w-5" />}
            label="Dozenten"
            value={totalInstructors}
            loading={loading}
          />
          <StatsCard
            icon={<Users className="h-5 w-5" />}
            label="Teilnehmer"
            value={totalParticipants}
            loading={loading}
          />
          <StatsCard
            icon={<DoorOpen className="h-5 w-5" />}
            label="Räume"
            value={totalRooms}
            loading={loading}
          />
          <StatsCard
            icon={<Euro className="h-5 w-5" />}
            label="Bezahlt"
            value={paidRegistrations}
            subtitle={`von ${registrations.length}`}
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Kurse</span>
            </TabsTrigger>
            <TabsTrigger value="instructors" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Dozenten</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Teilnehmer</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="gap-2">
              <DoorOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Räume</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Anmeldungen</span>
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="animate-fade-in">
            <CoursesTab
              courses={courses}
              setCourses={setCourses}
              instructors={instructors}
              rooms={rooms}
              loading={loading}
              getInstructorName={getInstructorName}
            />
          </TabsContent>

          {/* Instructors Tab */}
          <TabsContent value="instructors" className="animate-fade-in">
            <InstructorsTab
              instructors={instructors}
              setInstructors={setInstructors}
              loading={loading}
            />
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="animate-fade-in">
            <ParticipantsTab
              participants={participants}
              setParticipants={setParticipants}
              loading={loading}
            />
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="animate-fade-in">
            <RoomsTab
              rooms={rooms}
              setRooms={setRooms}
              loading={loading}
            />
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="animate-fade-in">
            <RegistrationsTab
              registrations={registrations}
              setRegistrations={setRegistrations}
              participants={participants}
              courses={courses}
              loading={loading}
              getParticipantName={getParticipantName}
              getCourseName={getCourseName}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon, label, value, subtitle, loading }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-7 w-12" />
            ) : (
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Courses Tab
function CoursesTab({ courses, setCourses, instructors, rooms, loading, getInstructorName }: {
  courses: Courses[];
  setCourses: React.Dispatch<React.SetStateAction<Courses[]>>;
  instructors: Instructors[];
  rooms: Rooms[];
  loading: boolean;
  getInstructorName: (url?: string) => string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Courses | null>(null);
  const [formData, setFormData] = useState<Courses['fields']>({});

  const openCreate = () => {
    setEditingCourse(null);
    setFormData({});
    setDialogOpen(true);
  };

  const openEdit = (course: Courses) => {
    setEditingCourse(course);
    setFormData({ ...course.fields });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCourse) {
        await LivingAppsService.updateCourse(editingCourse.record_id, formData);
        setCourses(await LivingAppsService.getCourses());
      } else {
        await LivingAppsService.createCourse(formData);
        setCourses(await LivingAppsService.getCourses());
      }
      setDialogOpen(false);
    } catch (e) {
      console.error('Error saving course:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.record_id !== id));
    } catch (e) {
      console.error('Error deleting course:', e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Kurse</CardTitle>
          <CardDescription>Verwalten Sie alle Kurse</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Kurs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Kurs bearbeiten' : 'Neuer Kurs'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Ändern Sie die Kursdaten' : 'Erstellen Sie einen neuen Kurs'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Startdatum *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">Enddatum *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="max_participants">Max. Teilnehmer</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants || ''}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Preis (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Dozent</Label>
                <Select
                  value={extractRecordId(formData.instructor) || ''}
                  onValueChange={(val) => setFormData({ ...formData, instructor: val ? createRecordUrl(APP_IDS.INSTRUCTORS, val) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Dozent auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((inst) => (
                      <SelectItem key={inst.record_id} value={inst.record_id}>
                        {inst.fields.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Raum</Label>
                <Select
                  value={extractRecordId(formData.room) || ''}
                  onValueChange={(val) => setFormData({ ...formData, room: val ? createRecordUrl(APP_IDS.ROOMS, val) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Raum auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.record_id} value={room.record_id}>
                        {room.fields.room_name} ({room.fields.building})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSave}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState message="Keine Kurse vorhanden" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Dozent</TableHead>
                <TableHead>Zeitraum</TableHead>
                <TableHead>Max. TN</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead className="w-24">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.record_id}>
                  <TableCell className="font-medium">{course.fields.title}</TableCell>
                  <TableCell>{getInstructorName(course.fields.instructor)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {course.fields.start_date ? format(new Date(course.fields.start_date), 'dd.MM.yyyy', { locale: de }) : '-'}
                      {' - '}
                      {course.fields.end_date ? format(new Date(course.fields.end_date), 'dd.MM.yyyy', { locale: de }) : '-'}
                    </div>
                  </TableCell>
                  <TableCell>{course.fields.max_participants || '-'}</TableCell>
                  <TableCell>{course.fields.price ? `${course.fields.price.toFixed(2)} €` : '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(course)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirm onConfirm={() => handleDelete(course.record_id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Instructors Tab
function InstructorsTab({ instructors, setInstructors, loading }: {
  instructors: Instructors[];
  setInstructors: React.Dispatch<React.SetStateAction<Instructors[]>>;
  loading: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Instructors | null>(null);
  const [formData, setFormData] = useState<Instructors['fields']>({});

  const openCreate = () => {
    setEditingItem(null);
    setFormData({});
    setDialogOpen(true);
  };

  const openEdit = (item: Instructors) => {
    setEditingItem(item);
    setFormData({ ...item.fields });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await LivingAppsService.updateInstructor(editingItem.record_id, formData);
        setInstructors(await LivingAppsService.getInstructors());
      } else {
        await LivingAppsService.createInstructor(formData);
        setInstructors(await LivingAppsService.getInstructors());
      }
      setDialogOpen(false);
    } catch (e) {
      console.error('Error saving instructor:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteInstructor(id);
      setInstructors(prev => prev.filter(i => i.record_id !== id));
    } catch (e) {
      console.error('Error deleting instructor:', e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dozenten</CardTitle>
          <CardDescription>Verwalten Sie alle Dozenten</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Dozent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Dozent bearbeiten' : 'Neuer Dozent'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Ändern Sie die Dozentendaten' : 'Erstellen Sie einen neuen Dozenten'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expertise">Fachgebiet</Label>
                <Input
                  id="expertise"
                  value={formData.expertise || ''}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSave}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : instructors.length === 0 ? (
          <EmptyState message="Keine Dozenten vorhanden" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Fachgebiet</TableHead>
                <TableHead className="w-24">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((item) => (
                <TableRow key={item.record_id}>
                  <TableCell className="font-medium">{item.fields.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {item.fields.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.fields.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {item.fields.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.fields.expertise && <Badge variant="secondary">{item.fields.expertise}</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirm onConfirm={() => handleDelete(item.record_id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Participants Tab
function ParticipantsTab({ participants, setParticipants, loading }: {
  participants: Participants[];
  setParticipants: React.Dispatch<React.SetStateAction<Participants[]>>;
  loading: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Participants | null>(null);
  const [formData, setFormData] = useState<Participants['fields']>({});

  const openCreate = () => {
    setEditingItem(null);
    setFormData({});
    setDialogOpen(true);
  };

  const openEdit = (item: Participants) => {
    setEditingItem(item);
    setFormData({ ...item.fields });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await LivingAppsService.updateParticipant(editingItem.record_id, formData);
        setParticipants(await LivingAppsService.getParticipants());
      } else {
        await LivingAppsService.createParticipant(formData);
        setParticipants(await LivingAppsService.getParticipants());
      }
      setDialogOpen(false);
    } catch (e) {
      console.error('Error saving participant:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteParticipant(id);
      setParticipants(prev => prev.filter(p => p.record_id !== id));
    } catch (e) {
      console.error('Error deleting participant:', e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Teilnehmer</CardTitle>
          <CardDescription>Verwalten Sie alle Teilnehmer</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Teilnehmer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Teilnehmer bearbeiten' : 'Neuer Teilnehmer'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Ändern Sie die Teilnehmerdaten' : 'Erstellen Sie einen neuen Teilnehmer'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthdate">Geburtsdatum</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate || ''}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSave}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : participants.length === 0 ? (
          <EmptyState message="Keine Teilnehmer vorhanden" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Geburtsdatum</TableHead>
                <TableHead className="w-24">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((item) => (
                <TableRow key={item.record_id}>
                  <TableCell className="font-medium">{item.fields.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {item.fields.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.fields.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {item.fields.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.fields.birthdate ? format(new Date(item.fields.birthdate), 'dd.MM.yyyy', { locale: de }) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirm onConfirm={() => handleDelete(item.record_id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Rooms Tab
function RoomsTab({ rooms, setRooms, loading }: {
  rooms: Rooms[];
  setRooms: React.Dispatch<React.SetStateAction<Rooms[]>>;
  loading: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Rooms | null>(null);
  const [formData, setFormData] = useState<Rooms['fields']>({});

  const openCreate = () => {
    setEditingItem(null);
    setFormData({});
    setDialogOpen(true);
  };

  const openEdit = (item: Rooms) => {
    setEditingItem(item);
    setFormData({ ...item.fields });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await LivingAppsService.updateRoom(editingItem.record_id, formData);
        setRooms(await LivingAppsService.getRooms());
      } else {
        await LivingAppsService.createRoom(formData);
        setRooms(await LivingAppsService.getRooms());
      }
      setDialogOpen(false);
    } catch (e) {
      console.error('Error saving room:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteRoom(id);
      setRooms(prev => prev.filter(r => r.record_id !== id));
    } catch (e) {
      console.error('Error deleting room:', e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Räume</CardTitle>
          <CardDescription>Verwalten Sie alle Räume</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Raum
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Raum bearbeiten' : 'Neuer Raum'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Ändern Sie die Raumdaten' : 'Erstellen Sie einen neuen Raum'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="room_name">Raumname *</Label>
                <Input
                  id="room_name"
                  value={formData.room_name || ''}
                  onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="building">Gebäude</Label>
                <Input
                  id="building"
                  value={formData.building || ''}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Kapazität</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSave}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : rooms.length === 0 ? (
          <EmptyState message="Keine Räume vorhanden" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raumname</TableHead>
                <TableHead>Gebäude</TableHead>
                <TableHead>Kapazität</TableHead>
                <TableHead className="w-24">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((item) => (
                <TableRow key={item.record_id}>
                  <TableCell className="font-medium">{item.fields.room_name}</TableCell>
                  <TableCell>{item.fields.building || '-'}</TableCell>
                  <TableCell>
                    {item.fields.capacity && (
                      <Badge variant="outline">{item.fields.capacity} Plätze</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirm onConfirm={() => handleDelete(item.record_id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Registrations Tab
function RegistrationsTab({ registrations, setRegistrations, participants, courses, loading, getParticipantName, getCourseName }: {
  registrations: Registrations[];
  setRegistrations: React.Dispatch<React.SetStateAction<Registrations[]>>;
  participants: Participants[];
  courses: Courses[];
  loading: boolean;
  getParticipantName: (url?: string) => string;
  getCourseName: (url?: string) => string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Registrations | null>(null);
  const [formData, setFormData] = useState<Registrations['fields']>({});

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ registration_date: format(new Date(), 'yyyy-MM-dd') });
    setDialogOpen(true);
  };

  const openEdit = (item: Registrations) => {
    setEditingItem(item);
    setFormData({ ...item.fields });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await LivingAppsService.updateRegistration(editingItem.record_id, formData);
        setRegistrations(await LivingAppsService.getRegistrations());
      } else {
        await LivingAppsService.createRegistration(formData);
        setRegistrations(await LivingAppsService.getRegistrations());
      }
      setDialogOpen(false);
    } catch (e) {
      console.error('Error saving registration:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteRegistration(id);
      setRegistrations(prev => prev.filter(r => r.record_id !== id));
    } catch (e) {
      console.error('Error deleting registration:', e);
    }
  };

  const togglePaid = async (item: Registrations) => {
    try {
      await LivingAppsService.updateRegistration(item.record_id, { paid: !item.fields.paid });
      setRegistrations(await LivingAppsService.getRegistrations());
    } catch (e) {
      console.error('Error toggling paid:', e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Anmeldungen</CardTitle>
          <CardDescription>Verwalten Sie alle Kursanmeldungen</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Anmeldung
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Anmeldung bearbeiten' : 'Neue Anmeldung'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Ändern Sie die Anmeldung' : 'Erstellen Sie eine neue Anmeldung'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Teilnehmer *</Label>
                <Select
                  value={extractRecordId(formData.participant) || ''}
                  onValueChange={(val) => setFormData({ ...formData, participant: val ? createRecordUrl(APP_IDS.PARTICIPANTS, val) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Teilnehmer auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((part) => (
                      <SelectItem key={part.record_id} value={part.record_id}>
                        {part.fields.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Kurs *</Label>
                <Select
                  value={extractRecordId(formData.course) || ''}
                  onValueChange={(val) => setFormData({ ...formData, course: val ? createRecordUrl(APP_IDS.COURSES, val) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kurs auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.record_id} value={course.record_id}>
                        {course.fields.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registration_date">Anmeldedatum *</Label>
                <Input
                  id="registration_date"
                  type="date"
                  value={formData.registration_date || ''}
                  onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="paid"
                  checked={formData.paid || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, paid: checked === true })}
                />
                <Label htmlFor="paid">Bezahlt</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSave}>Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : registrations.length === 0 ? (
          <EmptyState message="Keine Anmeldungen vorhanden" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teilnehmer</TableHead>
                <TableHead>Kurs</TableHead>
                <TableHead>Anmeldedatum</TableHead>
                <TableHead>Bezahlt</TableHead>
                <TableHead className="w-24">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((item) => (
                <TableRow key={item.record_id}>
                  <TableCell className="font-medium">{getParticipantName(item.fields.participant)}</TableCell>
                  <TableCell>{getCourseName(item.fields.course)}</TableCell>
                  <TableCell>
                    {item.fields.registration_date ? format(new Date(item.fields.registration_date), 'dd.MM.yyyy', { locale: de }) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.fields.paid ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => togglePaid(item)}
                    >
                      {item.fields.paid ? 'Bezahlt' : 'Offen'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirm onConfirm={() => handleDelete(item.record_id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Delete Confirmation Dialog
function DeleteConfirm({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Löschen bestätigen</AlertDialogTitle>
          <AlertDialogDescription>
            Sind Sie sicher, dass Sie diesen Eintrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Löschen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Empty State
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
