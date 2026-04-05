export declare class User {
    id: string;
    phone: string;
    password: string;
    role: 'buyer' | 'merchant' | 'admin';
    nickname: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}
