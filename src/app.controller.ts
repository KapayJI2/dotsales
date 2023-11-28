import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { QueryRequired } from 'decorators/required-query.decorator';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserOrCreate(
    @QueryRequired('name') name: string,
    @QueryRequired('email') email: string,
    @QueryRequired('phone') phone: string,
    @Res() response: Response,
  ): Promise<Response<any>> {
    try {
      const result = await this.appService.findOrCreateClient(
        name,
        email,
        phone,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (e) {
      if (e instanceof Error) {
        return response.status(HttpStatus.BAD_REQUEST).send(e.message);
      }
    }
  }
}
