export interface Tadmin {
    password: string;
    admin: adminDetails;
}
export interface Tdoctor {
    password: string;
    doctor: doctorDetails;
}
export interface Tpatient {
    password: string;
    patient: patientDetails;
}

export interface adminDetails {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
}
export interface patientDetails {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
    address: string;
}

export interface doctorDetails {
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: 'MALE' | 'FEMALE';
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    averageRating: number;
}

export type TfileUploadInfo = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
} | undefined;

export interface TuserQuery {
    email?: string;
    searchTerm?: string;
}
