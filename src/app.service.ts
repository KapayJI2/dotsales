import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from 'models/token.model';
import { Model } from 'mongoose';
import { StartConveyor } from 'utils/fetch_url.util';
import { checkToken, refreshToken } from 'utils/refresh_token.util';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}
  async findOrCreateClient(
    name: string,
    email: string,
    phone: string,
  ): Promise<any> {
    try {
      let { _id, access_token, refresh_token, refresh_time } = (
        await this.tokenModel.find().exec()
      )[0];
      const isExpired = await checkToken(refresh_time);
      if (isExpired) {
        const newToken = await refreshToken(refresh_token);
        newToken.refresh_time = new Date().getTime();
        access_token = (
          await this.tokenModel
            .findOneAndUpdate({ _id }, { $set: { ...newToken } }, { new: true })
            .exec()
        ).access_token;
      }
      return await StartConveyor(access_token, name, phone, email);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
}
