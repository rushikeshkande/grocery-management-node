import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import { AddUser, Login, DeleteUser } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all-users')
  @ApiOperation({ title: 'Get users details' })
  async getAllUsers(@Res() res: Response): Promise<any> {
    const details = await this.userService.getUsers();
    res.json(details);
  }

  @Post('add-user')
  @ApiOperation({ title: 'Add new user' })
  async addUser(@Res() res: Response, @Body() payload: AddUser): Promise<any> {
    const user = await this.userService.create(payload);
    res.status(200).json(user);
  }

  @Post('login')
  @ApiOperation({ title: 'user login' })
  async userLogin(@Res() res: Response, @Body() payload: Login): Promise<any> {
    try {
      const loginResult = await this.userService.login(payload);
      if (!loginResult) {
        return res.json({ status: 'invalid', error: 'Email Already Exist' });
      }
      res.status(200).json(loginResult);
    } catch (error) {
      throw error;
    }
  }

  @Post('update')
  @ApiOperation({ title: 'update user data' })
  async updateUser(@Res() res: Response, @Body() payload: Login): Promise<any> {
    const updateResult = await this.userService.updateData(payload);
    res.status(200).json(updateResult);
  }

  @Delete('delete/:id')
  @ApiOperation({ title: 'delete user' })
  async deleteUser(@Res() res: Response, @Param('id') id): Promise<any> {
    console.log(id);
    const deleteResult = await this.userService.deleteUser(id);
    res.status(200);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Res() res: Response, @UploadedFile() file) {
    const data = await this.userService.upload(file);
    res.status(200).json(data);
  }
}
