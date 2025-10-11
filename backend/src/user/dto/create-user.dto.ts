import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Profile {
  DoctoralStudent = 'DoctoralStudent',
  Professor = 'Professor',
  Listener = 'Listener',
}

export enum UserLevel {
  Superadmin = 'Superadmin',
  Admin = 'Admin',
  Default = 'Default',
}

export enum RegistrationNumberType {
  CPF = 'CPF',
  MATRICULA = 'MATRICULA',
}

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @ValidateIf((object) => object.profile === Profile.DoctoralStudent)
  @IsString()
  @Length(1, 20)
  registrationNumber?: string;

  @IsOptional()
  @IsEnum(RegistrationNumberType)
  registrationNumberType?: RegistrationNumberType;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  photoFilePath?: string;

  @IsEnum(Profile)
  profile?: Profile;

  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class CreateProfessorByAdminDto {
  @ApiProperty({
    description: 'Nome completo do professor',
    example: 'Dr. João Silva',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Email do professor (deve ser @ufba.br)',
    example: 'joao.silva@ufba.br',
    maxLength: 255,
  })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiProperty({
    description: 'Número de matrícula SIAPE do professor',
    example: '123456',
    maxLength: 20,
  })
  @IsString()
  @Length(1, 20)
  registrationNumber: string;

  @ApiProperty({
    description: 'Tipo do número de registro',
    enum: RegistrationNumberType,
    example: RegistrationNumberType.MATRICULA,
    required: false,
  })
  @IsOptional()
  @IsEnum(RegistrationNumberType)
  registrationNumberType?: RegistrationNumberType;

  @ApiProperty({
    description: 'Caminho para foto do perfil (opcional)',
    example: '/uploads/profile/photo.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  photoFilePath?: string;
}

export class SetAdminDto {
  @IsString()
  @Length(36)
  requestUserId: string;

  @IsString()
  @Length(36)
  targetUserId: string;
}
