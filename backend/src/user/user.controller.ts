import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Patch,
  Get,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SetAdminDto } from './dto/create-user.dto';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';
import { Profile, UserLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppException } from '../exceptions/app.exception';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('set-default')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async setDefault(@Body() setDefaultDto: SetAdminDto) {
    return await this.userService.setDefault(setDefaultDto);
  }

  @Post('set-admin')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async setAdmin(@Body() setAdminDto: SetAdminDto) {
    return await this.userService.setAdmin(setAdminDto);
  }

  @Post('set-super-admin')
  @UserLevels(UserLevel.Superadmin)
  @ApiBearerAuth()
  async setSuperAdmin(@Body() setAdminDto: SetAdminDto) {
    return await this.userService.setSuperAdmin(setAdminDto);
  }

  @Delete('delete/:id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Patch('toggle-activation/:id')
  @UserLevels(UserLevel.Superadmin)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'activate',
    required: true,
    description: 'Activate or deactivate the user.',
  })
  @ApiTags('Users')
  async toggleUserActivation(
    @Param('id') id: string,
    @Query('activate') activate: boolean,
  ) {
    if (activate === undefined) {
      throw new AppException('O campo "activate" é obrigatório.', 400);
    }

    return this.userService.toggleUserActivation(id, activate);
  }

  // --- NEW ENDPOINT FOR APPROVING TEACHERS ---
  /**
   * Approves a user with the PROFESSOR role.
   * Only accessible by users with ADMIN or SUPERADMIN roles.
   * @param id - The ID of the user to be approved.
   */
  @Patch(':id/approve') // Handles PATCH requests to /users/:id/approve
  @UseGuards(JwtAuthGuard, UserLevelGuard) // Protects the route, checking for a valid JWT and then the user's role.
  @UserLevels(UserLevel.Admin, UserLevel.Superadmin) // Specifies that only ADMIN and SUPERADMIN can access this.
  async approveTeacher(@Param('id') id: string) {
    // @Param('id') grabs the 'id' from the URL as a string.
    // We then call the corresponding service method to handle the logic.
    return this.userService.approveTeacher(id);
  }

  // --- NEW ENDPOINT FOR PROMOTING TO SUPERADMIN ---
  /**
   * Promotes a user to SUPERADMIN.
   * Only accessible by users who are already SUPERADMINs.
   * @param id - The ID of the user to be promoted.
   */
  @Patch(':id/promote') // Handles PATCH requests to /users/:id/promote
  @UseGuards(JwtAuthGuard, UserLevelGuard) // Same protection mechanism.
  @UserLevels(UserLevel.Superadmin) // Stricter: only a SUPERADMIN can promote another user.
  async promoteToSuperadmin(@Param('id') id: string) {
    return this.userService.promoteToSuperadmin(id);
  }

  @Get()
  @ApiQuery({
    name: 'roles',
    required: false,
    description:
      'Filter by user levels (e.g., Admin, Default). Accepts multiple values.',
  })
  @ApiQuery({
    name: 'profiles',
    required: false,
    description:
      'Filter by profiles (e.g., Professor, Listener). Accepts multiple values.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by user status (e.g., Active, Inactive).',
  })
  @UserLevels(UserLevel.Default, UserLevel.Admin, UserLevel.Superadmin)
  @ApiBearerAuth()
  async getUsers(
    @Query('roles') roles?: string | string[],
    @Query('profiles') profiles?: string | string[],
    @Query('status') status?: string,
  ) {
    const toArray = (input?: string | string[]): string[] => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      return input.split(',').map((value) => value.trim());
    };

    const rolesArray = roles ? toArray(roles) : undefined;
    const profilesArray = profiles ? toArray(profiles) : undefined;

    return await this.userService.findAll(rolesArray, profilesArray, status);
  }

  @Get('advisors')
  @UserLevels(UserLevel.Default, UserLevel.Admin, UserLevel.Superadmin)
  @ApiBearerAuth()
  async getAdvisors() {
    return await this.userService.findAll(undefined, Profile.Professor);
  }

  @Get('admins')
  @UserLevels(UserLevel.Default, UserLevel.Admin, UserLevel.Superadmin)
  @ApiBearerAuth()
  async getAdmins() {
    return await this.userService.findAll(
      [UserLevel.Superadmin, UserLevel.Admin],
      undefined,
    );
  }

  @Post('confirm-email')
  async confirmEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    const confirmed = await this.userService.confirmEmail(token);
    if (confirmed) {
      return { message: 'E-mail confirmado com sucesso.' };
    } else {
      throw new AppException(
        'Falha ao confirmar o e-mail.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @Post('approve-teacher')
  // @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  // @ApiBearerAuth()
  // @ApiTags('Users')
  // async approveTeacher(@Body() setTeacherApprovalDto: SetTeacherApprovalDto) {
  //   return await this.userService.approveTeacher(setTeacherApprovalDto);
  // }

  // @Post('reject-teacher')
  // @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  // @ApiBearerAuth()
  // @ApiTags('Users')
  // async rejectTeacher(@Body() setTeacherApprovalDto: SetTeacherApprovalDto) {
  //   return await this.userService.rejectTeacher(setTeacherApprovalDto);
  // }

  // @Get('pending-teachers')
  // @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  // @ApiBearerAuth()
  // @ApiTags('Users')
  // async getPendingTeachers() {
  //   return await this.userService.findAll(
  //     undefined, // roles
  //     ['Professor'], // profiles - only professors
  //     'Inactive', // status - inactive users (pending approval)
  //   );
  // }
}
