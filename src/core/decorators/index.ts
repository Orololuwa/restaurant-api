import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/lib/helpers';

export const ROLES_KEY = 'role';
export const auth = (role: Role) => SetMetadata('role', role);
export const merchantAuth = (role: Role) => SetMetadata('merchant', role);
export const isRestaurant = () => SetMetadata('restaurant-check', true);
