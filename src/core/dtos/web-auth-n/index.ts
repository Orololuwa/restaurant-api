import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { Assertion, Attenstation } from 'src/frameworks/web-auth-n/web-auth-n';

export interface IGetResidentKeys {
  id: number;
}

export interface IAttestateBegin {
  user: Partial<User | Merchant>;
}

export interface IAttestateEnd {
  user: Partial<User | Merchant>;
  attestation: Attenstation;
}

export interface IWebAuthLogin {
  assertion: Assertion;
  challenge: string;
}

export interface IAssertRemove extends IWebAuthLogin {
  user: Partial<User | Merchant>;
}

export class IAttestResponse {
  @IsNotEmpty()
  @IsString()
  attestationObject: string;

  @IsNotEmpty()
  @IsString()
  clientDataJSON: string;
}

export class AttestateEndDTO {
  @IsNotEmpty()
  @IsString()
  rawId: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => IAttestResponse)
  response: IAttestResponse;
}

export class IAssertResponse {
  @IsNotEmpty()
  @IsString()
  authenticatorData: string;

  @IsNotEmpty()
  @IsString()
  clientDataJSON: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class AssertEndRemoveDTO {
  @IsNotEmpty()
  @IsString()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  rawId: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => IAssertResponse)
  response: IAssertResponse;
}

export class IWebAuthLoginDTO {
  @IsNotEmpty()
  @IsString()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  rawId: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => IAssertResponse)
  response: IAssertResponse;
}
