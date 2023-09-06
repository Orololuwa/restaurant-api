import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { Assertion, Attenstation } from 'src/lib/helpers/web-auth-n';

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

export interface IAssertRemove {
  user: Partial<User | Merchant>;
  assertion: Assertion;
  challenge: string;
}

export class GetResidentKeysDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class AttestateEndDTO {
  @IsNotEmpty()
  @IsString()
  rawId: string;

  @IsNotEmpty()
  @IsString()
  attestationObject: string;

  @IsNotEmpty()
  @IsString()
  clientDataJSON: string;
}

export class AssertEndRemoveDTO {
  @IsNotEmpty()
  @IsString()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  rawId: string;

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
