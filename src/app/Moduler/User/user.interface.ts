export interface Tadmin {
    password: string;
    admin: adminDetails;
}

interface adminDetails {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
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

