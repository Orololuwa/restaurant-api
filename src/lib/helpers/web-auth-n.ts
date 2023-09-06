import { decode, encode } from 'base64-arraybuffer';
import { Fido2Lib, Fido2LibOptions } from 'fido2-lib';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { UniqueId } from '../utils';

const opts: Fido2LibOptions = {
  timeout: 30 * 1000,
  rpId: process.env.WEBAUTHN_RP_ID ?? 'localhost',
  rpName: 'restaurant-api',
  rpIcon: 'https://media.antony.red/logoTransparent.png',
  challengeSize: 128,
  attestation: 'direct',
  cryptoParams: [-7, -257],
  authenticatorAttachment: 'cross-platform',
  authenticatorUserVerification: 'discouraged',
};

const fido2 = new Fido2Lib({ ...opts, authenticatorRequireResidentKey: false });
const fido2Resident = new Fido2Lib({
  ...opts,
  authenticatorRequireResidentKey: true,
});

export type Attenstation = {
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
};

export type Assertion = {
  rawId: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle?: string;
  };
};

const challenges: Record<UniqueId, string> = {};

// memory cleanup
setInterval(() => {
  console.log(
    'Scheduled challange memory cleanup',
    Object.keys(challenges).length + ' challanges',
  );
  Object.keys(challenges).forEach((it) => delete challenges[it]);
}, 10 * 60 * 1000);

type IFidoUser = Partial<Merchant | User>;

export type UserWebauthn = {
  publicKey: string;
  credentialId: string;
};

export const WebAuthN = {
  attestate: async (user: IFidoUser, resident = false) => {
    const options = await (resident
      ? fido2Resident
      : fido2
    ).attestationOptions();
    options.user = {
      id: user.id.toString(),
      name: user.email,
      displayName: `${user?.firstName} ${user?.lastName}`,
    };

    const encoded = { ...options, challenge: encode(options.challenge) };
    challenges[user.id] = encoded.challenge;

    return encoded;
  },

  verifyAttestation: async (
    user: IFidoUser,
    attestation: Attenstation,
    resident = false,
  ): Promise<UserWebauthn> => {
    const result = await (resident ? fido2Resident : fido2).attestationResult(
      {
        ...attestation,
        rawId: decode(attestation.rawId),
      },
      {
        rpId: opts.rpId,
        challenge: challenges[user.id],
        origin: process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:2024',
        factor: 'either',
      },
    );

    return {
      credentialId: encode(result.clientData.get('rawId')),
      publicKey: result.authnrData.get('credentialPublicKeyPem'),
    };
  },

  assert: async (user: IFidoUser, auth: UserWebauthn) => {
    const options = await fido2.assertionOptions();

    const encoded = {
      ...options,
      challenge: encode(options.challenge),
      allowCredentials: [
        {
          type: 'public-key',
          id: auth.credentialId,
          transports: ['usb', 'ble', 'nfc'],
        },
      ],
    };
    challenges[user.id] = encoded.challenge;

    return encoded;
  },

  verifyAssertion: async (
    user: IFidoUser,
    assertion: Assertion,
    auth: UserWebauthn,
  ): Promise<boolean> => {
    return fido2
      .assertionResult(
        {
          ...assertion,
          rawId: decode(assertion.rawId),
          response: {
            ...assertion.response,
            authenticatorData: decode(assertion.response.authenticatorData),
          },
        },
        {
          challenge: challenges[user.id],
          origin: process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:2024',
          factor: 'either',
          publicKey: auth.publicKey,
          prevCounter: 0,
          userHandle: null,
        },
      )
      .then(() => true)
      .catch(() => false);
  },

  assertResident: async () => {
    const options = await fido2Resident.assertionOptions();

    const encoded = {
      ...options,
      challenge: encode(options.challenge),
    };

    return encoded;
  },

  verifyAssertionResident: async (
    challenge: string,
    auth: UserWebauthn,
    assertion: Assertion,
  ): Promise<boolean> => {
    return fido2Resident
      .assertionResult(
        {
          ...assertion,
          rawId: decode(assertion.rawId),
          response: {
            ...assertion.response,
            authenticatorData: decode(assertion.response.authenticatorData),
          },
        },
        {
          challenge,
          origin: process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:2024',
          factor: 'either',
          publicKey: auth.publicKey,
          prevCounter: 0,
          userHandle: null,
        },
      )
      .then(() => true)
      .catch(() => false);
  },
};
