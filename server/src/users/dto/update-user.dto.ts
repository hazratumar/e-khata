import { PartialType } from "@nestjs/mapped-types";

import { Users } from "../entities/user.entity";

export class UpdateUserDto extends PartialType(Users) {}
