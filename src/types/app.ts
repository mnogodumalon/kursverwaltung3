// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Instructors {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    expertise?: string;
  };
}

export interface Participants {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    birthdate?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface Rooms {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    room_name?: string;
    building?: string;
    capacity?: number;
  };
}

export interface Courses {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    title?: string;
    description?: string;
    start_date?: string; // Format: YYYY-MM-DD oder ISO String
    end_date?: string; // Format: YYYY-MM-DD oder ISO String
    max_participants?: number;
    price?: number;
    instructor?: string; // applookup -> URL zu 'Instructors' Record
    room?: string; // applookup -> URL zu 'Rooms' Record
  };
}

export interface Registrations {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    participant?: string; // applookup -> URL zu 'Participants' Record
    course?: string; // applookup -> URL zu 'Courses' Record
    registration_date?: string; // Format: YYYY-MM-DD oder ISO String
    paid?: boolean;
  };
}

export const APP_IDS = {
  INSTRUCTORS: '6984b504bfd6a9410e217ae1',
  PARTICIPANTS: '6984b505617b70db5253a171',
  ROOMS: '6984b505b304961dda269765',
  COURSES: '6984b506c37f90e1f52c8c93',
  REGISTRATIONS: '6984b50673ae2e4191f23f4b',
} as const;

// Helper Types for creating new records
export type CreateInstructors = Instructors['fields'];
export type CreateParticipants = Participants['fields'];
export type CreateRooms = Rooms['fields'];
export type CreateCourses = Courses['fields'];
export type CreateRegistrations = Registrations['fields'];