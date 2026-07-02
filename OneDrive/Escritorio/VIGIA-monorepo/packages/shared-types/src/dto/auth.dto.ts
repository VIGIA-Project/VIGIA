export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    access_token: string;
    must_change_password: boolean;
    role: 'ADMIN' | 'GUARD' | 'OWNER';
}